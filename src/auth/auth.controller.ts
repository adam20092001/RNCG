import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @Post('reset-password')
  async resetPassword(
    @Body('mail') mail: string,
    @Body('newPassword') newPassword: string,
  ) {
    const result = await this.authService.resetPassword(mail, newPassword);
    if (!result) {
      throw new NotFoundException('Correo no registrado');
    }
    return { message: '✅ Contraseña actualizada correctamente' };
  }
}
