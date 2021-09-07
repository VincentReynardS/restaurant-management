import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIngredientTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
