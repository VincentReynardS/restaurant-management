import { Module } from '@nestjs/common';
import { InflowsService } from './inflows.service';
import { InflowsController } from './inflows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InflowRepository } from './inflow.repository';
import { IngredientsModule } from 'src/ingredients/ingredients.module';

@Module({
  imports: [TypeOrmModule.forFeature([InflowRepository]), IngredientsModule],
  providers: [InflowsService],
  controllers: [InflowsController],
})
export class InflowsModule {}
