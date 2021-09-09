import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from '../ingredient.entity';
import { IngredientRepository } from '../ingredient.repository';
import { AssignIngredientTypeToIngredientDto } from './dto/assign-ingredient-type-to-ingredient.dto';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';
import { IngredientType } from './ingredient-type.entity';
import { IngredientTypeRepository } from './ingredient-type.repository';

@Injectable()
export class IngredientTypesService {
  constructor(
    @InjectRepository(IngredientTypeRepository)
    private ingredientTypeRepository: IngredientTypeRepository,
    @InjectRepository(IngredientRepository)
    private ingredientRepository: IngredientRepository,
  ) {}

  async createIngredientType(
    createIngredientTypeDto: CreateIngredientTypeDto,
  ): Promise<IngredientType> {
    return this.ingredientTypeRepository.createIngredientType(
      createIngredientTypeDto,
    );
  }

  async getIngredientTypeById(id: string): Promise<IngredientType> {
    const ingredientType = await this.ingredientTypeRepository.findOne(id);

    if (!ingredientType) {
      throw new NotFoundException(`Ingredient type with id '${id}' not found`);
    }

    return ingredientType;
  }

  async getIngredientTypes(): Promise<IngredientType[]> {
    return this.ingredientTypeRepository.getIngredientTypes();
  }

  async deleteIngredientTypeById(id: string): Promise<void> {
    const result = await this.ingredientTypeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Ingredient type with id '${id}' not found`);
    }
  }

  async updateIngredientType(
    id: string,
    updateIngredientTypeDto: UpdateIngredientTypeDto,
  ): Promise<IngredientType> {
    return this.ingredientTypeRepository.updateIngredientType(
      id,
      updateIngredientTypeDto,
    );
  }

  async updateIngredientTypeIngredientsAssigned(
    id: string,
    valueAdded: number,
  ): Promise<IngredientType> {
    const ingredientType = await this.getIngredientTypeById(id);

    ingredientType.ingredientsAssigned += valueAdded;

    try {
      await ingredientType.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return ingredientType;
  }

  async assignToIngredient(
    ingredientType: IngredientType,
    ingredients: Ingredient[],
  ): Promise<void> {
    for (const ingredient of ingredients) {
      const oldIngredientTypeId = ingredient.ingredientType.id;
      const newIngredientTypeId = ingredientType.id;

      if (oldIngredientTypeId !== newIngredientTypeId) {
        await Promise.all([
          this.updateIngredientTypeIngredientsAssigned(oldIngredientTypeId, -1),
          this.updateIngredientTypeIngredientsAssigned(newIngredientTypeId, 1),
        ]);

        ingredient.ingredientType = ingredientType;

        try {
          ingredient.save();
        } catch (error) {
          console.log(error.stack);
          throw new InternalServerErrorException();
        }
      }
    }
  }
}
