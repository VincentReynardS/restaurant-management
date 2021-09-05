import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMesurementUnitDto } from './dto/update-measurement-unit.dto';
import { MeasurementUnit } from './measurement-unit.entity';
import { MeasurementUnitsService } from './measurement-units.service';

@Controller('measurements')
export class MeasurementUnitsController {
  constructor(private measurementUnitsService: MeasurementUnitsService) {}

  @Post('')
  @UsePipes(ValidationPipe)
  async createMeasurementUnit(
    @Body() createMeasurementUnitDto: CreateMeasurementUnitDto,
  ): Promise<MeasurementUnit> {
    const { name } = createMeasurementUnitDto;

    const exists = await this.measurementUnitsService.getMeasurementUnitByName(
      name,
    );
    if (exists) {
      throw new ConflictException(`Measurement unit '${name}' already exists`);
    }

    return this.measurementUnitsService.createMeasurementUnit(
      createMeasurementUnitDto,
    );
  }

  @Get('')
  async getMeasurementUnits(): Promise<MeasurementUnit[]> {
    return this.measurementUnitsService.getMeasurementUnits();
  }

  @Delete('')
  async deleteMeasurementUnitById(@Body() id: string): Promise<void> {
    return this.measurementUnitsService.deleteMeasurementUnitById(id);
  }

  @Patch('/:id')
  async updateMeasurementUnit(
    @Param('id') id: string,
    @Body() updateMeasurementUnitDto: UpdateMesurementUnitDto,
  ): Promise<MeasurementUnit> {
    return this.measurementUnitsService.updateMeasurementUnit(
      id,
      updateMeasurementUnitDto,
    );
  }
}
