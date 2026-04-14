import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateYearTopicDto {
  @IsString()
  @IsNotEmpty({ message: 'El id del topico no puede estar vacio' })
  topicId: string = '';

  @IsNumber()
  @IsNotEmpty({ message: 'La cantidad de minutos objetivo del año no puede estar vacia' })
  goalMinutes: number = 0;
}