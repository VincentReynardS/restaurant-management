import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateIngredientStateDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
