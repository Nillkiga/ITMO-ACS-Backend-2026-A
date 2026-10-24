import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity()
export class Table extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', nullable: false })
    restaurantId!: number;

    @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'restaurantId' })
    restaurant!: Restaurant;

    @Column({ type: 'varchar', length: 20, nullable: false })
    tableNumber!: string;

    @Column({ type: 'int', nullable: false })
    capacity!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    locationDescription!: string;

    @Column({ type: 'varchar', length: 20, nullable: false, default: 'active' })
    status!: string;
}