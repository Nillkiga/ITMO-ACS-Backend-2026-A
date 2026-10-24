import { DataSource } from 'typeorm';
import { Review } from '../models/review.entity';
import settings from './settings';

export const dataSource = new DataSource({
    type: 'postgres',
    host: settings.DB_HOST,
    port: settings.DB_PORT,
    username: settings.DB_USER,
    password: settings.DB_PASSWORD,
    database: settings.DB_NAME,
    entities: [Review],
    synchronize: true,
    logging: true,
});