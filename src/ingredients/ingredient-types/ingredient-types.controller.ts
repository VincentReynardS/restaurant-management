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
import { IngredientsService } from '../ingredients.service';
import { AssignIngredientTypeToIngredientDto } from './dto/assign-ingredient-type-to-ingredient.dto';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';
import { IngredientType } from './ingredient-type.entity';
import { IngredientTypesService } from './ingredient-types.service';

@Controller('ingredient-types')
export class IngredientTypesController {
  constructor(
    private ingredientTypesService: IngredientTypesService,
    private ingredientsService: IngredientsService,
  ) {}

  @Post('')
  @UsePipes(ValidationPipe)
  async createIngredientType(
    @Body() createIngredientTypeDto: CreateIngredientTypeDto,
  ): Promise<IngredientType> {
    return this.ingredientTypesService.createIngredientType(
      createIngredientTypeDto,
    );
  }

  @Get('')
  async getIngredientTypes(): Promise<IngredientType[]> {
    return this.ingredientTypesService.getIngredientTypes();
  }

  @Delete('/:id')
  async deleteIngredientTypeById(@Param('id') id: string): Promise<void> {
    const ingredientType = await this.ingredientTypesService.getIngredientTypeById(
      id,
    );

    if (!ingredientType) {
      throw new NotFoundException(
        `Ingredient type with id '${id}' is not found`,
      );
    }

    if (ingredientType.ingredientsAssigned !== 0) {
      throw new ConflictException(
        `There are ${ingredientType.ingredientsAssigned} ingredients which still use this ingredient type`,
      );
    }

    return this.ingredientTypesService.deleteIngredientTypeById(id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateIngredientType(
    @Param('id') id: string,
    @Body() updateIngredientTypeDto: UpdateIngredientTypeDto,
  ): Promise<IngredientType> {
    return this.ingredientTypesService.updateIngredientType(
      id,
      updateIngredientTypeDto,
    );
  }

  @Post('/assign-to-ingredient')
  async assignToIngredient(
    @Body(ValidationPipe)
    assignToIngredientDto: AssignIngredientTypeToIngredientDto,
  ): Promise<void> {
    const { ingredientTypeId, ingredientIds } = assignToIngredientDto;
    const newIngredientType = await this.ingredientTypesService.getIngredientTypeById(
      ingredientTypeId,
    );
    const ingredients = await this.ingredientsService.getIngredients({
      ids: ingredientIds,
    });

    return this.ingredientTypesService.assignToIngredient(
      newIngredientType,
      ingredients,
    );
  }
}
