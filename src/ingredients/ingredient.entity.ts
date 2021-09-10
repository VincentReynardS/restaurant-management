import { Inflow } from '../inflows/inflow.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IngredientState } from './ingredient-states/ingredient-state.entity';
import { IngredientType } from './ingredient-types/ingredient-type.entity';
import { MeasurementUnit } from './measurement-units/measurement-unit.entity';

@Entity({ name: 'ingredients' })
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ingredient_id' })
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(
    type => MeasurementUnit,
    measurementUnit => measurementUnit.ingredients,
    { eager: true },
  )
  @JoinColumn({ name: 'measurement_unit_id' })
  measurementUnit: MeasurementUnit;

  @ManyToOne(
    type => IngredientState,
    ingredientState => ingredientState.ingredients,
    { eager: true },
  )
  @JoinColumn({ name: 'ingredient_state_id' })
  ingredientState: IngredientState;

  @ManyToOne(
    type => IngredientType,
    ingredientType => ingredientType.ingredients,
    { eager: true },
  )
  @JoinColumn({ name: 'ingredient_type_id' })
  ingredientType: IngredientType;

  @Column({ name: 'current_stock', default: 0 })
  currentStock: number;

  @OneToMany(
    type => Inflow,
    inflow => inflow.ingredient,
  )
  inflows: Inflow[];
}
