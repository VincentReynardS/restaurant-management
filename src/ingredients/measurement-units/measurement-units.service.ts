import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const measurementUnit = await this.measurementUnitRepository.findOne(id);

    if (!measurementUnit) {
      throw new NotFoundException(`Measurement unit with id '${id}' not found`);
    }

    return measurementUnit;
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
    id: string,
    valueAdded: number,
  ): Promise<MeasurementUnit> {
    const measurementUnit = await this.getMeasurementUnitById(id);

    measurementUnit.ingredientsAssigned += valueAdded;

    try {
      await measurementUnit.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return measurementUnit;
  }

  async assignToIngredient(
    assignToIngredientDto: AssignMeasurementUnitToIngredientDto,
  ): Promise<void> {
    const { measurementUnitId, ingredientIds } = assignToIngredientDto;
    const newMeasurementUnit = await this.getMeasurementUnitById(
      measurementUnitId,
    );
    const ingredients = await this.ingredientRepository.getIngredients({
      ids: ingredientIds,
    });

    for (const ingredient of ingredients) {
      const oldMeasurementUnitId = ingredient.measurementUnit.id;
      const newMeasurementUnitId = newMeasurementUnit.id;

      if (oldMeasurementUnitId !== newMeasurementUnitId) {
        await Promise.all([
          this.updateMeasurementUnitIngredientsAssigned(
            oldMeasurementUnitId,
            -1,
          ),
          this.updateMeasurementUnitIngredientsAssigned(measurementUnitId, 1),
        ]);

        ingredient.measurementUnit = newMeasurementUnit;

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
