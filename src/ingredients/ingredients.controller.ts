import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { GetIngredientsFilterDto } from './dto/get-ingredients-filter.dto';
import { IngredientStatesService } from './ingredient-states/ingredient-states.service';
import { IngredientTypesService } from './ingredient-types/ingredient-types.service';
import { Ingredient } from './ingredient.entity';
import { IngredientsService } from './ingredients.service';
import { MeasurementUnitsService } from './measurement-units/measurement-units.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private ingredientsService: IngredientsService,
    private measurementUnitsService: MeasurementUnitsService,
    private ingredientStatesService: IngredientStatesService,
    private ingredientTypesService: IngredientTypesService,
  ) {}

  @Post('')
  async createIngredient(
    @Body() createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    const {
      name,
      measurementUnitId,
      ingredientStateId,
      ingredientTypeId,
    } = createIngredientDto;

    const [
      measurementUnit,
      ingredientState,
      ingredientType,
    ] = await Promise.all([
      this.measurementUnitsService.updateMeasurementUnitIngredientsAssigned(
        measurementUnitId,
        1,
      ),
      this.ingredientStatesService.updateIngredientStateIngredientsAssigned(
        ingredientStateId,
        1,
      ),
      this.ingredientTypesService.updateIngredientTypeIngredientsAssigned(
        ingredientTypeId,
        1,
      ),
    ]);

    const newIngredient = await this.ingredientsService.createIngredient(
      name,
      measurementUnit,
      ingredientState,
      ingredientType,
    );

    return newIngredient;
  }

  @Get('')
  async getIngredients(
    @Query(ValidationPipe) filterDto: GetIngredientsFilterDto,
  ): Promise<Ingredient[]> {
    return this.ingredientsService.getIngredients(filterDto);
  }

  @Delete('/:id')
  async deleteIngredientById(@Param('id') id: string): Promise<void> {
    const ingredient = await this.ingredientsService.getIngredientById(id);
    const { measurementUnit, ingredientState, ingredientType } = ingredient;

    await this.ingredientsService.deleteIngredientById(id);
    await Promise.all([
      this.measurementUnitsService.updateMeasurementUnitIngredientsAssigned(
        measurementUnit.id,
        -1,
      ),
      this.ingredientStatesService.updateIngredientStateIngredientsAssigned(
        ingredientState.id,
        -1,
      ),
      this.ingredientTypesService.updateIngredientTypeIngredientsAssigned(
        ingredientType.id,
        -1,
      ),
    ]);
  }
}
