import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateIngredientStateDto } from './dto/create-ingredient-state.dto';
import { UpdateIngredientStateDto } from './dto/update-ingredient-state.dto';
import { IngredientState } from './ingredient-state.entity';

@EntityRepository(IngredientState)
export class IngredientStateRepository extends Repository<IngredientState> {
  async createIngredientState(
    createIngredientStateDto: CreateIngredientStateDto,
  ): Promise<IngredientState> {
    const { name } = createIngredientStateDto;

    const ingredientState = new IngredientState();
    ingredientState.name = name;

    try {
      await ingredientState.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Ingredient state '${name}' already exists`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }

    return ingredientState;
  }

  async getIngredientStates(): Promise<IngredientState[]> {
    const query = this.createQueryBuilder('ingredient_state');

    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateIngredientState(
    id: string,
    updateIngredientStateDto: UpdateIngredientStateDto,
  ): Promise<IngredientState> {
    const { name } = updateIngredientStateDto;

    const ingredientState = await this.findOne(id);
    ingredientState.name = name;

    try {
      await ingredientState.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Ingredient state '${name}' already exists`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }

    return ingredientState;
  }
}
