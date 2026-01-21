import { ApiProperty } from '@nestjs/swagger';

export class TaskDetailDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid: string;

  @ApiProperty({ example: 'Preparar reporte mensual' })
  titulo: string;

  @ApiProperty({ example: 'Consolidar datos y enviar a finanzas.' })
  descripcion: string;

  @ApiProperty({ example: false })
  completada: boolean;

  @ApiProperty({ example: '2026-02-01T10:00:00.000Z' })
  fechaEntrega: Date;

  @ApiProperty({ example: 'Revisar con el equipo', nullable: true })
  comentarios?: string | null;

  @ApiProperty({ example: 'Andrea', nullable: true })
  responsable?: string | null;

  @ApiProperty({ example: ['finanzas', 'mensual'] })
  tags: string[];

  @ApiProperty({ example: '2026-01-20T10:00:00.000Z' })
  fechaCreacion: Date;

  @ApiProperty({ example: '2026-01-21T10:00:00.000Z' })
  fechaActualizacion: Date;
}