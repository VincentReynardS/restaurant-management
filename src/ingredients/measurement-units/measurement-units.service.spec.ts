import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementUnitRepository } from './measurement-unit.repository';
import { MeasurementUnitsService } from './measurement-units.service';

const mockMeasurementUnitReposiory = () => ({
  createMeasurementUnit: jest.fn(),
  findOne: jest.fn(),
  getMeasurementUnits: jest.fn(),
  delete: jest.fn(),
});

describe('MeasurementUnitsService', () => {
  let measurementUnitsService;
  let measurementUnitRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurementUnitsService,
        {
          provide: MeasurementUnitRepository,
          useFactory: mockMeasurementUnitReposiory,
        },
      ],
    }).compile();

    measurementUnitsService = module.get<MeasurementUnitsService>(
      MeasurementUnitsService,
    );
    measurementUnitRepository = module.get<MeasurementUnitRepository>(
      MeasurementUnitRepository,
    );
  });

  describe('createMeasurementUnit', () => {
    it('should create measurement unit via repository', async () => {
      const mockDto = 'some data';
      const mockResponse = 'some response';
      measurementUnitRepository.createMeasurementUnit.mockResolvedValue(
        mockResponse,
      );

      const result = await measurementUnitsService.createMeasurementUnit(
        mockDto,
      );
      expect(
        measurementUnitRepository.createMeasurementUnit,
      ).toHaveBeenCalledWith(mockDto);
      expect(result).toBe(mockResponse);
    });
  });

  describe('getMeasurementUnitByName', () => {
    it('should return null if no measurement unit is found', async () => {
      const mockResponse = undefined;
      const mockName = 'some name';
      measurementUnitRepository.findOne.mockResolvedValue(mockResponse);

      const result = await measurementUnitsService.getMeasurementUnitByName(
        mockName,
      );
      expect(measurementUnitRepository.findOne).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return the measurement unit if found', async () => {
      const mockResponse = 'some measurement unit';
      const mockName = 'some name';
      measurementUnitRepository.findOne.mockResolvedValue(mockResponse);

      const result = await measurementUnitsService.getMeasurementUnitByName(
        mockName,
      );
      expect(measurementUnitRepository.findOne).toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });
  });

  describe('getMeasurementUnitById', () => {
    it('should throw not found exception if measurement unit is not found', async () => {
      const mockResult = undefined;
      const mockId = 'some id';
      measurementUnitRepository.findOne.mockResolvedValue(mockResult);

      await expect(
        measurementUnitsService.getMeasurementUnitById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(measurementUnitRepository.findOne).toHaveBeenCalledWith(mockId);
    });

    it('should return the measurement unit if found', async () => {
      const mockResult = 'some measurement unit';
      const mockId = 'some id';
      measurementUnitRepository.findOne.mockResolvedValue(mockResult);

      const result = await measurementUnitsService.getMeasurementUnitById(
        mockId,
      );
      expect(measurementUnitRepository.findOne).toHaveBeenCalledWith(mockId);
      expect(result).toBe(mockResult);
    });
  });

  describe('getMeasurementUnits', () => {
    it('should return an array of measurement units', async () => {
      const mockResult = ['some measurement units'];
      measurementUnitRepository.getMeasurementUnits.mockResolvedValue(
        mockResult,
      );

      const result = await measurementUnitsService.getMeasurementUnits();
      expect(measurementUnitRepository.getMeasurementUnits).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('deleteMeasurementUnitById', () => {
    let mockId;

    beforeEach(() => {
      mockId = 'some id';
    });

    it('should return null (void) if deletion is successful', async () => {
      const mockDeleteResult = {
        affected: 1,
      };
      measurementUnitRepository.delete.mockResolvedValue(mockDeleteResult);

      await measurementUnitsService.deleteMeasurementUnitById(mockId);
      expect(measurementUnitRepository.delete).toHaveBeenCalledWith(mockId);
    });

    it('should throw not found exception if no measurement unit is found', async () => {
      const mockDeleteResult = {
        affected: 0,
      };
      measurementUnitRepository.delete.mockResolvedValue(mockDeleteResult);

      await expect(
        measurementUnitsService.deleteMeasurementUnitById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(measurementUnitRepository.delete).toHaveBeenCalledWith(mockId);
    });
  });

  describe('updateMeasurementUnit', () => {
    it('should throw not found exception if measurement unit is not found', async () => {
      const mockResult = undefined;
      const mockId = 'some id';
      const mockDto = 'some data';
      measurementUnitRepository.findOne.mockResolvedValue(mockResult);

      await expect(
        measurementUnitsService.updateMeasurementUnit(mockId, mockDto),
      ).rejects.toThrow(NotFoundException);
      expect(measurementUnitRepository.findOne).toHaveBeenCalledWith(mockId);
    });

    it('should call save() method to update the measurement unit properties', async () => {
      const mockId = 'some id';
      const mockDto = {
        name: 'new name',
        abbreviation: 'new abbreviation',
        precision: 2,
      };

      const save = jest.fn().mockResolvedValue(true);
      measurementUnitsService.getMeasurementUnitById = jest
        .fn()
        .mockResolvedValue({
          name: 'old name',
          abbreviation: 'old abbreviation',
          precision: 1,
          save,
        });

      const result = await measurementUnitsService.updateMeasurementUnit(
        mockId,
        mockDto,
      );
      expect(
        measurementUnitsService.getMeasurementUnitById,
      ).toHaveBeenCalledWith(mockId);
      expect(save).toHaveBeenCalledWith();
      expect(result.name).toBe(mockDto.name);
      expect(result.abbreviation).toBe(mockDto.abbreviation);
      expect(result.precision).toBe(mockDto.precision);
    });
  });
});
