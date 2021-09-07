import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';
import { IngredientType } from './ingredient-type.entity';

@EntityRepository(IngredientType)
export class IngredientTypeRepository extends Repository<IngredientType> {
  async createIngredientType(
    createIngredientTypeDto: CreateIngredientTypeDto,
  ): Promise<IngredientType> {
    const { name } = createIngredientTypeDto;

    const ingredientType = new IngredientType();
    ingredientType.name = name;

    try {
      await ingredientType.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Ingredient type ${name} already exists`);
      } else {
        console.log(error.stack);
        throw new InternalServerErrorException();
      }
    }

    return ingredientType;
  }

  async getIngredientTypes(): Promise<IngredientType[]> {
    const query = this.createQueryBuilder('ingredient_type');

    try {
      return query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateIngredientType(
    id,
    updateIngredientTypeDto: UpdateIngredientTypeDto,
  ): Promise<IngredientType> {
    const { name } = updateIngredientTypeDto;

    const ingredientType = await this.findOne(id);
    ingredientType.name = name;

    try {
      await ingredientType.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Ingredient type ${name} already exists`);
      }
    }

    return ingredientType;
  }
}
