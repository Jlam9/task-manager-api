import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskBriefDto } from './dto/task-brief.dto';
import { TaskDetailDto } from './dto/task-detail.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    private readonly usersService: UsersService,
  ) {}

  async listTasks(userUuid: string): Promise<TaskBriefDto[]> {
    const tasks = await this.tasksRepository.find({
      where: {
        user: { uuid: userUuid },
        estado: true,
      },
      order: {
        fechaEntrega: 'ASC',
        fechaCreacion: 'DESC',
      },
    });
    return tasks.map((task) => this.toBriefDto(task));
  }

  async getTaskDetail(
    userUuid: string,
    taskUuid: string,
  ): Promise<TaskDetailDto> {
    const task = await this.findTaskOrFail(taskUuid);
    this.assertOwnership(task, userUuid);
    return this.toDetailDto(task);
  }

  async createTask(
    userUuid: string,
    dto: CreateTaskDto,
  ): Promise<TaskDetailDto> {
    const user = await this.usersService.findByUuid(userUuid);
    if (!user || !user.estado) {
      throw new ForbiddenException('Usuario invalido');
    }
    const task = this.tasksRepository.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      completada: dto.completada,
      fechaEntrega: new Date(dto.fechaEntrega),
      comentarios: dto.comentarios ?? null,
      responsable: dto.responsable ?? null,
      tags: dto.tags ?? [],
      user,
    });
    const saved = await this.tasksRepository.save(task);
    return this.toDetailDto(saved);
  }

  async updateTask(
    userUuid: string,
    taskUuid: string,
    dto: UpdateTaskDto,
  ): Promise<TaskDetailDto> {
    const task = await this.findTaskOrFail(taskUuid);
    this.assertOwnership(task, userUuid);

    if (dto.titulo !== undefined) {
      task.titulo = dto.titulo;
    }
    if (dto.descripcion !== undefined) {
      task.descripcion = dto.descripcion;
    }
    if (dto.completada !== undefined) {
      task.completada = dto.completada;
    }
    if (dto.fechaEntrega !== undefined) {
      task.fechaEntrega = new Date(dto.fechaEntrega);
    }
    if (dto.comentarios !== undefined) {
      task.comentarios = dto.comentarios ?? null;
    }
    if (dto.responsable !== undefined) {
      task.responsable = dto.responsable ?? null;
    }
    if (dto.tags !== undefined) {
      task.tags = dto.tags;
    }

    const saved = await this.tasksRepository.save(task);
    return this.toDetailDto(saved);
  }

  async deleteTask(userUuid: string, taskUuid: string): Promise<void> {
    const task = await this.findTaskOrFail(taskUuid);
    this.assertOwnership(task, userUuid);
    await this.tasksRepository.softRemove(task);
  }

  private async findTaskOrFail(taskUuid: string): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne({
      where: { uuid: taskUuid },
      relations: ['user'],
    });
    if (!task || !task.estado) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return task;
  }

  private assertOwnership(task: TaskEntity, userUuid: string) {
    if (task.user.uuid !== userUuid) {
      throw new ForbiddenException('Sin permiso para la tarea');
    }
  }

  private toBriefDto(task: TaskEntity): TaskBriefDto {
    return {
      uuid: task.uuid,
      titulo: task.titulo,
      completada: task.completada,
      fechaEntrega: task.fechaEntrega,
      responsable: task.responsable ?? null,
      tags: task.tags ?? [],
    };
  }

  private toDetailDto(task: TaskEntity): TaskDetailDto {
    return {
      uuid: task.uuid,
      titulo: task.titulo,
      descripcion: task.descripcion,
      completada: task.completada,
      fechaEntrega: task.fechaEntrega,
      comentarios: task.comentarios ?? null,
      responsable: task.responsable ?? null,
      tags: task.tags ?? [],
      fechaCreacion: task.fechaCreacion,
      fechaActualizacion: task.fechaActualizacion,
    };
  }
}