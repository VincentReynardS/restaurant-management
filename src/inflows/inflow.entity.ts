import { Ingredient } from '../ingredients/ingredient.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InflowReason } from './inflow-reason.enum';

@Entity({ name: 'inflow' })
export class Inflow extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'inflow_id' })
  id: string;

  @ManyToOne(
    type => Ingredient,
    ingredient => ingredient.inflows,
    { eager: true },
  )
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({ name: 'ingredient_id' })
  ingredientId: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ nullable: false })
  reason: InflowReason;

  @Column({ type: 'real', nullable: false })
  price: number;

  @Column({ type: 'real', nullable: false })
  quantity: number;

  @Column()
  additionalDetails: string;
}
