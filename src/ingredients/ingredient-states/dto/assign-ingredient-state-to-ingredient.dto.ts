import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignIngredientStateToIngredientDto {
  @IsNotEmpty()
  @IsString()
  ingredientStateId: string;

  @IsArray()
  @ArrayNotEmpty()
  ingredientIds: string[];
}
