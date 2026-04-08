import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTopicDto {
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  @IsNotEmpty({ message: 'El Nombre del Tópico no puede estar vacio' })
  name!: string;
}