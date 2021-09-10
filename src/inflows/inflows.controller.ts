import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { IngredientsService } from '../ingredients/ingredients.service';
import { CreateInflowDto } from './dto/create-inflow.dto';
import { Inflow } from './inflow.entity';
import { InflowsService } from './inflows.service';

@Controller('inflows')
export class InflowsController {
  constructor(
    private inflowsService: InflowsService,
    private ingredientsService: IngredientsService,
  ) {}

  @Post('')
  async createInflow(
    @Body(ValidationPipe) createInflowDto: CreateInflowDto,
  ): Promise<Inflow> {
    const { ingredientId, quantity } = createInflowDto;
    const ingredient = await this.ingredientsService.getIngredientById(
      ingredientId,
    );

    await this.ingredientsService.updateIngredientCurrentStock(
      ingredient,
      quantity,
    );

    return this.inflowsService.createInflow(createInflowDto, ingredient);
  }

  @Get('')
  async getInflows(): Promise<Inflow[]> {
    return this.inflowsService.getInflows();
  }

  @Delete('/:id')
  async deleteInflowById(@Param('id') inflowId: string): Promise<void> {
    const inflow = await this.inflowsService.getInflowById(inflowId);
    const ingredient = await this.ingredientsService.getIngredientById(
      inflow.ingredientId,
    );

    await Promise.all([
      this.ingredientsService.updateIngredientCurrentStock(
        ingredient,
        inflow.quantity,
      ),
      this.inflowsService.deleteInflowById(inflowId),
    ]);
  }
}
