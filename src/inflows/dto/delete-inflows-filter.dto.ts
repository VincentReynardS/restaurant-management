import { IsOptional, IsString } from 'class-validator';

export class DeleteInflowsDto {
  @IsOptional()
  @IsString()
  ingredientId: string;
}
