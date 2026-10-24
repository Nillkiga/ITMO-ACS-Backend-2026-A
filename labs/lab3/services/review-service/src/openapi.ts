const openApiSpecReview = {
    openapi: '3.0.3',
    info: {
        title: 'Review Service API',
        version: '1.0.0',
    },
    servers: [{ url: '/api' }],
    paths: {
        '/reviews': {
            post: {
                summary: 'Create review',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    userId: { type: 'integer', example: 1 },
                                    restaurantId: { type: 'integer', example: 1 },
                                    rating: { type: 'integer', example: 5 },
                                    comment: { type: 'string', example: 'Great place!' },
                                },
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Review created' } },
            },
        },
        '/reviews/restaurant/{restaurantId}': {
            get: {
                summary: 'Get reviews by restaurant',
                parameters: [
                    {
                        name: 'restaurantId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                responses: { '200': { description: 'Reviews list' } },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

export default openApiSpecReview;