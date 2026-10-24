import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity()
export class RestaurantPhoto extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', nullable: false })
    restaurantId!: number;

    @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'restaurantId' })
    restaurant!: Restaurant;

    @Column({ type: 'varchar', length: 500, nullable: false })
    photoUrl!: string;

    @Column({ type: 'varchar', length: 200, nullable: false })
    caption!: string;

    @CreateDateColumn()
    uploadedAt!: Date;
}