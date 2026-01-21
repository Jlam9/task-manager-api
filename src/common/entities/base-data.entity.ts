import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

export class BaseDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @Column({ name: 'estado', type: 'boolean', default: true })
  estado: boolean;

  @Index({ unique: true })
  @Column({ name: 'uuid' })
  @Generated('uuid')
  uuid: string;
}

export default BaseDataEntity;