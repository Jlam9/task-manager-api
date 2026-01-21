import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('sessions')
@Controller('sessions')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiCreatedResponse({ type: LoginResponseDto })
  createSession(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
