import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from 'src/ingredients/ingredient.entity';
import { CreateInflowDto } from './dto/create-inflow.dto';
import { DeleteInflowsDto } from './dto/delete-inflows-filter.dto';
import { Inflow } from './inflow.entity';
import { InflowRepository } from './inflow.repository';

@Injectable()
export class InflowsService {
  constructor(
    @InjectRepository(InflowRepository)
    private inflowRepository: InflowRepository,
  ) {}

  async createInflow(
    createInflowDto: CreateInflowDto,
    ingredient: Ingredient,
  ): Promise<Inflow> {
    return this.inflowRepository.createInflow(createInflowDto, ingredient);
  }

  async getInflows(): Promise<Inflow[]> {
    return this.inflowRepository.getInflows();
  }

  async getInflowById(id: string): Promise<Inflow> {
    const inflow = await this.inflowRepository.findOne(id);

    if (!inflow) {
      throw new NotFoundException(`Inflow with id '${id}' not found`);
    }

    return inflow;
  }

  /**
   * IMPORTANT: Deleting the inflow entry will not automatically decrease the associated
   * ingreident's current stock property. Make sure to update the current stock for the related
   * ingredient via ingredients service.
   */
  async deleteInflowById(id: string): Promise<void> {
    const result = await this.inflowRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Inflow with id '${id}' not found`);
    }
  }

  async deleteInflows(filterDto: DeleteInflowsDto): Promise<void> {
    return this.inflowRepository.deleteInflows(filterDto);
  }
}
