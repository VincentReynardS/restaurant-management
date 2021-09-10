import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InflowRepository } from './inflow.repository';
import { InflowsService } from './inflows.service';

const mockInflowRepository = () => ({
  createInflow: jest.fn(),
  getInflows: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
});

describe('InflowsService', () => {
  let inflowRepository;
  let inflowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InflowsService,
        { provide: InflowRepository, useFactory: mockInflowRepository },
      ],
    }).compile();

    inflowRepository = module.get<InflowRepository>(InflowRepository);
    inflowsService = module.get<InflowsService>(InflowsService);
  });

  describe('createInflow', () => {
    it('should return an inflow if successful', async () => {
      const mockDto = 'some data';
      const mockIngredient = 'some ingredient';
      const mockResult = 'some inflow';
      inflowRepository.createInflow.mockResolvedValue(mockResult);

      const result = await inflowsService.createInflow(mockDto, mockIngredient);
      expect(inflowRepository.createInflow).toHaveBeenCalledWith(
        mockDto,
        mockIngredient,
      );
      expect(result).toBe(mockResult);
    });
  });

  describe('getInflows', () => {
    it('should return an array of inflows if successful', async () => {
      const mockInflows = ['some inflows'];
      inflowRepository.getInflows.mockResolvedValue(mockInflows);

      const result = await inflowsService.getInflows();
      expect(inflowRepository.getInflows).toHaveBeenCalled();
      expect(result).toBe(mockInflows);
    });
  });

  describe('getInflowById', () => {
    it('should return an inflow entry if successful', async () => {
      const mockId = 'some id';
      const mockInflow = 'some inflow';
      inflowRepository.findOne.mockResolvedValue(mockInflow);

      const result = await inflowsService.getInflowById(mockId);
      expect(inflowRepository.findOne).toHaveBeenCalledWith(mockId);
      expect(result).toBe(mockInflow);
    });
  });

  describe('deleteInflowById', () => {
    let mockId;

    beforeEach(() => {
      mockId = 'some id';
    });

    it('should return null (void) if deletion is successful', async () => {
      const mockDeleteResult = {
        affected: 1,
      };
      inflowRepository.delete.mockResolvedValue(mockDeleteResult);

      await inflowsService.deleteInflowById(mockId);
      expect(inflowRepository.delete).toHaveBeenCalledWith(mockId);
    });

    it('should throw not found exception if no inflow is found', async () => {
      const mockDeleteResult = {
        affected: 0,
      };
      inflowRepository.delete.mockResolvedValue(mockDeleteResult);

      await expect(inflowsService.deleteInflowById(mockId)).rejects.toThrow(
        NotFoundException,
      );
      expect(inflowRepository.delete).toHaveBeenCalledWith(mockId);
    });
  });
});
