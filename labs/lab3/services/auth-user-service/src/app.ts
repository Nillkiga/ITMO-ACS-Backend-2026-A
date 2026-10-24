import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { useExpressServer } from 'routing-controllers';
import { dataSource } from './config/data-source';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { InternalController } from './controllers/internal.controller';
import settings from './config/settings';
import { useSwagger } from './swagger';

const app = express();
app.use(cors());
app.use(express.json());

const server = useExpressServer(app, {
    controllers: [AuthController, UserController, InternalController],
    validation: true,
    classTransformer: true,
    defaultErrorHandler: true,
});

useSwagger(server);

dataSource.initialize()
    .then(() => {
        console.log('AuthUser DB connected');
        server.listen(settings.APP_PORT, () => {
            console.log(`AuthUser service running on http://localhost:${settings.APP_PORT}/api`);
        });
    })
    .catch((err: unknown) => {
        console.error('DB connection error:', err);
    });