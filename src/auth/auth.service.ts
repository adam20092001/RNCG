import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async login(mail: string, password: string) {
    const user = await this.userRepo.findOneBy({ mail });

    if (!user) {
      throw new UnauthorizedException('Correo no encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
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

    return await this.userRepo.save(newUser);
  }
  async resetPassword(mail: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepo.findOneBy({ mail });
    if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepo.save(user);
    return true;
  }
}
