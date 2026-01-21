import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestUser } from '../../common/interfaces/request-user.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskBriefDto } from './dto/task-brief.dto';
import { TaskDetailDto } from './dto/task-detail.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  @ApiOkResponse({ type: [TaskBriefDto] })
  listTasks(@CurrentUser() user: RequestUser): Promise<TaskBriefDto[]> {
    return this.tasksService.listTasks(user.uuid);
  }

  @Get(':uuid')
  @ApiOkResponse({ type: TaskDetailDto })
  getTask(
    @CurrentUser() user: RequestUser,
    @Param('uuid', new ParseUUIDPipe()) taskUuid: string,
  ): Promise<TaskDetailDto> {
    return this.tasksService.getTaskDetail(user.uuid, taskUuid);
  }

  @Post()
  @ApiCreatedResponse({ type: TaskDetailDto })
  createTask(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskDetailDto> {
    return this.tasksService.createTask(user.uuid, dto);
  }

  @Patch(':uuid')
  @ApiOkResponse({ type: TaskDetailDto })
  updateTask(
    @CurrentUser() user: RequestUser,
    @Param('uuid', new ParseUUIDPipe()) taskUuid: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskDetailDto> {
    return this.tasksService.updateTask(user.uuid, taskUuid, dto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  @ApiNoContentResponse()
  async deleteTask(
    @CurrentUser() user: RequestUser,
    @Param('uuid', new ParseUUIDPipe()) taskUuid: string,
  ): Promise<void> {
    await this.tasksService.deleteTask(user.uuid, taskUuid);
  }
}
