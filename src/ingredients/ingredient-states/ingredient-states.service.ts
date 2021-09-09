import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientRepository } from '../ingredient.repository';
import { AssignIngredientStateToIngredientDto } from './dto/assign-ingredient-state-to-ingredient.dto';
import { CreateIngredientStateDto } from './dto/create-ingredient-state.dto';
import { UpdateIngredientStateDto } from './dto/update-ingredient-state.dto';
import { IngredientState } from './ingredient-state.entity';
import { IngredientStateRepository } from './ingredient-state.repository';

@Injectable()
export class IngredientStatesService {
  constructor(
    @InjectRepository(IngredientStateRepository)
    private ingredientStateRepository: IngredientStateRepository,
    @InjectRepository(IngredientRepository)
    private ingredientRepository: IngredientRepository,
  ) {}

  async createIngredientState(
    createIngredientStateDto: CreateIngredientStateDto,
  ): Promise<IngredientState> {
    return this.ingredientStateRepository.createIngredientState(
      createIngredientStateDto,
    );
  }

  async getIngredientStateById(id: string): Promise<IngredientState> {
    const ingredientState = await this.ingredientStateRepository.findOne(id);

    if (!ingredientState) {
      throw new NotFoundException();
    }

    return ingredientState;
  }

  async getIngredientStates(): Promise<IngredientState[]> {
    return this.ingredientStateRepository.getIngredientStates();
  }

  async deleteIngredientStateById(id: string): Promise<void> {
    const result = await this.ingredientStateRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Ingredient state with id '${id}' not found`);
    }
  }

  async updateIngredientState(
    id: string,
    updateIngredientStateDto: UpdateIngredientStateDto,
  ): Promise<IngredientState> {
    return this.ingredientStateRepository.updateIngredientState(
      id,
      updateIngredientStateDto,
    );
  }

  async updateIngredientStateIngredientsAssigned(
    id: string,
    valueAdded: number,
  ): Promise<IngredientState> {
    const ingredientState = await this.getIngredientStateById(id);

    ingredientState.ingredientsAssigned += valueAdded;

    try {
      await ingredientState.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return ingredientState;
  }

  async assignToIngredient(
    assignToIngredientDto: AssignIngredientStateToIngredientDto,
  ): Promise<void> {
    const { ingredientStateId, ingredientIds } = assignToIngredientDto;
    const newIngredientState = await this.getIngredientStateById(
      ingredientStateId,
    );
    const ingredients = await this.ingredientRepository.getIngredients({
      ids: ingredientIds,
    });

    for (const ingredient of ingredients) {
      const oldIngredientStateId = ingredient.ingredientState.id;
      const newIngredientStateId = newIngredientState.id;

      if (oldIngredientStateId !== newIngredientStateId) {
        await Promise.all([
          this.updateIngredientStateIngredientsAssigned(
            oldIngredientStateId,
            -1,
          ),
          this.updateIngredientStateIngredientsAssigned(ingredientStateId, 1),
        ]);

        ingredient.ingredientState = newIngredientState;

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
