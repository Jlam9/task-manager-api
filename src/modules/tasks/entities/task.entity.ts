import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseDataEntity from '../../../common/entities/base-data.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('tasks')
export class TaskEntity extends BaseDataEntity {
  @Column({ name: 'titulo', length: 200 })
  titulo: string;

  @Column({ name: 'descripcion', type: 'text' })
  descripcion: string;

  @Column({ name: 'completada', type: 'boolean', default: false })
  completada: boolean;

  @Column({ name: 'fecha_entrega', type: 'timestamp' })
  fechaEntrega: Date;

  @Column({ name: 'comentarios', type: 'text', nullable: true })
  comentarios: string | null;

  @Column({ name: 'responsable', type: 'varchar', nullable: true })
  responsable: string | null;

  @Column({
    name: 'tags',
    type: 'jsonb',
    default: () => "'[]'",
  })
  tags: string[];

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
