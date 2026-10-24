import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity()
export class MenuItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', nullable: false })
    restaurantId!: number;

    @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'restaurantId' })
    restaurant!: Restaurant;

    @Column({ type: 'varchar', length: 200, nullable: false })
    name!: string;

    @Column({ type: 'text', nullable: false })
    description!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    category!: string;

    @Column({ type: 'boolean', default: true })
    isAvailable!: boolean;
}