import { IsNotEmpty, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreatePracticeDto {
  @IsNotEmpty({ message: 'La fecha del estudio no puede estar vacía' })
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  date!: Date;

  @IsNotEmpty({ message: 'La duración del estudio no puede estar vacía' })
  @IsNumber({}, { message: 'La duración del estudio debe ser un número' })
  durationMinutes!: number;

  @IsNotEmpty({ message: 'El área-año del estudio no puede estar vacío' })
  @IsString({ message: 'El área-año del estudio debe ser una cadena de texto' })
  yearTopicId!: string;
}