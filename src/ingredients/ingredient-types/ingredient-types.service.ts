import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';
import { IngredientType } from './ingredient-type.entity';
import { IngredientTypeRepository } from './ingredient-type.repository';

@Injectable()
export class IngredientTypesService {
  constructor(
    @InjectRepository(IngredientTypeRepository)
    private ingredientTypeRepository: IngredientTypeRepository,
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
}
