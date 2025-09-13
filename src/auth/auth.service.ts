import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { sendPasswordResetEmail, sendVerificationEmail } from 'src/mailer.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async login(mail: string, password: string) {
    const user = await this.userRepo.findOneBy({ mail });

    if (!user) {
      throw new UnauthorizedException('Correo no encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Debes verificar tu correo para iniciar sesión');
    }

    return {
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.mail,
      },
    };
  }
  async register(data: { name: string, lastname: string, mail: string, password: string }) {
    const existing = await this.userRepo.findOne({ where: { mail: data.mail } });
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = this.userRepo.create({
      name: data.name,
      lastname: data.lastname,
      mail: data.mail,
      password: hashedPassword,
    });
    const savedUser = await this.userRepo.save(newUser);
    //return await this.userRepo.save(newUser);

    // Genera token de verificación
    const token = this.jwtService.sign({ userId: savedUser.id });

    // Envía el correo
    await sendVerificationEmail(savedUser.mail, token);

    return { message: 'Usuario registrado. Verifica tu correo.' };

  }
  async forgotPassword(mail: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOneBy({ mail });
    if (!user) {
      throw new NotFoundException('El correo no se encuentra registrado');
    }

    // Genera token temporal (15 minutos de validez)
    const token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '15m' }
    );

    // Aquí usas tu servicio de correos
    await sendPasswordResetEmail(user.mail, token);

    return { message: '📨 Se ha enviado un enlace de recuperación al correo proporcionado' };
  }
  async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token); // valida firma y expiración
    } catch (e) {
      throw new UnauthorizedException('El enlace de recuperación no es válido o ha expirado');
    }

    const user = await this.userRepo.findOneBy({ id: payload.userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Hashear y guardar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepo.save(user);

    return true;
  }
}
