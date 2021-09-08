import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IngredientTypeRepository } from './ingredient-type.repository';
import { IngredientTypesService } from './ingredient-types.service';

const mockIngredientTypeRepository = () => ({
  createIngredientType: jest.fn(),
  findOne: jest.fn(),
  getIngredientTypes: jest.fn(),
  delete: jest.fn(),
  updateIngredientType: jest.fn(),
});

describe('IngredientTypesService', () => {
  let ingredientTypeRepository;
  let ingredientTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientTypesService,
        {
          provide: IngredientTypeRepository,
          useFactory: mockIngredientTypeRepository,
        },
      ],
    }).compile();

    ingredientTypeRepository = module.get<IngredientTypeRepository>(
      IngredientTypeRepository,
    );
    ingredientTypesService = module.get<IngredientTypesService>(
      IngredientTypesService,
    );
  });

  describe('createIngredientType', () => {
    let mockDto;

    beforeEach(() => {
      mockDto = 'some data';
    });

    it('should call ingredientTypeRepository.createIngredientType to create', async () => {
      const mockResult = 'some ingredient type';
      ingredientTypeRepository.createIngredientType.mockResolvedValue(
        mockResult,
      );

      const result = await ingredientTypesService.createIngredientType(mockDto);
      expect(
        ingredientTypeRepository.createIngredientType,
      ).toHaveBeenLastCalledWith(mockDto);
      expect(result).toBe(mockResult);
    });

    it('should throw conflict exception if ingredient type already exists', async () => {
      const mockResult = new ConflictException();
      ingredientTypeRepository.createIngredientType.mockRejectedValue(
        mockResult,
      );

      await expect(
        ingredientTypesService.createIngredientType(mockDto),
      ).rejects.toThrow(ConflictException);
      expect(
        ingredientTypeRepository.createIngredientType,
      ).toHaveBeenLastCalledWith(mockDto);
    });
  });

  describe('getIngredientTypeById', () => {
    it('should return the ingredient type if found', async () => {
      const mockId = 'some id';
      const mockResult = 'some ingredient type';
      ingredientTypeRepository.findOne.mockResolvedValue(mockResult);

      const result = await ingredientTypesService.getIngredientTypeById(mockId);
      expect(ingredientTypeRepository.findOne).toHaveBeenCalledWith(mockId);
      expect(result).toBe(mockResult);
    });

    it('should throw not found exception if ingredient type is not found', async () => {
      const mockId = 'some id';
      const mockResult = undefined;
      ingredientTypeRepository.findOne.mockResolvedValue(mockResult);

      await expect(
        ingredientTypesService.getIngredientTypeById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(ingredientTypeRepository.findOne).toHaveBeenCalledWith(mockId);
    });
  });

  describe('getIngredientTypes', () => {
    it('should return an array of ingredient types', async () => {
      const mockResult = ['some ingredient types'];
      ingredientTypeRepository.getIngredientTypes.mockResolvedValue(mockResult);

      const result = await ingredientTypesService.getIngredientTypes();
      expect(ingredientTypeRepository.getIngredientTypes).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('deleteIngredientTypeById', () => {
    let mockId;

    beforeEach(() => {
      mockId = 'some id';
    });

    it('should return null (void) if deletion is successful', async () => {
      const mockDeleteResult = {
        affected: 1,
      };
      ingredientTypeRepository.delete.mockResolvedValue(mockDeleteResult);

      await ingredientTypesService.deleteIngredientTypeById(mockId);
      expect(ingredientTypeRepository.delete).toHaveBeenCalledWith(mockId);
    });

    it('should throw not found exception if no ingredient type is found', async () => {
      const mockDeleteResult = {
        affected: 0,
      };
      ingredientTypeRepository.delete.mockResolvedValue(mockDeleteResult);

      await expect(
        ingredientTypesService.deleteIngredientTypeById(mockId),
      ).rejects.toThrow(NotFoundException);
      expect(ingredientTypeRepository.delete).toHaveBeenCalledWith(mockId);
    });
  });

  describe('updateIngredientType', () => {
    it('should return an ingredient type if successful', async () => {
      const mockId = 'some id';
      const mockDto = 'some data';
      const mockResult = 'some ingredient type';
      ingredientTypeRepository.updateIngredientType.mockResolvedValue(
        mockResult,
      );

      const result = await ingredientTypesService.updateIngredientType(
        mockId,
        mockDto,
      );
      expect(
        ingredientTypeRepository.updateIngredientType,
      ).toHaveBeenCalledWith(mockId, mockDto);
      expect(result).toBe(mockResult);
    });
  });

  describe('updateIngredientTypeIngredientsAssigned', () => {
    it('should add value to ingredientsAssigned', async () => {
      const mockId = 'some id';
      const save = jest.fn();
      const mockIngredientType = {
        ingredientsAssigned: 0,
        save,
      };
      ingredientTypesService.getIngredientTypeById = jest
        .fn()
        .mockResolvedValue(mockIngredientType);

      const result = await ingredientTypesService.updateIngredientTypeIngredientsAssigned(
        mockId,
        1,
      );
      expect(ingredientTypesService.getIngredientTypeById).toHaveBeenCalledWith(
        mockId,
      );
      expect(save).toHaveBeenCalled();
      expect(result.ingredientsAssigned).toBe(1);
    });
  });
});
