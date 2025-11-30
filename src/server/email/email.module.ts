import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
    providers: [EmailService],
    exports: [EmailService], // Export agar bisa digunakan di module lain
})
export class EmailModule { }
