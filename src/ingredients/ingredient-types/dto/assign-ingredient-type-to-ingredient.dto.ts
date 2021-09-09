import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignIngredientTypeToIngredientDto {
  @IsNotEmpty()
  @IsString()
  ingredientTypeId: string;

  @IsArray()
  @ArrayNotEmpty()
  ingredientIds: string[];
}
