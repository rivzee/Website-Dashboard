import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    async create(@Body() createDocumentDto: {
        fileName: string;
        fileUrl: string;
        fileType: string;
        isResult: boolean;
        orderId: string;
        uploaderId: string;
    }) {
        return this.documentsService.create(createDocumentDto);
    }

    @Get('order/:orderId')
    async findByOrder(@Param('orderId') orderId: string) {
        return this.documentsService.findByOrder(orderId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.documentsService.findOne(id);
    }
}
