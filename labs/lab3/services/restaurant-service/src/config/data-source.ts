import { DataSource } from 'typeorm';
import { Restaurant } from '../models/restaurant.entity';
import { Table } from '../models/table.entity';
import { MenuItem } from '../models/menu-item.entity';
import { RestaurantPhoto } from '../models/restaurant-photo.entity';
import settings from './settings';

export const dataSource = new DataSource({
    type: 'postgres',
    host: settings.DB_HOST,
    port: settings.DB_PORT,
    username: settings.DB_USER,
    password: settings.DB_PASSWORD,
    database: settings.DB_NAME,
    entities: [Restaurant, Table, MenuItem, RestaurantPhoto],
    synchronize: true,
    logging: true,
});