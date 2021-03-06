import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Inflow } from './inflow.entity';
import { InflowRepository } from './inflow.repository';

describe('InflowRepository', () => {
  let inflowRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InflowRepository],
    }).compile();

    inflowRepository = module.get<InflowRepository>(InflowRepository);
  });

  describe('createInflow', () => {
    it("should round the valueAdded to the correct precision according to the ingredient's measurement unit", async () => {
      const mockIngredient = {
        measurementUnit: {
          precision: 1,
        },
      };
      const mockDto = {
        date: 'some date',
        reason: 'some reason',
        price: 'some price',
        quantity: 5.46,
        additionalDetails: 'some additional details',
      };
      const save = jest.fn();
      const mockInflow = {
        save,
      };
      inflowRepository.create = jest.fn().mockReturnValue(mockInflow);

      const result: Inflow = await inflowRepository.createInflow(
        mockDto,
        mockIngredient,
      );
      expect(save).toHaveBeenCalled();
      expect(result.quantity).toBe(5.5);
    });
  });

  describe('deleteInflows', () => {
    let mockWhere;
    let mockExecute;
    let mockDelete;

    beforeEach(() => {
      mockWhere = jest.fn();
      mockExecute = jest.fn();
      mockDelete = jest.fn().mockReturnValue({
        where: mockWhere,
        execute: mockExecute,
      });
      inflowRepository.createQueryBuilder = jest.fn().mockReturnValue({
        delete: mockDelete,
      });
    });

    it('should execute delete query when filter is applied', async () => {
      const mockFilterDto = {
        ingredientId: 'some ingredient id',
      };
      await inflowRepository.deleteInflows(mockFilterDto);
      expect(mockWhere).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should not execute delete query if no filter is applied', async () => {
      const mockFilterDto = {}; // filter DTO is empty

      await expect(
        inflowRepository.deleteInflows(mockFilterDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockWhere).not.toHaveBeenCalled();
      expect(mockExecute).not.toHaveBeenCalled();
    });
  });
});
