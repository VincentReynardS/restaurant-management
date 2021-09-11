import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InflowsService } from '../inflows/inflows.service';
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
  getMeasurementUnitById: jest.fn(),
  assignToIngredient: jest.fn(),
});
const mockIngredientStatesService = () => ({
  updateIngredientStateIngredientsAssigned: jest.fn(),
  getIngredientStateById: jest.fn(),
  assignToIngredient: jest.fn(),
});
const mockIngredientTypesService = () => ({
  updateIngredientTypeIngredientsAssigned: jest.fn(),
  getIngredientTypeById: jest.fn(),
  assignToIngredient: jest.fn(),
});
const mockInflowsService = () => ({
  deleteInflows: jest.fn(),
});

describe('IngredientsController', () => {
  let ingredientsService;
  let measurementUnitsService;
  let ingredientStatesService;
  let ingredientTypesService;
  let inflowsService;
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
        { provide: InflowsService, useFactory: mockInflowsService },
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
    inflowsService = module.get<InflowsService>(InflowsService);
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
      const mockMeasurementUnit = 'some measurement unit';
      const mockIngredientState = 'some ingredient state';
      const mockIngredientType = 'some ingredient type';
      const mockResult = 'some ingredient';
      measurementUnitsService.getMeasurementUnitById.mockResolvedValue(
        mockMeasurementUnit,
      );
      ingredientStatesService.getIngredientStateById.mockResolvedValue(
        mockIngredientState,
      );
      ingredientTypesService.getIngredientTypeById.mockResolvedValue(
        mockIngredientType,
      );
      ingredientsService.createIngredient.mockResolvedValue(mockResult);

      const result = await ingredientsController.createIngredient(mockDto);
      expect(
        measurementUnitsService.getMeasurementUnitById,
      ).toHaveBeenCalledWith(mockDto.measurementUnitId);
      expect(
        ingredientStatesService.getIngredientStateById,
      ).toHaveBeenCalledWith(mockDto.ingredientStateId);
      expect(ingredientTypesService.getIngredientTypeById).toHaveBeenCalledWith(
        mockDto.ingredientTypeId,
      );
      expect(
        measurementUnitsService.updateMeasurementUnitIngredientsAssigned,
      ).toHaveBeenCalledWith(mockMeasurementUnit, 1);
      expect(
        ingredientStatesService.updateIngredientStateIngredientsAssigned,
      ).toHaveBeenCalledWith(mockIngredientState, 1);
      expect(
        ingredientTypesService.updateIngredientTypeIngredientsAssigned,
      ).toHaveBeenCalledWith(mockIngredientType, 1);
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
      ).toHaveBeenCalledWith(mockMeasurementUnit, -1);
      expect(
        ingredientStatesService.updateIngredientStateIngredientsAssigned,
      ).toHaveBeenCalledWith(mockIngredientState, -1);
      expect(
        ingredientTypesService.updateIngredientTypeIngredientsAssigned,
      ).toHaveBeenCalledWith(mockIngredientType, -1);
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

  describe('updateIngredient', () => {
    it('should assign the new measurement unit, ingredient state, ingredient type to the ingredient', async () => {
      const mockIngredientId = 'some ingredient id';
      const mockDto = {
        name: 'some new ingredient name',
        measurementUnitId: 'some measurement unit id',
        ingredientStateId: 'some ingredient state id',
        ingredientTypeId: 'some ingredient type id',
      };
      const mockMeasurementUnit = 'some measuremenet unit';
      const mockIngredientState = 'some ingredient state';
      const mockIngredientType = 'some ingredient type';
      const mockIngredient = {
        name: 'some ingredient name',
      };
      measurementUnitsService.getMeasurementUnitById.mockResolvedValue(
        mockMeasurementUnit,
      );
      ingredientStatesService.getIngredientStateById.mockResolvedValue(
        mockIngredientState,
      );
      ingredientTypesService.getIngredientTypeById.mockResolvedValue(
        mockIngredientType,
      );
      ingredientsService.getIngredientById.mockResolvedValue(mockIngredient);

      const result = await ingredientsController.updateIngredient(
        mockIngredientId,
        mockDto,
      );
      expect(
        measurementUnitsService.assignToIngredient,
      ).toHaveBeenCalledWith(mockMeasurementUnit, [mockIngredient]);
      expect(
        ingredientStatesService.assignToIngredient,
      ).toHaveBeenCalledWith(mockIngredientState, [mockIngredient]);
      expect(
        ingredientTypesService.assignToIngredient,
      ).toHaveBeenCalledWith(mockIngredientType, [mockIngredient]);
      expect(result.name).toBe(mockDto.name);
    });
  });
});
