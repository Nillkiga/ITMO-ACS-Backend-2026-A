import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import openApiSpecRestaurant from './openapi';

export function useSwagger(app: Express): Express {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecRestaurant));
    return app;
}