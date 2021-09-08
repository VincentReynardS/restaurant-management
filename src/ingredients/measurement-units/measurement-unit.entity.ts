import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from '../ingredient.entity';

@Entity({ name: 'measurement_units' })
export class MeasurementUnit extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'measurement_unit_id' })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'integer' })
  precision: number;

  @Column()
  abbreviation: string;

  @Column({ type: 'integer', name: 'ingredients_assigned', default: 0 })
  ingredientsAssigned: number;

  @OneToMany(
    type => Ingredient,
    ingredient => ingredient.measurementUnit,
    { eager: false },
  )
  ingredients: Ingredient[];
}
