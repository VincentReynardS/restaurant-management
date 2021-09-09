import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IngredientRepository } from '../ingredient.repository';
import { IngredientState } from './ingredient-state.entity';
import { IngredientStateRepository } from './ingredient-state.repository';
import { IngredientStatesService } from './ingredient-states.service';

const mockIngredientStateRepository = () => ({
  createIngredientState: jest.fn(),
  findOne: jest.fn(),
  getIngredientStates: jest.fn(),
  delete: jest.fn(),
  updateIngredientState: jest.fn(),
});
const mockIngredientRepository = () => ({
  getIngredients: jest.fn(),
});

describe('IngredientStatesService', () => {
  let ingredientStateRepository;
  let ingredientStatesService;
  let ingredientRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientStatesService,
        {
          provide: IngredientStateRepository,
          useFactory: mockIngredientStateRepository,
        },
        { provide: IngredientRepository, useFactory: mockIngredientRepository },
      ],
    }).compile();

    ingredientStateRepository = module.get<IngredientStateRepository>(
      IngredientStateRepository,
    );
    ingredientStatesService = module.get<IngredientStatesService>(
      IngredientStatesService,
    );
    ingredientRepository = module.get<IngredientRepository>(
      IngredientRepository,
    );
  });

  describe('createIngredientState', () => {
    it('should return an ingredient state if successful', async () => {
      const mockDto = 'some data';
      const mockResult = 'some ingredient state';
      ingredientStateRepository.createIngredientState.mockResolvedValue(
        mockResult,
      );

      const result = await ingredientStatesService.createIngredientState(
        mockDto,
      );
      expect(
        ingredientStateRepository.createIngredientState,
      ).toHaveBeenCalledWith(mockDto);
      expect(result).toBe(mockResult);
    });
  });

  describe('getIngredientStateById', () => {
    it('should return the ingredient state if found', async () => {
      const mockId = 'some id';
      const mockResult = 'some ingredient state';
      ingredientStateRepository.findOne.mockResolvedValue(mockResult);

      const result = await ingredientStatesService.getIngredientStateById(
        mockId,
      );
      expect(ingredientStateRepository.findOne).toHaveBeenCalledWith(mockId);
      expect(result).toBe(mockResult);
    });

    it('should throw not found exception if ingredient state is not found', async () => {
      const mockId = 'some id';
      const mockResult = undefined;
      ingredientStateRepository.findOne.mockResolvedValue(mockResult);

      await expect(
        ingredientStatesService.getIngredientStateById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(ingredientStateRepository.findOne).toHaveBeenCalledWith(mockId);
    });
  });

  describe('getIngredientStates', () => {
    it('should return an array of ingredient states', async () => {
      const mockResult = ['some ingredient states'];
      ingredientStateRepository.getIngredientStates.mockResolvedValue(
        mockResult,
      );

      const result = await ingredientStatesService.getIngredientStates();
      expect(ingredientStateRepository.getIngredientStates).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('deleteIngredientStateById', () => {
    let mockId;

    beforeEach(() => {
      mockId = 'some id';
    });

    it('should return null (void) if deletion is successful', async () => {
      const mockDeleteResult = {
        affected: 1,
      };
      ingredientStateRepository.delete.mockResolvedValue(mockDeleteResult);

      await ingredientStatesService.deleteIngredientStateById(mockId);
      expect(ingredientStateRepository.delete).toHaveBeenCalledWith(mockId);
    });

    it('should throw not found exception if no ingredient state is found', async () => {
      const mockDeleteResult = {
        affected: 0,
      };
      ingredientStateRepository.delete.mockResolvedValue(mockDeleteResult);

      await expect(
        ingredientStatesService.deleteIngredientStateById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(ingredientStateRepository.delete).toHaveBeenCalledWith(mockId);
    });
  });

  describe('updateIngredientState', () => {
    it('should return an ingredient state if successful', async () => {
      const mockId = 'some id';
      const mockDto = 'some data';
      const mockResult = 'some ingredient state';
      ingredientStateRepository.updateIngredientState.mockResolvedValue(
        mockResult,
      );

      const result = await ingredientStatesService.updateIngredientState(
        mockId,
        mockDto,
      );
      expect(
        ingredientStateRepository.updateIngredientState,
      ).toHaveBeenCalledWith(mockId, mockDto);
      expect(result).toBe(mockResult);
    });
  });

  describe('updateIngredientStateIngredientsAssigned', () => {
    it('should add value to ingredientsAssigned', async () => {
      const mockId = 'some id';
      const save = jest.fn();
      const mockIngredientState = {
        ingredientsAssigned: 0,
        save,
      };
      ingredientStatesService.getIngredientStateById = jest
        .fn()
        .mockResolvedValue(mockIngredientState);

      const result = await ingredientStatesService.updateIngredientStateIngredientsAssigned(
        mockId,
        1,
      );
      expect(
        ingredientStatesService.getIngredientStateById,
      ).toHaveBeenCalledWith(mockId);
      expect(save).toHaveBeenCalled();
      expect(result.ingredientsAssigned).toBe(1);
    });
  });

  describe('assignToIngredient', () => {
    it("should update the new and old ingredient state's 'ingredients assigned' property", async () => {
      const mockDto = {
        ingredientStateId: 'some ingredient state id',
        ingredientIds: ['ingredient id 1', 'ingredient id 2'],
      };
      const mockNewIngredientState = {
        id: 'ingredient state id 1',
      };
      const save = jest.fn();
      const mockIngredients = [
        {
          ingredientState: {
            id: 'ingredient state id 1',
          },
          save,
        },
        {
          ingredientState: {
            id: 'ingredient state id 2',
          },
          save,
        },
      ];
      ingredientStatesService.getIngredientStateById = jest
        .fn()
        .mockResolvedValue(mockNewIngredientState);
      ingredientStatesService.updateIngredientStateIngredientsAssigned = jest.fn();
      ingredientRepository.getIngredients.mockResolvedValue(mockIngredients);

      await ingredientStatesService.assignToIngredient(mockDto);
      expect(
        ingredientStatesService.updateIngredientStateIngredientsAssigned,
      ).toHaveBeenCalledTimes(2);
      expect(mockIngredients[1].ingredientState.id).toEqual(
        mockNewIngredientState.id,
      );
      expect(save).toHaveBeenCalledTimes(1);
    });
  });
});
