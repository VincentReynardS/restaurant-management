import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from '../ingredient.entity';
import { IngredientRepository } from '../ingredient.repository';
import { AssignMeasurementUnitToIngredientDto } from './dto/assign-measurement-unit-to-ingredient.dto';
import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMesurementUnitDto } from './dto/update-measurement-unit.dto';
import { MeasurementUnit } from './measurement-unit.entity';
import { MeasurementUnitRepository } from './measurement-unit.repository';

@Injectable()
export class MeasurementUnitsService {
  constructor(
    @InjectRepository(MeasurementUnitRepository)
    private measurementUnitRepository: MeasurementUnitRepository,
    @InjectRepository(IngredientRepository)
    private ingredientRepository: IngredientRepository,
  ) {}

  async createMeasurementUnit(
    createMeasurementUnitDto: CreateMeasurementUnitDto,
  ): Promise<MeasurementUnit> {
    return this.measurementUnitRepository.createMeasurementUnit(
      createMeasurementUnitDto,
    );
  }

  async getMeasurementUnitById(id: string): Promise<MeasurementUnit> {
    return this.measurementUnitRepository.getMeasurementUnitById(id);
  }

  async getMeasurementUnits(): Promise<MeasurementUnit[]> {
    return this.measurementUnitRepository.getMeasurementUnits();
  }

  async deleteMeasurementUnitById(id: string): Promise<void> {
    const result = await this.measurementUnitRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Measurement unit with id '${id}' not found`);
    }
  }

  async updateMeasurementUnit(
    id: string,
    updateMeasurementUnitDto: UpdateMesurementUnitDto,
  ): Promise<MeasurementUnit> {
    return this.measurementUnitRepository.updateMeasurementUnit(
      id,
      updateMeasurementUnitDto,
    );
  }

  async updateMeasurementUnitIngredientsAssigned(
    measurementUnit: MeasurementUnit,
    valueAdded: number,
  ): Promise<MeasurementUnit> {
    measurementUnit.ingredientsAssigned += valueAdded;

    try {
      await measurementUnit.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return measurementUnit;
  }

  async assignToIngredient(
    measurementUnit: MeasurementUnit,
    targetIngredients: Ingredient[],
  ): Promise<void> {
    for (const ingredient of targetIngredients) {
      const oldMeasurementUnit = ingredient.measurementUnit;
      const newMeasurementUnit = measurementUnit;

      if (oldMeasurementUnit.id !== newMeasurementUnit.id) {
        await Promise.all([
          this.updateMeasurementUnitIngredientsAssigned(oldMeasurementUnit, -1),
          this.updateMeasurementUnitIngredientsAssigned(newMeasurementUnit, 1),
        ]);

        ingredient.measurementUnit = measurementUnit;

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
