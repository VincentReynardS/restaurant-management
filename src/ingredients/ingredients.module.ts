import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InflowsModule } from 'src/inflows/inflows.module';
import { IngredientStateRepository } from './ingredient-states/ingredient-state.repository';
import { IngredientStatesController } from './ingredient-states/ingredient-states.controller';
import { IngredientStatesService } from './ingredient-states/ingredient-states.service';
import { IngredientTypeRepository } from './ingredient-types/ingredient-type.repository';
import { IngredientTypesController } from './ingredient-types/ingredient-types.controller';
import { IngredientTypesService } from './ingredient-types/ingredient-types.service';
import { IngredientRepository } from './ingredient.repository';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { MeasurementUnitRepository } from './measurement-units/measurement-unit.repository';
import { MeasurementUnitsController } from './measurement-units/measurement-units.controller';
import { MeasurementUnitsService } from './measurement-units/measurement-units.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeasurementUnitRepository,
      IngredientStateRepository,
      IngredientTypeRepository,
      IngredientRepository,
    ]),
    forwardRef(() => InflowsModule),
  ],
  controllers: [
    MeasurementUnitsController,
    IngredientStatesController,
    IngredientTypesController,
    IngredientsController,
  ],
  providers: [
    MeasurementUnitsService,
    IngredientStatesService,
    IngredientTypesService,
    IngredientsService,
  ],
  exports: [IngredientsService],
})
export class IngredientsModule {}
