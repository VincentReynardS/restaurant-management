import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IngredientStatesService } from './ingredient-states/ingredient-states.service';
import { IngredientTypesService } from './ingredient-types/ingredient-types.service';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { MeasurementUnitsService } from './measurement-units/measurement-units.service';

const mockIngredientsService = () => ({
  createIngredient: jest.fn(),
  getIngredients: jest.fn(),
  getIngredientById: jest.fn(),
  deleteIngredientById: jest.fn(),
});
const mockMeasurementUnitsService = () => ({
  updateMeasurementUnitIngredientsAssigned: jest.fn(),
});
const mockIngredientStatesService = () => ({
  updateIngredientStateIngredientsAssigned: jest.fn(),
});
const mockIngredientTypesService = () => ({
  updateIngredientTypeIngredientsAssigned: jest.fn(),
});

describe('IngredientsController', () => {
  let ingredientsService;
  let measurementUnitsService;
  let ingredientStatesService;
  let ingredientTypesService;
  let ingredientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsController,
        { provide: IngredientsService, useFactory: mockIngredientsService },
        {
          provide: MeasurementUnitsService,
          useFactory: mockMeasurementUnitsService,
        },
        {
          provide: IngredientStatesService,
          useFactory: mockIngredientStatesService,
        },
        {
          provide: IngredientTypesService,
          useFactory: mockIngredientTypesService,
        },
      ],
    }).compile();

    ingredientsService = module.get<IngredientsService>(IngredientsService);
    measurementUnitsService = module.get<MeasurementUnitsService>(
      MeasurementUnitsService,
    );
    ingredientStatesService = module.get<IngredientStatesService>(
      IngredientStatesService,
    );
    ingredientTypesService = module.get<IngredientTypesService>(
      IngredientTypesService,
    );
    ingredientsController = module.get<IngredientsController>(
      IngredientsController,
    );
  });

  describe('createIngredient', () => {
    it('should return the created ingredient if successful', async () => {
      const mockDto = {
        name: 'some name',
        measurementUnitId: 'some measurement unit id',
        ingredientStateId: 'some ingredient state id',
        ingredientTypeId: 'some ingredient type id',
      };
      const mockUpdatedMeasurementUnit = 'some measurement unit';
      const mockUpdatedIngredientState = 'some ingredient state';
      const mockUpdatedIngredientType = 'some ingredient type';
      const mockResult = 'some ingredient';
      measurementUnitsService.updateMeasurementUnitIngredientsAssigned.mockResolvedValue(
        mockUpdatedMeasurementUnit,
      );
      ingredientStatesService.updateIngredientStateIngredientsAssigned.mockResolvedValue(
        mockUpdatedIngredientState,
      );
      ingredientTypesService.updateIngredientTypeIngredientsAssigned.mockResolvedValue(
        mockUpdatedIngredientType,
      );
      ingredientsService.createIngredient.mockResolvedValue(mockResult);

      const result = await ingredientsController.createIngredient(mockDto);
      expect(
        measurementUnitsService.updateMeasurementUnitIngredientsAssigned,
      ).toHaveBeenCalledWith(mockDto.measurementUnitId, 1);
      expect(
        ingredientStatesService.updateIngredientStateIngredientsAssigned,
      ).toHaveBeenCalledWith(mockDto.ingredientStateId, 1);
      expect(
        ingredientTypesService.updateIngredientTypeIngredientsAssigned,
      ).toHaveBeenCalledWith(mockDto.ingredientTypeId, 1);
      expect(result).toBe(mockResult);
    });
  });

  describe('getIngredients', () => {
    it('should return an array of ingredients if successful', async () => {
      const mockResult = ['some ingredients'];
      ingredientsService.getIngredients.mockResolvedValue(mockResult);

      const result = await ingredientsService.getIngredients();
      expect(ingredientsService.getIngredients).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('deleteIngredientById', () => {
    it("should decrement the associated resources' 'ingredients assigned' property value", async () => {
      const mockId = 'some id';
      const mockMeasurementUnit = {
        id: 'some measurement unit id',
      };
      const mockIngredientState = {
        id: 'some ingredient state id',
      };
      const mockIngredientType = {
        id: 'some ingredient type id',
      };
      const mockIngredient = {
        measurementUnit: mockMeasurementUnit,
        ingredientState: mockIngredientState,
        ingredientType: mockIngredientType,
      };
      ingredientsService.getIngredientById.mockResolvedValue(mockIngredient);

      await ingredientsController.deleteIngredientById(mockId);
      expect(ingredientsService.getIngredientById).toHaveBeenCalledWith(mockId);
      expect(
        measurementUnitsService.updateMeasurementUnitIngredientsAssigned,
      ).toHaveBeenCalledWith(mockMeasurementUnit.id, -1);
      expect(
        ingredientStatesService.updateIngredientStateIngredientsAssigned,
      ).toHaveBeenCalledWith(mockIngredientState.id, -1);
      expect(
        ingredientTypesService.updateIngredientTypeIngredientsAssigned,
      ).toHaveBeenCalledWith(mockIngredientType.id, -1);
    });

    it("should not decrement the associated resources' 'ingredients assigned' property value if ingredient is not found", async () => {
      const mockId = 'some id';
      const mockResult = new NotFoundException();
      ingredientsService.getIngredientById.mockRejectedValue(mockResult);

      await expect(
        ingredientsController.deleteIngredientById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(ingredientsService.getIngredientById).toHaveBeenCalledWith(mockId);
      expect(
        measurementUnitsService.updateMeasurementUnitIngredientsAssigned,
      ).not.toHaveBeenCalled();
      expect(
        ingredientStatesService.updateIngredientStateIngredientsAssigned,
      ).not.toHaveBeenCalled();
      expect(
        ingredientTypesService.updateIngredientTypeIngredientsAssigned,
      ).not.toHaveBeenCalled();
    });
  });
});
