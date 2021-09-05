import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMesurementUnitDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  precision: number;

  @IsNotEmpty()
  @IsString()
  abbreviation: string;
}
