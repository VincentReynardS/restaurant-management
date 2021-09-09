import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsService } from '../ingredients.service';
import { IngredientStatesController } from './ingredient-states.controller';
import { IngredientStatesService } from './ingredient-states.service';

const mockIngredientStatesService = () => ({
  createIngredientState: jest.fn(),
  getIngredientStates: jest.fn(),
  getIngredientStateById: jest.fn(),
  deleteIngredientStateById: jest.fn(),
  updateIngredientState: jest.fn(),
  assignToIngredient: jest.fn(),
});
const mockIngredientsService = () => ({
  getIngredients: jest.fn(),
});

describe('IngredientStatesController', () => {
  let ingredientStatesService;
  let ingredientStatesController;
  let ingredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientStatesController,
        {
          provide: IngredientStatesService,
          useFactory: mockIngredientStatesService,
        },
        {
          provide: IngredientsService,
          useFactory: mockIngredientsService,
        },
      ],
    }).compile();

    ingredientStatesService = module.get<IngredientStatesService>(
      IngredientStatesService,
    );
    ingredientStatesController = module.get<IngredientStatesController>(
      IngredientStatesController,
    );
    ingredientsService = module.get<IngredientsService>(IngredientsService);
  });

  describe('createIngredientState', () => {
    it('should return an ingredient state if successful', async () => {
      const mockDto = 'some data';
      const mockResult = 'some ingredient state';
      ingredientStatesService.createIngredientState.mockResolvedValue(
        mockResult,
      );

      const result = await ingredientStatesController.createIngredientState(
        mockDto,
      );
      expect(
        ingredientStatesService.createIngredientState,
      ).toHaveBeenCalledWith(mockDto);
      expect(result).toBe(mockResult);
    });
  });

  describe('getIngredientStates', () => {
    it('should return an array of ingredient states', async () => {
      const mockResult = ['some ingredient states'];
      ingredientStatesService.getIngredientStates.mockResolvedValue(mockResult);

      const result = await ingredientStatesController.getIngredientStates();
      expect(ingredientStatesService.getIngredientStates).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('deleteIngredientStateById', () => {
    let mockId;

    beforeEach(() => {
      mockId = 'some id';
    });

    it('should call ingredientStatesService.deleteIngredientStateById() to delete', async () => {
      const mockData = {
        ingredientsAssigned: 0,
      };
      ingredientStatesService.getIngredientStateById.mockResolvedValue(
        mockData,
      );

      await ingredientStatesController.deleteIngredientStateById(mockId);
      expect(
        ingredientStatesService.deleteIngredientStateById,
      ).toHaveBeenCalledWith(mockId);
    });

    it('should throw not found exception if ingredient state is not found', async () => {
      const mockData = undefined;
      ingredientStatesService.getIngredientStateById.mockResolvedValue(
        mockData,
      );

      await expect(
        ingredientStatesController.deleteIngredientStateById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(
        ingredientStatesService.deleteIngredientStateById,
      ).not.toHaveBeenCalled();
    });

    it('should throw conflict exception if ingredient state is still being used by at least one ingredient', async () => {
      const mockData = {
        ingredientsAssigned: 5,
      };
      ingredientStatesService.getIngredientStateById.mockResolvedValue(
        mockData,
      );

      await expect(
        ingredientStatesController.deleteIngredientStateById(mockId),
      ).rejects.toThrow(ConflictException);
      expect(
        ingredientStatesService.deleteIngredientStateById,
      ).not.toHaveBeenCalled();
    });
  });

  describe('updateIngredientState', () => {
    it('should return an ingredient state if successful', async () => {
      const mockId = 'some id';
      const mockDto = 'some data';
      const mockResult = 'some ingredient state';
      ingredientStatesService.updateIngredientState.mockResolvedValue(
        mockResult,
      );

      const result = await ingredientStatesService.updateIngredientState(
        mockId,
        mockDto,
      );
      expect(
        ingredientStatesService.updateIngredientState,
      ).toHaveBeenCalledWith(mockId, mockDto);
      expect(result).toBe(mockResult);
    });
  });

  describe('assignToIngredient', () => {
    it('should call ingredientStatesService.assignToIngredient()', async () => {
      const mockDto = 'some data';
      const mockNewIngredientState = 'some measurement unit';
      const mockIngredients = ['some ingredients'];
      ingredientStatesService.getIngredientStateById = jest
        .fn()
        .mockResolvedValue(mockNewIngredientState);
      ingredientsService.getIngredients.mockResolvedValue(mockIngredients);

      await ingredientStatesController.assignToIngredient(mockDto);
      expect(ingredientStatesService.assignToIngredient).toHaveBeenCalledWith(
        mockNewIngredientState,
        mockIngredients,
      );
    });
  });
});
