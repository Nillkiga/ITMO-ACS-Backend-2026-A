import { env } from 'process';
import dotenv from 'dotenv';

dotenv.config();

class Settings {
    APP_PORT: number = parseInt(env.PORT || '8002');
    
    DB_HOST: string = env.DB_HOST || 'localhost';
    DB_PORT: number = parseInt(env.DB_PORT || '5434');
    DB_USER: string = env.DB_USER || 'restaurant_user';
    DB_PASSWORD: string = env.DB_PASSWORD || 'restaurant_password';
    DB_NAME: string = env.DB_NAME || 'restaurant_db';
    
    INTERNAL_TOKEN: string = env.INTERNAL_TOKEN || 'shared-internal-secret-token';
}

export default new Settings();