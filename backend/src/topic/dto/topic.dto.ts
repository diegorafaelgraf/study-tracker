import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTopicDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty({ message: 'El Nombre del Área no puede estar vacio' })
  name: string = '';

  @IsOptional()
  @IsString()
  icon?: string;
}