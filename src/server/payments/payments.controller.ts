import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    async create(@Body() createPaymentDto: {
        amount: number;
        paymentMethod: string;
        proofUrl?: string;
        orderId: string;
    }) {
        return this.paymentsService.create(createPaymentDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePaymentDto: { status?: string; paidAt?: string },
    ) {
        const data: { status?: string; paidAt?: Date } = {};
        if (updatePaymentDto.status) data.status = updatePaymentDto.status;
        if (updatePaymentDto.paidAt) data.paidAt = new Date(updatePaymentDto.paidAt);

        return this.paymentsService.update(id, data);
    }

    @Get('order/:orderId')
    async findByOrder(@Param('orderId') orderId: string) {
        return this.paymentsService.findByOrder(orderId);
    }

    @Get()
    async findAll() {
        return this.paymentsService.findAll();
    }
}
