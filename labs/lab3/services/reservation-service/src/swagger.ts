import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import openApiSpecReservation from './openapi';

export function useSwagger(app: Express): Express {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecReservation));
    return app;
}