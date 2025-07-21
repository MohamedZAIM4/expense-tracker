// src/categories/categories.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Request() req: ExpressRequest & { user: { userId: string } },
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(req.user.userId, createCategoryDto);
  }

  @Get()
  findAll(@Request() req: ExpressRequest & { user: { userId: string } }) {
    return this.categoriesService.findAll(req.user.userId);
  }

  @Put(':id')
  update(
    @Request() req: ExpressRequest & { user: { userId: string } },
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(
      req.user.userId,
      id,
      updateCategoryDto,
    );
  }

  @Delete(':id')
  delete(
    @Request() req: ExpressRequest & { user: { userId: string } },
    @Param('id') id: string,
  ) {
    return this.categoriesService.delete(req.user.userId, id);
  }

  @Delete(':id/cascade')
  async cascadeDelete(
    @Request() req: ExpressRequest & { user: { userId: string } },
    @Param('id') id: string,
  ) {
    return this.categoriesService.cascadeDelete(req.user.userId, id);
  }
}
