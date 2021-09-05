import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementUnitsController } from './measurement-units.controller';
import { MeasurementUnitsService } from './measurement-units.service';

const mockmeasurementUnitsService = () => ({
  getMeasurementUnitByName: jest.fn(),
  getMeasurementUnits: jest.fn(),
  createMeasurementUnit: jest.fn(),
  deleteMeasurementUnitById: jest.fn(),
  updateMeasurementUnit: jest.fn(),
});

describe('measurementUnitsController', () => {
  let measurementUnitsController;
  let measurementUnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurementUnitsController,
        {
          provide: MeasurementUnitsService,
          useFactory: mockmeasurementUnitsService,
        },
      ],
    }).compile();

    measurementUnitsController = module.get<MeasurementUnitsController>(
      MeasurementUnitsController,
    );
    measurementUnitsService = module.get<MeasurementUnitsService>(
      MeasurementUnitsService,
    );
  });

  describe('createMeasurementUnit', () => {
    let mockDto;

    beforeEach(() => {
      mockDto = {
        name: 'some name',
        abbreviation: 'some abbrv',
        precision: 1,
      };
    });

    it('should throw conflict exception if measurement unit already exists', async () => {
      measurementUnitsService.getMeasurementUnitByName.mockResolvedValue(
        'some measurement unit',
      );

      await expect(
        measurementUnitsController.createMeasurementUnit(mockDto),
      ).rejects.toThrow(ConflictException);
      expect(
        measurementUnitsService.getMeasurementUnitByName,
      ).toHaveBeenCalledWith(mockDto.name);
      expect(
        measurementUnitsService.createMeasurementUnit,
      ).not.toHaveBeenCalled();
    });

    it('should return the created measurement unit if successful', async () => {
      const mockResult = 'some measurement unit';

      measurementUnitsService.getMeasurementUnitByName.mockResolvedValue(null);
      measurementUnitsService.createMeasurementUnit.mockResolvedValue(
        mockResult,
      );

      const result = await measurementUnitsController.createMeasurementUnit(
        mockDto,
      );
      expect(
        measurementUnitsService.getMeasurementUnitByName,
      ).toHaveBeenCalledWith(mockDto.name);
      expect(measurementUnitsService.createMeasurementUnit).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('getMeasurementUnits', () => {
    it('should return an array of measurement units', async () => {
      const mockResult = ['some measurement units'];
      measurementUnitsService.getMeasurementUnits.mockResolvedValue(mockResult);

      const result = await measurementUnitsController.getMeasurementUnits();
      expect(measurementUnitsService.getMeasurementUnits).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('deleteMeasurementUnitById', () => {
    it('should call measurementUnitsService.deleteMeasurementUnitById() to delete', async () => {
      const mockId = 'some id';
      await measurementUnitsController.deleteMeasurementUnitById(mockId);
      expect(
        measurementUnitsService.deleteMeasurementUnitById,
      ).toHaveBeenCalledWith(mockId);
    });
  });

  describe('updateMeasurementUnit', () => {
    it('should call measurementUnitsService.updateMeasurementUnit() to update', async () => {
      const mockId = 'some id';
      const mockDto = 'some data';
      const mockResult = 'some result';
      measurementUnitsService.updateMeasurementUnit.mockResolvedValue(
        mockResult,
      );

      const result = await measurementUnitsController.updateMeasurementUnit(
        mockId,
        mockDto,
      );
      expect(
        measurementUnitsService.updateMeasurementUnit,
      ).toHaveBeenCalledWith(mockId, mockDto);
      expect(result).toBe(mockResult);
    });
  });
});
