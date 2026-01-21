import { Column, Entity, Index } from 'typeorm';
import BaseDataEntity from '../../../common/entities/base-data.entity';

@Entity('users')
export class UserEntity extends BaseDataEntity {
  @Index({ unique: true })
  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'nombre', type: 'varchar', nullable: true })
  nombre: string | null;
}
