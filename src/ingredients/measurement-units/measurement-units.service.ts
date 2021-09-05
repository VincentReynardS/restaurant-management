import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMesurementUnitDto } from './dto/update-measurement-unit.dto';
import { MeasurementUnit } from './measurement-unit.entity';
import { MeasurementUnitRepository } from './measurement-unit.repository';

@Injectable()
export class MeasurementUnitsService {
  constructor(
    @InjectRepository(MeasurementUnitRepository)
    private measurementUnitRepository: MeasurementUnitRepository,
  ) {}

  async createMeasurementUnit(
    createMeasurementUnitDto: CreateMeasurementUnitDto,
  ): Promise<MeasurementUnit> {
    return this.measurementUnitRepository.createMeasurementUnit(
      createMeasurementUnitDto,
    );
  }

  async getMeasurementUnitByName(
    name: string,
  ): Promise<MeasurementUnit | null> {
    const measurementUnit = await this.measurementUnitRepository.findOne({
      where: { name },
    });

    if (!measurementUnit) {
      return null;
    }

    return measurementUnit;
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
    const { name, abbreviation, precision } = updateMeasurementUnitDto;

    const measurementUnit = await this.getMeasurementUnitById(id);
    measurementUnit.name = name;
    measurementUnit.abbreviation = abbreviation;
    measurementUnit.precision = precision;
    await measurementUnit.save();

    return measurementUnit;
  }
}
