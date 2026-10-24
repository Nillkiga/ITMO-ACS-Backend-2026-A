import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from 'typeorm';

@Entity()
export class Reservation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', nullable: false })
    userId!: number;

    @Column({ type: 'int', nullable: false })
    tableId!: number;

    @Column({ type: 'date', nullable: false })
    reservationDate!: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    startTime!: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    endTime!: string;

    @Column({ type: 'int', nullable: false })
    guestsCount!: number;

    @Column({ type: 'varchar', length: 20, nullable: false, default: 'confirmed' })
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;
}