import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { InflowReason } from '../inflow-reason.enum';

export class CreateInflowDto {
  @IsNotEmpty()
  @IsString()
  ingredientId: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  reason: InflowReason;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  additionalDetails: string;
}
