import { env } from 'process';
import dotenv from 'dotenv';

dotenv.config();

class Settings {
    APP_PORT: number = parseInt(env.PORT || '8001');
    
    DB_HOST: string = env.DB_HOST || 'localhost';
    DB_PORT: number = parseInt(env.DB_PORT || '5432');
    DB_USER: string = env.DB_USER || 'auth_user';
    DB_PASSWORD: string = env.DB_PASSWORD || 'auth_password';
    DB_NAME: string = env.DB_NAME || 'auth_user_db';
    
    JWT_SECRET_KEY: string = env.JWT_SECRET_KEY || 'secret';
    JWT_ACCESS_TOKEN_LIFETIME: number = parseInt(env.JWT_ACCESS_TOKEN_LIFETIME || '3600');
}

export default new Settings();