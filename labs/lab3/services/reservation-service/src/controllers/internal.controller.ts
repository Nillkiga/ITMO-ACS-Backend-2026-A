import { Get, Param, JsonController, UseBefore } from 'routing-controllers';
import { dataSource } from '../config/data-source';
import { Reservation } from '../models/reservation.entity';

@JsonController('/internal/v1')
export class InternalController {
    private reservationRepo = dataSource.getRepository(Reservation);

    @Get('/users/:userId/reservations')
    async getUserReservations(@Param('userId') userId: number) {
        const reservations = await this.reservationRepo.find({
            where: { userId }
        });

        return {
            userId,
            reservations
        };
    }

    @Get('/tables/:tableId/reservations')
    async getTableReservations(@Param('tableId') tableId: number) {
        const reservations = await this.reservationRepo.find({
            where: { tableId }
        });

        return {
            tableId,
            reservations
        };
    }
}