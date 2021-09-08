import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignMeasurementUnitToIngredientDto {
  @IsNotEmpty()
  @IsString()
  measurementUnitId: string;

  @IsArray()
  @ArrayNotEmpty()
  ingredientIds: string[];
}
