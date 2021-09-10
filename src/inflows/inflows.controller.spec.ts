import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsService } from '../ingredients/ingredients.service';
import { InflowsController } from './inflows.controller';
import { InflowsService } from './inflows.service';

const mockInflowsService = () => ({
  createInflow: jest.fn(),
  getInflows: jest.fn(),
  getInflowById: jest.fn(),
  deleteInflowById: jest.fn(),
});
const mockIngredientsService = () => ({
  getIngredientById: jest.fn(),
  updateIngredientCurrentStock: jest.fn(),
});

describe('InflowsController', () => {
  let inflowsService;
  let ingredientsService;
  let inflowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InflowsController],
      providers: [
        { provide: InflowsService, useFactory: mockInflowsService },
        { provide: IngredientsService, useFactory: mockIngredientsService },
      ],
    }).compile();

    inflowsService = module.get<InflowsService>(InflowsService);
    ingredientsService = module.get<IngredientsService>(IngredientsService);
    inflowsController = module.get<InflowsController>(InflowsController);
  });

  describe('createInflow', () => {
    it("should update related ingredient's current stock", async () => {
      const mockDto = {
        ingredientId: 'some ingredient id',
        quantity: 'some quantity',
      };
      const mockIngredient = 'some ingredient';
      const mockInflow = 'some inflow';
      ingredientsService.getIngredientById.mockResolvedValue(mockIngredient);
      inflowsService.createInflow.mockResolvedValue(mockInflow);

      const result = await inflowsController.createInflow(mockDto);
      expect(
        ingredientsService.updateIngredientCurrentStock,
      ).toHaveBeenCalledWith(mockIngredient, mockDto.quantity);
      expect(result).toBe(mockInflow);
    });
  });

  describe('getInflows', () => {
    it('should return an array of inflows if successful', async () => {
      const mockInflows = ['some inflows'];
      inflowsService.getInflows.mockResolvedValue(mockInflows);

      const result = await inflowsController.getInflows();
      expect(inflowsService.getInflows).toHaveBeenCalled();
      expect(result).toBe(mockInflows);
    });
  });

  describe('deleteInflowById', () => {
    it("should update related ingredient's current stock and delete the inflow", async () => {
      const mockInflowId = 'some inflow id';
      const mockInflow = {
        ingredientId: 'some ingredient id',
        quantity: 1,
      };
      const mockIngredient = 'some ingredient';
      inflowsService.getInflowById.mockResolvedValue(mockInflow);
      ingredientsService.getIngredientById.mockResolvedValue(mockIngredient);

      await inflowsController.deleteInflowById(mockInflowId);
      expect(ingredientsService.getIngredientById).toHaveBeenCalledWith(
        mockInflow.ingredientId,
      );
      expect(
        ingredientsService.updateIngredientCurrentStock,
      ).toHaveBeenCalledWith(mockIngredient, mockInflow.quantity);
      expect(inflowsService.deleteInflowById).toHaveBeenCalledWith(
        mockInflowId,
      );
    });
  });
});
