import { ApiProperty } from '@nestjs/swagger';

export class UserMeDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid: string;

  @ApiProperty({ example: 'admin@test.com' })
  email: string;

  @ApiProperty({ example: 'Admin', nullable: true })
  nombre?: string | null;
}