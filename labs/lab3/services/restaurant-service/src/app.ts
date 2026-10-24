import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { useExpressServer } from 'routing-controllers';
import { dataSource } from './config/data-source';
import { RestaurantController } from './controllers/restaurant.controller';
import { InternalController } from './controllers/internal.controller';
import settings from './config/settings';
import { useSwagger } from './swagger';
import { subscribeToEvents } from './rabbitmq';
import { Table } from './models/table.entity';

const app = express();
app.use(cors());
app.use(express.json());

const server = useExpressServer(app, {
    controllers: [RestaurantController, InternalController],
    validation: true,
    classTransformer: true,
    defaultErrorHandler: true,
});

useSwagger(server);

async function handleEvent(event: string, data: any) {
    const tableRepo = dataSource.getRepository(Table);
    
    switch (event) {
        case 'review.created':
            console.log(`Updating rating for restaurant ${data.restaurantId}: ${data.newRating}`);
            // TODO: добавить поле rating в таблицу restaurant и обновить
            break;
            
        case 'reservation.created':
            console.log(`Table ${data.tableId} reserved for ${data.reservationDate} ${data.startTime}-${data.endTime}`);
            // TODO: добавить логику блокировки столика в БД
            break;
            
        case 'reservation.cancelled':
            console.log(`Table ${data.tableId} released for ${data.reservationDate} ${data.startTime}-${data.endTime}`);
            // TODO: добавить логику освобождения столика в БД
            break;
            
        default:
            console.log(`Unknown event: ${event}`);
    }
}

async function startup() {
    await dataSource.initialize();
    console.log('Restaurant DB connected');
    
    await subscribeToEvents(handleEvent);
    console.log('RabbitMQ connected and subscribed to events');
    
    server.listen(settings.APP_PORT, () => {
        console.log(`Restaurant service running on http://localhost:${settings.APP_PORT}/api`);
    });
}

startup().catch((err) => {
    console.error('Startup error:', err);
});