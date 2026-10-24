import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Restaurant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 300, nullable: false })
    name!: string;

    @Column({ type: 'text', nullable: false })
    description!: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    address!: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    city!: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    district!: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    cuisineType!: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    priceCategory!: string;

    @Column({ type: 'varchar', length: 30, nullable: false })
    phone!: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    openingTime!: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    closingTime!: string;
}