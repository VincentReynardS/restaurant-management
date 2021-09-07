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
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';
import { IngredientType } from './ingredient-type.entity';
import { IngredientTypesService } from './ingredient-types.service';

@Controller('ingredient-types')
export class IngredientTypesController {
  constructor(private ingredientTypesService: IngredientTypesService) {}

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
      throw new NotFoundException();
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
}
