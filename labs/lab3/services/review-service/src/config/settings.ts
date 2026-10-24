import { env } from 'process';
import dotenv from 'dotenv';

dotenv.config();

class Settings {
    APP_PORT: number = parseInt(env.PORT || '8004');
    
    DB_HOST: string = env.DB_HOST || 'localhost';
    DB_PORT: number = parseInt(env.DB_PORT || '5436');
    DB_USER: string = env.DB_USER || 'review_user';
    DB_PASSWORD: string = env.DB_PASSWORD || 'review_password';
    DB_NAME: string = env.DB_NAME || 'review_db';
    
    RESTAURANT_SERVICE_URL: string = env.RESTAURANT_SERVICE_URL || 'http://localhost:8002';
    INTERNAL_TOKEN: string = env.INTERNAL_TOKEN || 'shared-internal-secret-token';
}

export default new Settings();