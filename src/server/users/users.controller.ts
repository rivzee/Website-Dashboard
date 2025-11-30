import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: any) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error: any) {
      if (error.message.includes('Email sudah terdaftar')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException('Gagal mendaftar: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: { fullName?: string; email?: string; role?: string; phone?: string; password?: string },
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
