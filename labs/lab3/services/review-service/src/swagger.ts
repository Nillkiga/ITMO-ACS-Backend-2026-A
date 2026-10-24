import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import openApiSpecReview from './openapi';

export function useSwagger(app: Express): Express {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecReview));
    console.log('Swagger available at http://127.0.0.1:8001/docs');
    return app;
}