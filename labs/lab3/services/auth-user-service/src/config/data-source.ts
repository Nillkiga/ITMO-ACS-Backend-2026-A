import { DataSource } from 'typeorm';
import { User } from '../models/user.entity';
import { UserSubscriber } from '../subscribers/user.subscriber';
import settings from './settings';

export const dataSource = new DataSource({
    type: 'postgres',
    host: settings.DB_HOST,
    port: settings.DB_PORT,
    username: settings.DB_USER,
    password: settings.DB_PASSWORD,
    database: settings.DB_NAME,
    entities: [User],
    subscribers: [UserSubscriber],
    synchronize: true,
    logging: true,
});