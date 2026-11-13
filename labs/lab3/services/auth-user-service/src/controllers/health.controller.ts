import { Get, JsonController } from 'routing-controllers';

@JsonController()
export class HealthController {
    @Get('/health')
    health() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
}
