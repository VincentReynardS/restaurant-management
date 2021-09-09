import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetIngredientsFilterDto } from './dto/get-ingredients-filter.dto';
import { IngredientState } from './ingredient-states/ingredient-state.entity';
import { IngredientType } from './ingredient-types/ingredient-type.entity';
import { Ingredient } from './ingredient.entity';
import { IngredientRepository } from './ingredient.repository';
import { MeasurementUnit } from './measurement-units/measurement-unit.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientRepository)
    private ingredientRepository: IngredientRepository,
  ) {}

  async createIngredient(
    name: string,
    measurementUnit: MeasurementUnit,
    ingredientState: IngredientState,
    ingredientType: IngredientType,
  ): Promise<Ingredient> {
    return this.ingredientRepository.createIngredient(
      name,
      measurementUnit,
      ingredientState,
      ingredientType,
    );
  }

  async getIngredientById(id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne(id);

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with id '${id}' not found`);
    }

    return ingredient;
  }

  async getIngredients(
    filterDto?: GetIngredientsFilterDto,
  ): Promise<Ingredient[]> {
    return this.ingredientRepository.getIngredients(filterDto);
  }

  /**
   * IMPORTANT: Deleting the ingredient will not automatically decrement the associated
   * resources' (measurement unit, ingredient state, and ingredient type) "ingredients
   * assigned" property. Make sure to update the corresponding properties for each resources
   * via each one's services.(example: for measurement unit, update the property via
   * updateMeasurementUnitIngredientsAssigned())
   */
  async deleteIngredientById(id: string): Promise<void> {
    const result = await this.ingredientRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Ingredient with id '${id}' not found`);
    }
  }

  async updateIngredientCurrentStock(
    ingredient: Ingredient,
    valueAdded: number,
  ): Promise<Ingredient> {
    return this.ingredientRepository.updateIngredientCurrentStock(
      ingredient,
      valueAdded,
    );
  }
}
