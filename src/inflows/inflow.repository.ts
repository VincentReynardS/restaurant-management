import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Ingredient } from 'src/ingredients/ingredient.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateInflowDto } from './dto/create-inflow.dto';
import { DeleteInflowsDto } from './dto/delete-inflows-filter.dto';
import { Inflow } from './inflow.entity';

@EntityRepository(Inflow)
export class InflowRepository extends Repository<Inflow> {
  async createInflow(
    createInflowDto: CreateInflowDto,
    ingredient: Ingredient,
  ): Promise<Inflow> {
    let { date, reason, price, quantity, additionalDetails } = createInflowDto;

    quantity = +createInflowDto.quantity.toFixed(
      ingredient.measurementUnit.precision,
    );

    const inflow = this.create();
    inflow.date = date;
    inflow.reason = reason;
    inflow.price = price;
    inflow.quantity = quantity;
    inflow.additionalDetails = additionalDetails;
    inflow.ingredient = ingredient;

    try {
      await inflow.save();
    } catch (error) {
      console.log(error.stack);
      throw new InternalServerErrorException();
    }

    return inflow;
  }

  async getInflows(): Promise<Inflow[]> {
    const query = this.createQueryBuilder('inflow').orderBy(
      'inflow.date',
      'DESC',
    );

    try {
      return await query.getMany();
    } catch (error) {
      console.log(error.stack);
      throw new InternalServerErrorException();
    }
  }

  async deleteInflows(filterDto: DeleteInflowsDto): Promise<void> {
    const { ingredientId } = filterDto;
    const query = this.createQueryBuilder('inflow').delete();
    let appliedFilters = 0;

    if (ingredientId) {
      query.where('inflow.ingredient_id = :ingredientId', { ingredientId });
      appliedFilters++;
    }

    if (appliedFilters === 0) {
      throw new BadRequestException(
        `There must be at least one filter applied`,
      );
    }

    try {
      await query.execute();
    } catch (error) {
      console.log(error.stack);
      throw new InternalServerErrorException();
    }
  }
}
