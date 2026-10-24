import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import openApiSpecAuthUser from './openapi';

export function useSwagger(app: Express): Express {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecAuthUser));
    return app;
}