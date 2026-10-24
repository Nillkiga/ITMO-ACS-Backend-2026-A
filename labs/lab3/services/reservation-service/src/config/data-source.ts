import { DataSource } from 'typeorm';
import { Reservation } from '../models/reservation.entity';
import settings from './settings';

export const dataSource = new DataSource({
    type: 'postgres',
    host: settings.DB_HOST,
    port: settings.DB_PORT,
    username: settings.DB_USER,
    password: settings.DB_PASSWORD,
    database: settings.DB_NAME,
    entities: [Reservation],
    synchronize: true,
    logging: true,
});