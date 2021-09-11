import { forwardRef, Module } from '@nestjs/common';
import { InflowsService } from './inflows.service';
import { InflowsController } from './inflows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InflowRepository } from './inflow.repository';
import { IngredientsModule } from 'src/ingredients/ingredients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InflowRepository]),
    forwardRef(() => IngredientsModule),
  ],
  providers: [InflowsService],
  controllers: [InflowsController],
  exports: [InflowsService],
})
export class InflowsModule {}
