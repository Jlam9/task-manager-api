import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findByUuid(uuid: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { uuid } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createSeedUserIfNotExists(
    email: string,
    plainPassword: string,
    nombre?: string,
  ): Promise<UserEntity> {
    const existing = await this.findByEmail(email);
    if (existing) {
      return existing;
    }
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const user = this.usersRepository.create({
      email,
      passwordHash,
      nombre: nombre ?? null,
    });
    return this.usersRepository.save(user);
  }
}