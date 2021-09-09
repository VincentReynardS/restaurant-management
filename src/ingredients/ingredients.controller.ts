import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { GetIngredientsFilterDto } from './dto/get-ingredients-filter.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
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
    @Body(ValidationPipe) createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    const {
      name,
      measurementUnitId,
      ingredientStateId,
      ingredientTypeId,
    } = createIngredientDto;
    const measurementUnit = await this.measurementUnitsService.getMeasurementUnitById(
      measurementUnitId,
    );
    const ingredientState = await this.ingredientStatesService.getIngredientStateById(
      ingredientStateId,
    );
    const ingredientType = await this.ingredientTypesService.getIngredientTypeById(
      ingredientTypeId,
    );

    await Promise.all([
      this.measurementUnitsService.updateMeasurementUnitIngredientsAssigned(
        measurementUnit,
        1,
      ),
      this.ingredientStatesService.updateIngredientStateIngredientsAssigned(
        ingredientState,
        1,
      ),
      this.ingredientTypesService.updateIngredientTypeIngredientsAssigned(
        ingredientType,
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
        measurementUnit,
        -1,
      ),
      this.ingredientStatesService.updateIngredientStateIngredientsAssigned(
        ingredientState,
        -1,
      ),
      this.ingredientTypesService.updateIngredientTypeIngredientsAssigned(
        ingredientType,
        -1,
      ),
    ]);
  }

  @Patch('/:id')
  async updateIngredient(
    @Param('id') ingredientId: string,
    @Body(ValidationPipe) updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    const {
      name,
      measurementUnitId,
      ingredientStateId,
      ingredientTypeId,
    } = updateIngredientDto;

    const [
      measurementUnit,
      ingredientState,
      ingredientType,
      ingredient,
    ] = await Promise.all([
      this.measurementUnitsService.getMeasurementUnitById(measurementUnitId),
      this.ingredientStatesService.getIngredientStateById(ingredientStateId),
      this.ingredientTypesService.getIngredientTypeById(ingredientTypeId),
      this.ingredientsService.getIngredientById(ingredientId),
    ]);

    ingredient.name = name;
    await this.measurementUnitsService.assignToIngredient(measurementUnit, [
      ingredient,
    ]);
    await this.ingredientStatesService.assignToIngredient(ingredientState, [
      ingredient,
    ]);
    await this.ingredientTypesService.assignToIngredient(ingredientType, [
      ingredient,
    ]);

    return ingredient;
  }

  // @Post('/:id/add-stock')
  // async addIngredientStock(
  //   @Param('id') id: string,
  //   @Body('value') value: number,
  // ): Promise<Ingredient> {
  //   const ingredient = await this.ingredientsService.getIngredientById(id);
  //   return this.ingredientsService.updateIngredientCurrentStock(
  //     ingredient,
  //     value,
  //   );
  // }
}
