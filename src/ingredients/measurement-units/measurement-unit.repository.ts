import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMesurementUnitDto } from './dto/update-measurement-unit.dto';
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
      if (error.code === '23505') {
        throw new ConflictException(
          `Measurement unit '${name}' already exists`,
        );
      } else {
        console.log(error.stack);
        throw new InternalServerErrorException();
      }
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

  async updateMeasurementUnit(
    id: string,
    updateMeasurementUnitDto: UpdateMesurementUnitDto,
  ): Promise<MeasurementUnit> {
    const { name, abbreviation, precision } = updateMeasurementUnitDto;

    const measurementUnit = await this.findOne(id);
    if (!measurementUnit) {
      throw new NotFoundException();
    }

    measurementUnit.name = name;
    measurementUnit.abbreviation = abbreviation;
    measurementUnit.precision = precision;

    try {
      await measurementUnit.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Measurement unit '${name}' already exists`,
        );
      } else {
        console.log(error.stack);
        throw new InternalServerErrorException();
      }
    }

    return measurementUnit;
  }
}
