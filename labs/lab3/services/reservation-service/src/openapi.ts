const openApiSpecReservation = {
    openapi: '3.0.3',
    info: {
        title: 'Restaurant Reservation API',
        version: '1.0.0',
    },
    servers: [
        {
            url: '/api',
        },
    ],
    paths: {
        '/reservations': {
            get: {
                summary: 'Get reservations',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Reservations list' },
                },
            },
            post: {
                summary: 'Create reservation',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    userId: { type: 'integer', example: 1 },
                                    tableId: { type: 'integer', example: 1 },
                                    reservationDate: {
                                        type: 'string',
                                        example: '2026-04-20',
                                    },
                                    startTime: { type: 'string', example: '18:00' },
                                    endTime: { type: 'string', example: '20:00' },
                                    guestsCount: { type: 'integer', example: 2 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Reservation created' },
                },
            },
        },

        '/reservations/{id}': {
            delete: {
                summary: 'Cancel reservation',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    '200': { description: 'Reservation cancelled' },
                },
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

export default openApiSpecReservation;
