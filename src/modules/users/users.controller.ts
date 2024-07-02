import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './../../shared/jwt/jwt-auth.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): object {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() userData: any): Promise<any> {
    return this.usersService.create(userData);
  }

  @Post('/login')
  async findOne(
    @Body() userData: { user: string; password: string },
  ): Promise<any> {
    return this.usersService.findOne(userData.user, userData.password);
  }
}
