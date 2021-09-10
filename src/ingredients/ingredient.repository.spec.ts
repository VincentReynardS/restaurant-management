import { Test, TestingModule } from '@nestjs/testing';
import { IngredientRepository } from './ingredient.repository';

describe('IngredientRepository', () => {
  let ingredientRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngredientRepository],
    }).compile();

    ingredientRepository = module.get<IngredientRepository>(
      IngredientRepository,
    );
  });

  describe('updateIngredientCurrentStock', () => {
    it("should round the valueAdded to the correct precision according to the ingredient's measurement unit", async () => {
      const save = jest.fn();
      const mockIngredient = {
        measurementUnit: {
          precision: 1,
        },
        currentStock: 0,
        save,
      };
      const mockValueAdded = 5.46;

      await ingredientRepository.updateIngredientCurrentStock(
        mockIngredient,
        mockValueAdded,
      );
      expect(mockIngredient.currentStock).toBe(5.5);
      expect(mockIngredient.save).toHaveBeenCalled();
    });
  });
});
