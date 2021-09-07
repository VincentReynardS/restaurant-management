import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementUnitsController } from './measurement-units.controller';
import { MeasurementUnitsService } from './measurement-units.service';

const mockmeasurementUnitsService = () => ({
  getMeasurementUnits: jest.fn(),
  getMeasurementUnitById: jest.fn(),
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
      measurementUnitsService.createMeasurementUnit.mockRejectedValue(
        new ConflictException(),
      );

      await expect(
        measurementUnitsController.createMeasurementUnit(mockDto),
      ).rejects.toThrow(ConflictException);
      expect(
        measurementUnitsService.createMeasurementUnit,
      ).toHaveBeenCalledWith(mockDto);
    });

    it('should return the created measurement unit if successful', async () => {
      const mockResult = 'some measurement unit';

      measurementUnitsService.createMeasurementUnit.mockResolvedValue(
        mockResult,
      );

      const result = await measurementUnitsController.createMeasurementUnit(
        mockDto,
      );
      expect(
        measurementUnitsService.createMeasurementUnit,
      ).toHaveBeenCalledWith(mockDto);
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
    let mockId;

    beforeEach(() => {
      mockId = 'some id';
    });

    it('should call measurementUnitsService.deleteMeasurementUnitById() to delete', async () => {
      const mockData = {
        ingredientsAssigned: 0,
      };
      measurementUnitsService.getMeasurementUnitById.mockResolvedValue(
        mockData,
      );

      await measurementUnitsController.deleteMeasurementUnitById(mockId);
      expect(
        measurementUnitsService.deleteMeasurementUnitById,
      ).toHaveBeenCalledWith(mockId);
    });

    it('should throw not found exception if measurement unit is not found', async () => {
      const mockData = undefined;
      measurementUnitsService.getMeasurementUnitById.mockResolvedValue(
        mockData,
      );

      await expect(
        measurementUnitsController.deleteMeasurementUnitById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(
        measurementUnitsService.deleteMeasurementUnitById,
      ).not.toHaveBeenCalled();
    });

    it('should throw conflict exception if measurement unit is still being used by at least one ingredient', async () => {
      const mockData = {
        ingredientsAssigned: 5,
      };
      measurementUnitsService.getMeasurementUnitById.mockResolvedValue(
        mockData,
      );

      await expect(
        measurementUnitsController.deleteMeasurementUnitById(mockId),
      ).rejects.toThrow(ConflictException);
      expect(
        measurementUnitsService.deleteMeasurementUnitById,
      ).not.toHaveBeenCalled();
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
