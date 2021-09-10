import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Ingredient } from 'src/ingredients/ingredient.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateInflowDto } from './dto/create-inflow.dto';
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
}
