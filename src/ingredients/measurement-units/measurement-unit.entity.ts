import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
