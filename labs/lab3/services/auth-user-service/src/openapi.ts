const openApiSpecAuthUser = {
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
        '/auth/login': {
            post: {
                summary: 'Login user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'ivan@example.com' },
                                    password: { type: 'string', example: '123456' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Returns access token' },
                },
            },
        },

        '/users': {
            get: {
                summary: 'Get users list',
                responses: {
                    '200': { description: 'Users list' },
                },
            },
            post: {
                summary: 'Create user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    fullName: { type: 'string', example: 'Ivan Ivanov' },
                                    email: { type: 'string', example: 'ivan@example.com' },
                                    password: { type: 'string', example: '123456' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'User created' },
                },
            },
        },

        '/users/me': {
            get: {
                summary: 'Get current user profile',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Current user profile' },
                    '403': { description: 'Forbidden' },
                },
            },
        }
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

export default openApiSpecAuthUser;
