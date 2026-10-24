import { Get, Post, Delete, Param, Body, JsonController } from 'routing-controllers';
import { dataSource } from '../config/data-source';
import { Reservation } from '../models/reservation.entity';
import { UserClientService } from '../services/user-client.service';
import { RestaurantClientService } from '../services/restaurant-client.service';
import { publishEvent } from '../rabbitmq';

interface CreateReservationDto {
    userId: number;
    tableId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestsCount: number;
}

@JsonController('/api/reservations')
export class ReservationController {
    private reservationRepo = dataSource.getRepository(Reservation);
    private userClient: UserClientService;
    private restaurantClient: RestaurantClientService;

    constructor() {
        this.userClient = new UserClientService();
        this.restaurantClient = new RestaurantClientService();
    }

    @Get('/')
    async getAll() {
        return await this.reservationRepo.find();
    }

    @Post('/')
    async create(@Body() reservationData: CreateReservationDto) {
        const userExists = await this.userClient.checkUserExists(reservationData.userId);
        
        if (!userExists) {
            return {
                message: 'User not found',
                error: 'USER_NOT_FOUND'
            };
        }

        const table = await this.restaurantClient.validateTable(
            reservationData.tableId,
            reservationData.reservationDate,
            reservationData.startTime,
            reservationData.endTime
        );

        if (!table.exists) {
            return {
                message: 'Table not found',
                error: 'TABLE_NOT_FOUND'
            };
        }

        if (reservationData.guestsCount > table.capacity) {
            return {
                message: `Guests count exceeds table capacity. Max capacity: ${table.capacity}`,
                error: 'TABLE_CAPACITY_EXCEEDED'
            };
        }

        if (!table.isAvailable) {
            return {
                message: 'Table is not available at this time',
                error: 'TABLE_BUSY'
            };
        }

        const reservation = this.reservationRepo.create({
            ...reservationData,
            status: 'confirmed'
        });

        const savedReservation = await this.reservationRepo.save(reservation);

        // Отправляем событие о создании брони
        await publishEvent('reservation.created', {
            reservationId: savedReservation.id,
            tableId: reservationData.tableId,
            reservationDate: reservationData.reservationDate,
            startTime: reservationData.startTime,
            endTime: reservationData.endTime
        });

        return {
            success: true,
            reservation: savedReservation
        };
    }

    @Delete('/:id')
    async cancel(@Param('id') id: number) {
        const reservation = await this.reservationRepo.findOneBy({ id });

        if (!reservation) {
            return {
                message: 'Reservation not found',
                error: 'RESERVATION_NOT_FOUND'
            };
        }

        reservation.status = 'cancelled';
        await this.reservationRepo.save(reservation);

        // Отправляем событие об отмене брони
        await publishEvent('reservation.cancelled', {
            reservationId: reservation.id,
            tableId: reservation.tableId,
            reservationDate: reservation.reservationDate,
            startTime: reservation.startTime,
            endTime: reservation.endTime
        });

        return {
            success: true,
            message: 'Reservation cancelled',
            reservation: {
                id: reservation.id,
                status: reservation.status
            }
        };
    }
}