import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateYearDto {
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  @IsNotEmpty({ message: 'El año no puede estar vacio' })
  year: string = '';

  @IsNumber()
  @IsNotEmpty({ message: 'La cantidad de días del año no puede estar vacia' })
  totalDays: number = 0;
}