import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';
import { OrdersService } from '../orders/orders.service';
import { PaymentsService } from '../payments/payments.service';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly usersService: UsersService,
        private readonly servicesService: ServicesService,
        private readonly ordersService: OrdersService,
        private readonly paymentsService: PaymentsService,
    ) { }

    @Get('sync')
    async getSyncData() {
        const [users, services, orders, payments] = await Promise.all([
            this.usersService.findAll(),
            this.servicesService.findAll(),
            this.ordersService.findAll(),
            this.paymentsService.findAll(),
        ]);
        return { users, services, orders, payments };
    }
}
