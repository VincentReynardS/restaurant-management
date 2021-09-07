import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IngredientTypesController } from './ingredient-types.controller';
import { IngredientTypesService } from './ingredient-types.service';

const mockIngredientTypesService = () => ({
  createIngredientType: jest.fn(),
  getIngredientTypes: jest.fn(),
  getIngredientTypeById: jest.fn(),
  deleteIngredientTypeById: jest.fn(),
  updateIngredientType: jest.fn(),
});

describe('IngredientTypesController', () => {
  let ingredientTypesService;
  let ingredientTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientTypesController,
        {
          provide: IngredientTypesService,
          useFactory: mockIngredientTypesService,
        },
      ],
    }).compile();

    ingredientTypesService = module.get<IngredientTypesService>(
      IngredientTypesService,
    );
    ingredientTypesController = module.get<IngredientTypesController>(
      IngredientTypesController,
    );
  });

  describe('createIngredientType', () => {
    let mockDto;

    beforeEach(() => {
      mockDto = 'some data';
    });

    it('should throw conflict exception if ingredient type is already exists', async () => {
      const mockResult = new ConflictException();
      ingredientTypesService.createIngredientType.mockRejectedValue(mockResult);

      await expect(
        ingredientTypesController.createIngredientType(mockDto),
      ).rejects.toThrow(ConflictException);
      expect(ingredientTypesService.createIngredientType).toHaveBeenCalledWith(
        mockDto,
      );
    });

    it('should return the created ingredient type if successful', async () => {
      const mockResult = 'some ingredient type';
      ingredientTypesService.createIngredientType.mockResolvedValue(mockResult);

      const result = await ingredientTypesController.createIngredientType(
        mockDto,
      );
      expect(ingredientTypesService.createIngredientType).toHaveBeenCalledWith(
        mockDto,
      );
      expect(result).toBe(mockResult);
    });
  });

  describe('getIngredientTypes', () => {
    it('should return an array of ingredient types', async () => {
      const mockResult = ['some ingredient types'];
      ingredientTypesService.getIngredientTypes.mockResolvedValue(mockResult);

      const result = await ingredientTypesController.getIngredientTypes();
      expect(ingredientTypesService.getIngredientTypes).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('deleteIngredientTypeById', () => {
    let mockId;

    beforeEach(() => {
      mockId = 'some id';
    });

    it('should call ingredientTypesService.deleteIngredientTypeById() to delete', async () => {
      const mockData = {
        ingredientsAssigned: 0,
      };
      ingredientTypesService.getIngredientTypeById.mockResolvedValue(mockData);

      await ingredientTypesController.deleteIngredientTypeById(mockId);
      expect(
        ingredientTypesService.deleteIngredientTypeById,
      ).toHaveBeenCalledWith(mockId);
    });

    it('should throw not found exception if measurement unit is not found', async () => {
      const mockData = undefined;
      ingredientTypesService.getIngredientTypeById.mockResolvedValue(mockData);

      await expect(
        ingredientTypesController.deleteIngredientTypeById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(
        ingredientTypesService.deleteIngredientTypeById,
      ).not.toHaveBeenCalled();
    });

    it('should throw conflict exception if measurement unit is still being used by at least one ingredient', async () => {
      const mockData = {
        ingredientsAssigned: 5,
      };
      ingredientTypesService.getIngredientTypeById.mockResolvedValue(mockData);

      await expect(
        ingredientTypesController.deleteIngredientTypeById(mockId),
      ).rejects.toThrow(ConflictException);
      expect(
        ingredientTypesService.deleteIngredientTypeById,
      ).not.toHaveBeenCalled();
    });
  });

  describe('updateIngredientType', () => {
    it('should return an ingredient type if successful', async () => {
      const mockId = 'some id';
      const mockDto = 'some data';
      const mockResult = 'some measurement unit';
      ingredientTypesService.updateIngredientType.mockResolvedValue(mockResult);

      const result = await ingredientTypesService.updateIngredientType(
        mockId,
        mockDto,
      );
      expect(ingredientTypesService.updateIngredientType).toHaveBeenCalledWith(
        mockId,
        mockDto,
      );
      expect(result).toBe(mockResult);
    });
  });
});
