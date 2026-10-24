import { Get, Post, Param, Body, Req, JsonController, UseBefore } from 'routing-controllers';
import { dataSource } from '../config/data-source';
import { Restaurant } from '../models/restaurant.entity';
import { Table } from '../models/table.entity';
import { MenuItem } from '../models/menu-item.entity';
import { RestaurantPhoto } from '../models/restaurant-photo.entity';
import { internalAuthMiddleware } from '../middlewares/internal-auth.middleware';

@JsonController('/api/restaurants')
export class RestaurantController {
    private restaurantRepo = dataSource.getRepository(Restaurant);
    private tableRepo = dataSource.getRepository(Table);
    private menuRepo = dataSource.getRepository(MenuItem);
    private photoRepo = dataSource.getRepository(RestaurantPhoto);

    @Get('/')
    async getAll(@Req() req: any) {
        const { city, district, cuisineType, priceCategory, sort } = req.query;
        const qb = this.restaurantRepo.createQueryBuilder('restaurant');

        if (city) {
            qb.andWhere('restaurant.city ILIKE :city', { city: `%${city}%` });
        }
        if (district) {
            qb.andWhere('restaurant.district ILIKE :district', { district: `%${district}%` });
        }
        if (cuisineType) {
            qb.andWhere('restaurant.cuisineType ILIKE :cuisineType', { cuisineType: `%${cuisineType}%` });
        }
        if (priceCategory) {
            qb.andWhere('restaurant.priceCategory = :priceCategory', { priceCategory });
        }
        if (sort === 'price_asc') {
            qb.orderBy(
                `CASE 
                    WHEN restaurant.priceCategory = 'low' THEN 1 
                    WHEN restaurant.priceCategory = 'medium' THEN 2 
                    WHEN restaurant.priceCategory = 'high' THEN 3 
                END`,
                'ASC'
            );
        }
        if (sort === 'price_desc') {
            qb.orderBy(
                `CASE 
                    WHEN restaurant.priceCategory = 'low' THEN 1 
                    WHEN restaurant.priceCategory = 'medium' THEN 2 
                    WHEN restaurant.priceCategory = 'high' THEN 3 
                END`,
                'DESC'
            );
        }

        return await qb.getMany();
    }

    @Get('/:id')
    async getById(@Param('id') id: number) {
        return await this.restaurantRepo.findOneBy({ id });
    }

    @Post('/')
    @UseBefore(internalAuthMiddleware)
    async create(@Body() restaurantData: Restaurant) {
        const created = this.restaurantRepo.create(restaurantData);
        return await this.restaurantRepo.save(created);
    }

    @Get('/:restaurantId/tables')
    async getTables(@Param('restaurantId') restaurantId: number) {
        return await this.tableRepo.findBy({ restaurantId });
    }

    @Post('/:restaurantId/tables')
    @UseBefore(internalAuthMiddleware)
    async createTable(
        @Param('restaurantId') restaurantId: number,
        @Body() tableData: Partial<Table>
    ) {
        const table = this.tableRepo.create({ ...tableData, restaurantId });
        return await this.tableRepo.save(table);
    }

    @Get('/:restaurantId/menu')
    async getMenu(@Param('restaurantId') restaurantId: number) {
        return await this.menuRepo.findBy({ restaurantId });
    }

    @Post('/:restaurantId/menu')
    @UseBefore(internalAuthMiddleware)
    async createMenuItem(
        @Param('restaurantId') restaurantId: number,
        @Body() menuData: Partial<MenuItem>
    ) {
        const item = this.menuRepo.create({ ...menuData, restaurantId });
        return await this.menuRepo.save(item);
    }

    @Get('/:restaurantId/photos')
    async getPhotos(@Param('restaurantId') restaurantId: number) {
        return await this.photoRepo.findBy({ restaurantId });
    }

    @Post('/:restaurantId/photos')
    @UseBefore(internalAuthMiddleware)
    async createPhoto(
        @Param('restaurantId') restaurantId: number,
        @Body() photoData: Partial<RestaurantPhoto>
    ) {
        const photo = this.photoRepo.create({ ...photoData, restaurantId });
        return await this.photoRepo.save(photo);
    }
}