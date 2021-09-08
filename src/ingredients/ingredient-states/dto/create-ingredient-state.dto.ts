import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIngredientStateDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
