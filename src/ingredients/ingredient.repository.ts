import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetIngredientsFilterDto } from './dto/get-ingredients-filter.dto';
import { IngredientState } from './ingredient-states/ingredient-state.entity';
import { IngredientType } from './ingredient-types/ingredient-type.entity';
import { Ingredient } from './ingredient.entity';
import { MeasurementUnit } from './measurement-units/measurement-unit.entity';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
  async createIngredient(
    name: string,
    measurementUnit: MeasurementUnit,
    ingredientState: IngredientState,
    ingredientType: IngredientType,
  ): Promise<Ingredient> {
    const ingredient = new Ingredient();
    ingredient.name = name;
    ingredient.measurementUnit = measurementUnit;
    ingredient.ingredientState = ingredientState;
    ingredient.ingredientType = ingredientType;

    try {
      await ingredient.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Ingredient '${name}' already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }

    return ingredient;
  }

  async getIngredients(
    filters: GetIngredientsFilterDto,
  ): Promise<Ingredient[]> {
    const { ids } = filters;
    const query = this.createQueryBuilder('ingredient')
      .innerJoinAndSelect('ingredient.measurementUnit', 'measurement_unit')
      .innerJoinAndSelect('ingredient.ingredientState', 'ingredient_state')
      .innerJoinAndSelect('ingredient.ingredientType', 'ingredient_type');

    if (ids && ids.length > 0) {
      query.where('ingredient.ingredient_id IN(:...ids)', { ids });
    }

    try {
      return await query.getMany();
    } catch (error) {
      console.log(error.stack);
      throw new InternalServerErrorException();
    }
  }

  async updateIngredient(
    id: string,
    name: string,
    measurementUnit: MeasurementUnit,
    ingredientState: IngredientState,
    ingredientType: IngredientType,
  ): Promise<Ingredient> {
    const ingredient = await this.findOne(id);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with id '${id}' not found`);
    }

    ingredient.name = name;
    ingredient.measurementUnit = measurementUnit;
    ingredient.ingredientState = ingredientState;
    ingredient.ingredientType = ingredientType;

    try {
      await ingredient.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Ingredient '${name}' already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }

    return ingredient;
  }

  /**
   * IMPORTANT: The value that is going to be added to the ingredient's current stock
   * will be rounded to the correct precision (e.g the decimal places) according to the
   * measurement unit used by the ingredient.
   */
  async updateIngredientCurrentStock(
    ingredient: Ingredient,
    valueAdded: number,
  ): Promise<Ingredient> {
    const roundedValueAdded = +valueAdded.toFixed(
      ingredient.measurementUnit.precision,
    );

    ingredient.currentStock += roundedValueAdded;

    try {
      await ingredient.save();
    } catch (error) {
      console.log(error.stack);
      throw new InternalServerErrorException();
    }

    return ingredient;
  }
}
