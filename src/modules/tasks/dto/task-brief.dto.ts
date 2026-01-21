import { ApiProperty } from '@nestjs/swagger';

export class TaskBriefDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid: string;

  @ApiProperty({ example: 'Preparar reporte mensual' })
  titulo: string;

  @ApiProperty({ example: false })
  completada: boolean;

  @ApiProperty({ example: '2026-02-01T10:00:00.000Z' })
  fechaEntrega: Date;

  @ApiProperty({ example: 'Andrea', nullable: true })
  responsable?: string | null;

  @ApiProperty({ example: ['finanzas', 'mensual'] })
  tags: string[];
}