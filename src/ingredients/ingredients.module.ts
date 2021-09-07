import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientTypeRepository } from './ingredient-types/ingredient-type.repository';
import { IngredientTypesController } from './ingredient-types/ingredient-types.controller';
import { IngredientTypesService } from './ingredient-types/ingredient-types.service';
import { MeasurementUnitRepository } from './measurement-units/measurement-unit.repository';
import { MeasurementUnitsController } from './measurement-units/measurement-units.controller';
import { MeasurementUnitsService } from './measurement-units/measurement-units.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeasurementUnitRepository,
      IngredientTypeRepository,
    ]),
  ],
  controllers: [MeasurementUnitsController, IngredientTypesController],
  providers: [MeasurementUnitsService, IngredientTypesService],
})
export class IngredientsModule {}
