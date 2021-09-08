import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from '../ingredient.entity';

@Entity({ name: 'ingredient_states' })
export class IngredientState extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ingredient_state_id' })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'integer', name: 'ingredients_assigned', default: 0 })
  ingredientsAssigned: number;

  @OneToMany(
    type => Ingredient,
    ingredient => ingredient.ingredientState,
  )
  ingredients: Ingredient[];
}
