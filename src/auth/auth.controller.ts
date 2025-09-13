import { Controller, Post, Body, NotFoundException, Query, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { sendVerificationEmail } from 'src/mailer.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  @Post('login')
  login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }
  @Post('register')
  async register(@Body() body: { name: string, lastname: string, mail: string, password: string }) {
    return this.authService.register(body);
  }
  @Post('forgot-password')
  async forgotPassword(@Body('mail') mail: string) {
    return this.authService.forgotPassword(mail);
  }
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.authService.resetPasswordWithToken(token, newPassword);
      return { message: '✅ Contraseña actualizada correctamente' };
    } catch (err) {
      throw new UnauthorizedException('El enlace de recuperación no es válido o ha expirado');
    }
  }
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.userRepo.findOneBy({ id: payload.userId });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.emailVerified = true;
    await this.userRepo.save(user);

    return { message: '✅ Correo verificado exitosamente' };
  }
  @Post('resend-verification')
  async resendVerification(@Body('mail') mail: string) {
    const user = await this.userRepo.findOneBy({ mail });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.emailVerified) {
      return { message: 'El correo ya ha sido verificado' };
    }

    const token = this.jwtService.sign({ userId: user.id });
    await sendVerificationEmail(user.mail, token);

    return { message: '📨 Correo de verificación reenviado' };
  }


}
