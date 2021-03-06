import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from '../ingredient.entity';

@Entity({ name: 'ingredient_types' })
export class IngredientType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ingredient_type_id' })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'integer', name: 'ingredients_assigned', default: 0 })
  ingredientsAssigned: number;

  @OneToMany(
    type => Ingredient,
    ingredient => ingredient.ingredientType,
  )
  ingredients: Ingredient[];
}
