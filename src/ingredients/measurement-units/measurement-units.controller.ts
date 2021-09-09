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
import { AssignMeasurementUnitToIngredientDto } from './dto/assign-measurement-unit-to-ingredient.dto';
import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMesurementUnitDto } from './dto/update-measurement-unit.dto';
import { MeasurementUnit } from './measurement-unit.entity';
import { MeasurementUnitsService } from './measurement-units.service';

@Controller('measurements')
export class MeasurementUnitsController {
  constructor(
    private measurementUnitsService: MeasurementUnitsService,
    private ingredientsService: IngredientsService,
  ) {}

  @Post('')
  @UsePipes(ValidationPipe)
  async createMeasurementUnit(
    @Body() createMeasurementUnitDto: CreateMeasurementUnitDto,
  ): Promise<MeasurementUnit> {
    return this.measurementUnitsService.createMeasurementUnit(
      createMeasurementUnitDto,
    );
  }

  @Get('')
  async getMeasurementUnits(): Promise<MeasurementUnit[]> {
    return this.measurementUnitsService.getMeasurementUnits();
  }

  @Delete('/:id')
  async deleteMeasurementUnitById(@Param('id') id: string): Promise<void> {
    const measurementUnit = await this.measurementUnitsService.getMeasurementUnitById(
      id,
    );

    if (!measurementUnit) {
      throw new NotFoundException(`Measurement unit with id '${id}' not found`);
    }

    if (measurementUnit.ingredientsAssigned !== 0) {
      throw new ConflictException(
        `There are ${measurementUnit.ingredientsAssigned} ingredients which still use this measurement unit`,
      );
    }

    return this.measurementUnitsService.deleteMeasurementUnitById(id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateMeasurementUnit(
    @Param('id') id: string,
    @Body() updateMeasurementUnitDto: UpdateMesurementUnitDto,
  ): Promise<MeasurementUnit> {
    return this.measurementUnitsService.updateMeasurementUnit(
      id,
      updateMeasurementUnitDto,
    );
  }

  @Post('/assign-to-ingredient')
  async assignToIngredient(
    @Body(ValidationPipe)
    assignToIngredientDto: AssignMeasurementUnitToIngredientDto,
  ): Promise<void> {
    const { measurementUnitId, ingredientIds } = assignToIngredientDto;
    const newMeasurementUnit = await this.measurementUnitsService.getMeasurementUnitById(
      measurementUnitId,
    );
    const ingredients = await this.ingredientsService.getIngredients({
      ids: ingredientIds,
    });

    return this.measurementUnitsService.assignToIngredient(
      newMeasurementUnit,
      ingredients,
    );
  }
}
