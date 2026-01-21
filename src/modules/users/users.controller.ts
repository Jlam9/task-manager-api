import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestUser } from '../../common/interfaces/request-user.interface';
import { UserMeDto } from './dto/user-me.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':uuid')
  @ApiOkResponse({ type: UserMeDto })
  async getByUuid(
    @CurrentUser() user: RequestUser,
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<UserMeDto> {
    if (user.uuid !== uuid) {
      throw new ForbiddenException('Sin permiso para el usuario');
    }
    const entity = await this.usersService.findByUuid(uuid);
    if (!entity || !entity.estado) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return {
      uuid: entity.uuid,
      email: entity.email,
      nombre: entity.nombre ?? null,
    };
  }
}
