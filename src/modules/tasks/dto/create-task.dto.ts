import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Preparar reporte mensual' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @ApiProperty({ example: 'Consolidar datos y enviar a finanzas.' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  completada: boolean;

  @ApiProperty({ example: '2026-02-01T10:00:00.000Z' })
  @IsDateString()
  fechaEntrega: string;

  @ApiProperty({ example: 'Revisar con el equipo', required: false })
  @IsOptional()
  @IsString()
  comentarios?: string;

  @ApiProperty({ example: 'Andrea', required: false })
  @IsOptional()
  @IsString()
  responsable?: string;

  @ApiProperty({ example: ['finanzas', 'mensual'], required: false })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];
}