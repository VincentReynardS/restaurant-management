import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ingredient_types' })
export class IngredientType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ingredient_type_id' })
  ingredientTypeId: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'integer', name: 'ingredients_assigned', default: 0 })
  ingredientsAssigned: number;
}
