import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { useExpressServer } from 'routing-controllers';
import { dataSource } from './config/data-source';
import { ReviewController } from './controllers/review.controller';
import { InternalController } from './controllers/internal.controller';
import settings from './config/settings';
import { useSwagger } from './swagger';
import { getRabbitChannel } from './rabbitmq';

const app = express();
app.use(cors());
app.use(express.json());

const server = useExpressServer(app, {
    controllers: [ReviewController, InternalController],
    validation: true,
    classTransformer: true,
    defaultErrorHandler: true,
});

useSwagger(server);

async function startup() {
    await dataSource.initialize();
    console.log('Review DB connected');
    
    await getRabbitChannel();
    console.log('RabbitMQ connected');
    
    server.listen(settings.APP_PORT, () => {
        console.log(`Review service running on http://localhost:${settings.APP_PORT}/api`);
    });
}

startup().catch((err) => {
    console.error('Startup error:', err);
});