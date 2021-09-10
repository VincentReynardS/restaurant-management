import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IngredientRepository } from '../ingredient.repository';
import { MeasurementUnitRepository } from './measurement-unit.repository';
import { MeasurementUnitsService } from './measurement-units.service';

const mockMeasurementUnitReposiory = () => ({
  createMeasurementUnit: jest.fn(),
  findOne: jest.fn(),
  getMeasurementUnits: jest.fn(),
  getMeasurementUnitById: jest.fn(),
  delete: jest.fn(),
  updateMeasurementUnit: jest.fn(),
  assignMeasurementUnitToIngredient: jest.fn(),
});
const mockIngredientRepository = () => ({
  getIngredients: jest.fn(),
});

describe('MeasurementUnitsService', () => {
  let measurementUnitsService;
  let measurementUnitRepository;
  let ingredientRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurementUnitsService,
        {
          provide: MeasurementUnitRepository,
          useFactory: mockMeasurementUnitReposiory,
        },
        { provide: IngredientRepository, useFactory: mockIngredientRepository },
      ],
    }).compile();

    measurementUnitsService = module.get<MeasurementUnitsService>(
      MeasurementUnitsService,
    );
    measurementUnitRepository = module.get<MeasurementUnitRepository>(
      MeasurementUnitRepository,
    );
    ingredientRepository = module.get<IngredientRepository>(
      IngredientRepository,
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

  describe('getMeasurementUnitById', () => {
    it('should throw not found exception if measurement unit is not found', async () => {
      const mockResult = new NotFoundException();
      const mockId = 'some id';
      measurementUnitRepository.getMeasurementUnitById.mockRejectedValue(
        mockResult,
      );

      await expect(
        measurementUnitsService.getMeasurementUnitById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(
        measurementUnitRepository.getMeasurementUnitById,
      ).toHaveBeenCalledWith(mockId);
    });

    it('should return the measurement unit if found', async () => {
      const mockResult = 'some measurement unit';
      const mockId = 'some id';
      measurementUnitRepository.getMeasurementUnitById.mockResolvedValue(
        mockResult,
      );

      const result = await measurementUnitsService.getMeasurementUnitById(
        mockId,
      );
      expect(
        measurementUnitRepository.getMeasurementUnitById,
      ).toHaveBeenCalledWith(mockId);
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
    it('should return a measurement unit if successful', async () => {
      const mockId = 'some id';
      const mockDto = 'some data';
      const mockResult = 'some measurement unit';
      measurementUnitRepository.updateMeasurementUnit.mockResolvedValue(
        mockResult,
      );

      const result = await measurementUnitsService.updateMeasurementUnit(
        mockId,
        mockDto,
      );
      expect(
        measurementUnitRepository.updateMeasurementUnit,
      ).toHaveBeenCalledWith(mockId, mockDto);
      expect(result).toBe(mockResult);
    });
  });

  describe('updateMeasurementUnitIngredientsAssigned', () => {
    it('should add value to ingredientsAssgined', async () => {
      const save = jest.fn();
      const mockMeasurementUnit = {
        ingredientsAssigned: 0,
        save,
      };

      const result = await measurementUnitsService.updateMeasurementUnitIngredientsAssigned(
        mockMeasurementUnit,
        1,
      );
      expect(save).toHaveBeenCalled();
      expect(result.ingredientsAssigned).toBe(1);
    });
  });

  describe('assignToIngredient', () => {
    it("should update the new and old measurement unit's 'ingredients assigned' property", async () => {
      const mockNewMeasurementUnit = {
        id: 'measurement unit id 1',
      };
      const save = jest.fn();
      const mockIngredients = [
        {
          measurementUnit: {
            id: 'measurement unit id 1',
          },
          save,
        },
        {
          measurementUnit: {
            id: 'measurement unit id 2',
          },
          save,
        },
      ];
      measurementUnitsService.updateMeasurementUnitIngredientsAssigned = jest.fn();

      await measurementUnitsService.assignToIngredient(
        mockNewMeasurementUnit,
        mockIngredients,
      );
      expect(
        measurementUnitsService.updateMeasurementUnitIngredientsAssigned,
      ).toHaveBeenCalledTimes(2);
      expect(mockIngredients[1].measurementUnit.id).toEqual(
        mockNewMeasurementUnit.id,
      );
      expect(save).toHaveBeenCalledTimes(1);
    });
  });
});
