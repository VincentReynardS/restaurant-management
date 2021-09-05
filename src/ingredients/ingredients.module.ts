import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementUnitRepository } from './measurement-units/measurement-unit.repository';
import { MeasurementUnitsController } from './measurement-units/measurement-units.controller';
import { MeasurementUnitsService } from './measurement-units/measurement-units.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeasurementUnitRepository])],
  controllers: [MeasurementUnitsController],
  providers: [MeasurementUnitsService],
})
export class IngredientsModule {}
