import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IngredientRepository } from './ingredient.repository';
import { IngredientsService } from './ingredients.service';

const mockIngredientRepository = () => ({
  createIngredient: jest.fn(),
  findOne: jest.fn(),
  getIngredients: jest.fn(),
  delete: jest.fn(),
});

describe('IngredientsService', () => {
  let ingredientRepository;
  let ingredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsService,
        { provide: IngredientRepository, useFactory: mockIngredientRepository },
      ],
    }).compile();

    ingredientRepository = module.get<IngredientRepository>(
      IngredientRepository,
    );
    ingredientsService = module.get<IngredientsService>(IngredientsService);
  });

  describe('createIngredient', () => {
    it('should return an ingredient if successful', async () => {
      const mockData = {
        name: 'some name',
        measurementUnit: 'some measurement unit',
        ingredientState: 'some ingredient state',
        ingredientType: 'some ingredient type',
      };
      const mockIngredient = 'some ingredient';
      ingredientRepository.createIngredient.mockResolvedValue(mockIngredient);

      const result = await ingredientsService.createIngredient(
        mockData.name,
        mockData.measurementUnit,
        mockData.ingredientState,
        mockData.ingredientType,
      );
      expect(ingredientRepository.createIngredient).toHaveBeenCalledWith(
        mockData.name,
        mockData.measurementUnit,
        mockData.ingredientState,
        mockData.ingredientType,
      );
      expect(result).toBe(mockIngredient);
    });
  });

  describe('getIngredientById', () => {
    it('should throw not found exception if ingredient is not found', async () => {
      const mockResult = undefined;
      const mockId = 'some id';
      ingredientRepository.findOne.mockResolvedValue(mockResult);

      await expect(
        ingredientsService.getIngredientById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(ingredientRepository.findOne).toHaveBeenCalledWith(mockId);
    });

    it('should return the ingredient if found', async () => {
      const mockResult = 'some ingredient';
      const mockId = 'some id';
      ingredientRepository.findOne.mockResolvedValue(mockResult);

      const result = await ingredientsService.getIngredientById(mockId);
      expect(ingredientRepository.findOne).toHaveBeenCalledWith(mockId);
      expect(result).toBe(mockResult);
    });
  });

  describe('getIngredients', () => {
    it('should return an array of ingredients if successful', async () => {
      const mockResult = ['some ingredients'];
      ingredientRepository.getIngredients.mockResolvedValue(mockResult);

      const result = await ingredientsService.getIngredients();
      expect(ingredientRepository.getIngredients).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('deleteIngredientById', () => {
    let mockId;

    beforeEach(() => {
      mockId = 'some id';
    });

    it('should return null (void) if deletion is successful', async () => {
      const mockDeleteResult = {
        affected: 1,
      };
      ingredientRepository.delete.mockResolvedValue(mockDeleteResult);

      await ingredientsService.deleteIngredientById(mockId);
      expect(ingredientRepository.delete).toHaveBeenCalledWith(mockId);
    });

    it('should throw not found exception if no ingredient is found', async () => {
      const mockDeleteResult = {
        affected: 0,
      };
      ingredientRepository.delete.mockResolvedValue(mockDeleteResult);

      await expect(
        ingredientsService.deleteIngredientById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(ingredientRepository.delete).toHaveBeenCalledWith(mockId);
    });
  });
});
