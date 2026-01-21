import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }
    if (!user.estado) {
      throw new ForbiddenException('Usuario deshabilitado');
    }
    const passwordMatches = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales invalidas');
    }
    const accessToken = await this.jwtService.signAsync({
      sub: user.uuid,
      email: user.email,
    });
    return {
      accessToken,
      user: {
        uuid: user.uuid,
        email: user.email,
        nombre: user.nombre ?? null,
      },
    };
  }
}