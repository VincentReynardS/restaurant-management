import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';

export class GetIngredientsFilterDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  ids?: string[];
}
