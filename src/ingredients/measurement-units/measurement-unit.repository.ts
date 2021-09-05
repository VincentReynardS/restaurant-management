import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { MeasurementUnit } from './measurement-unit.entity';

@EntityRepository(MeasurementUnit)
export class MeasurementUnitRepository extends Repository<MeasurementUnit> {
  async createMeasurementUnit(
    createMeasurementUnitDto: CreateMeasurementUnitDto,
  ): Promise<MeasurementUnit> {
    const { name, precision, abbreviation } = createMeasurementUnitDto;

    const measurementUnit = new MeasurementUnit();
    measurementUnit.name = name;
    measurementUnit.precision = precision;
    measurementUnit.abbreviation = abbreviation;

    try {
      await measurementUnit.save();
    } catch (error) {
      console.log(error.stack);
      throw new InternalServerErrorException();
    }

    return measurementUnit;
  }

  async getMeasurementUnits(): Promise<MeasurementUnit[]> {
    const query = this.createQueryBuilder('measurement_unit');

    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
