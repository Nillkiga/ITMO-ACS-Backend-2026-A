const openApiSpecRestaurant = {
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
        '/restaurants': {
            get: {
                summary: 'Get restaurants list',
                parameters: [
                    { name: 'city', in: 'query', schema: { type: 'string' } },
                    { name: 'district', in: 'query', schema: { type: 'string' } },
                    { name: 'cuisineType', in: 'query', schema: { type: 'string' } },
                    { name: 'priceCategory', in: 'query', schema: { type: 'string' } },
                    {
                        name: 'sort',
                        in: 'query',
                        schema: {
                            type: 'string',
                            enum: ['price_asc', 'price_desc'],
                        },
                    },
                ],
                responses: {
                    '200': { description: 'Restaurants list' },
                },
            },
            post: {
                summary: 'Create restaurant',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Bella Roma' },
                                    description: { type: 'string', example: 'Italian restaurant' },
                                    address: { type: 'string', example: 'Lenina 10' },
                                    city: { type: 'string', example: 'Moscow' },
                                    district: { type: 'string', example: 'Central' },
                                    cuisineType: { type: 'string', example: 'Italian' },
                                    priceCategory: { type: 'string', example: 'medium' },
                                    phone: { type: 'string', example: '+79991234567' },
                                    openingTime: { type: 'string', example: '10:00' },
                                    closingTime: { type: 'string', example: '23:00' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Restaurant created' },
                },
            },
        },

        '/restaurants/{id}': {
            get: {
                summary: 'Get restaurant by id',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    '200': { description: 'Restaurant' },
                },
            },
        },

        '/restaurants/{restaurantId}/tables': {
            get: {
                summary: 'Get restaurant tables',
                parameters: [
                    {
                        name: 'restaurantId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    '200': { description: 'Tables list' },
                },
            },
            post: {
                summary: 'Create table for restaurant',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'restaurantId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    tableNumber: { type: 'string', example: 'A1' },
                                    capacity: { type: 'integer', example: 4 },
                                    locationDescription: { type: 'string', example: 'Near window' },
                                    status: { type: 'string', example: 'active' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Table created' },
                },
            },
        },

        '/restaurants/{restaurantId}/menu': {
            get: {
                summary: 'Get restaurant menu',
                parameters: [
                    {
                        name: 'restaurantId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    '200': { description: 'Menu list' },
                },
            },
            post: {
                summary: 'Create menu item',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'restaurantId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Pasta Carbonara' },
                                    description: {
                                        type: 'string',
                                        example: 'Pasta with bacon and creamy sauce',
                                    },
                                    price: { type: 'number', example: 450 },
                                    category: { type: 'string', example: 'Main course' },
                                    isAvailable: { type: 'boolean', example: true },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Menu item created' },
                },
            },
        },

        '/restaurants/{restaurantId}/photos': {
            get: {
                summary: 'Get restaurant photos',
                parameters: [
                    {
                        name: 'restaurantId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    '200': { description: 'Photos list' },
                },
            },
            post: {
                summary: 'Create restaurant photo',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'restaurantId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    photoUrl: {
                                        type: 'string',
                                        example: 'https://example.com/hall.jpg',
                                    },
                                    caption: { type: 'string', example: 'Main hall' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Photo created' },
                },
            },
        },

        '/restaurants/{restaurantId}/reviews': {
            get: {
                summary: 'Get restaurant reviews',
                parameters: [
                    {
                        name: 'restaurantId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    '200': { description: 'Reviews list' },
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

export default openApiSpecRestaurant;
