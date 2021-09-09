import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AssignIngredientStateToIngredientDto } from './dto/assign-ingredient-state-to-ingredient.dto';
import { CreateIngredientStateDto } from './dto/create-ingredient-state.dto';
import { UpdateIngredientStateDto } from './dto/update-ingredient-state.dto';
import { IngredientState } from './ingredient-state.entity';
import { IngredientStatesService } from './ingredient-states.service';

@Controller('ingredient-states')
export class IngredientStatesController {
  constructor(private ingredientStatesService: IngredientStatesService) {}

  @Post('')
  @UsePipes(ValidationPipe)
  async createIngredientState(
    @Body() createIngredientStateDto: CreateIngredientStateDto,
  ): Promise<IngredientState> {
    return this.ingredientStatesService.createIngredientState(
      createIngredientStateDto,
    );
  }

  @Get('')
  async getIngredientStates(): Promise<IngredientState[]> {
    return this.ingredientStatesService.getIngredientStates();
  }

  @Delete('/:id')
  async deleteIngredientStateById(@Param('id') id: string): Promise<void> {
    const ingredientState = await this.ingredientStatesService.getIngredientStateById(
      id,
    );

    if (!ingredientState) {
      throw new NotFoundException(
        `Ingredient state with id '${id}' is not found`,
      );
    }

    if (ingredientState.ingredientsAssigned !== 0) {
      throw new ConflictException(
        `There are ${ingredientState.ingredientsAssigned} ingredients which still use this ingredient state`,
      );
    }

    return this.ingredientStatesService.deleteIngredientStateById(id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateIngredientState(
    @Param('id') id: string,
    @Body() updateIngredientStateDto: UpdateIngredientStateDto,
  ): Promise<IngredientState> {
    return this.ingredientStatesService.updateIngredientState(
      id,
      updateIngredientStateDto,
    );
  }

  @Post('/assign-to-ingredient')
  async assignToIngredient(
    @Body() assignToIngredientDto: AssignIngredientStateToIngredientDto,
  ): Promise<void> {
    return this.ingredientStatesService.assignToIngredient(
      assignToIngredientDto,
    );
  }
}
