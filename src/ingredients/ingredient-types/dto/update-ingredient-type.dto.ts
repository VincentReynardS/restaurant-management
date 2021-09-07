import { IsMimeType, IsNotEmpty, IsString } from 'class-validator';

export class UpdateIngredientTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
