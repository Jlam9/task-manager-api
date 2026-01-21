import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Actualizar reporte mensual' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  titulo?: string;

  @ApiPropertyOptional({ example: 'Nuevos datos incluidos.' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  completada?: boolean;

  @ApiPropertyOptional({ example: '2026-02-05T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fechaEntrega?: string;

  @ApiPropertyOptional({ example: 'Validar con legal' })
  @IsOptional()
  @IsString()
  comentarios?: string;

  @ApiPropertyOptional({ example: 'Carlos' })
  @IsOptional()
  @IsString()
  responsable?: string;

  @ApiPropertyOptional({ example: ['finanzas', 'urgente'] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];
}