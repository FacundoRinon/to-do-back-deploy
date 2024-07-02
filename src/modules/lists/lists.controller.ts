import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ListsService } from './lists.service';

import { JwtAuthGuard } from './../../shared/jwt/jwt-auth.guard';

interface RequestBody {
  user_id: number;
}

@Controller('/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  findAll(): object {
    return this.listsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() listData: any): Promise<any> {
    return this.listsService.create(listData);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findListById(
    @Param('id') listId: string,
    @Query('user_id') userId: string,
  ) {
    return this.listsService.findListById(Number(listId), Number(userId));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteListById(@Param('id') id: number) {
    return this.listsService.deleteListById(Number(id));
  }
}
