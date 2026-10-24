import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from 'typeorm';

@Entity()
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', nullable: false })
    userId!: number;

    @Column({ type: 'int', nullable: false })
    restaurantId!: number;

    @Column({ type: 'int', nullable: false })
    rating!: number;

    @Column({ type: 'text', nullable: false })
    comment!: string;

    @CreateDateColumn()
    createdAt!: Date;
}