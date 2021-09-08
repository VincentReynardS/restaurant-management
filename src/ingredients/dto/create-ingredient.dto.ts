import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  measurementUnitId: string;

  @IsNotEmpty()
  @IsString()
  ingredientStateId: string;

  @IsNotEmpty()
  @IsString()
  ingredientTypeId: string;
}
