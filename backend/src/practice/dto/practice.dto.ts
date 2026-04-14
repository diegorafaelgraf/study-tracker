import { IsNotEmpty, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreatePracticeDto {
  @IsNotEmpty({ message: 'La fecha de la práctica no puede estar vacía' })
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  date!: Date;

  @IsNotEmpty({ message: 'La duración de la práctica no puede estar vacía' })
  @IsNumber({}, { message: 'La duración de la práctica debe ser un número' })
  durationMinutes!: number;

  @IsNotEmpty({ message: 'El tópico-año de la práctica no puede estar vacío' })
  @IsString({ message: 'El tópico-año de la práctica debe ser una cadena de texto' })
  yearTopicId!: string;
}