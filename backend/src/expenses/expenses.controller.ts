// src/expenses/expenses.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Request() req, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(req.user.userId, createExpenseDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expensesService.findAll(req.user.userId, {
      startDate,
      endDate,
    });
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(req.user.userId, id, updateExpenseDto);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return this.expensesService.delete(req.user.userId, id);
  }

  @Get('summary/by-month')
  getSummaryByMonth(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expensesService.getSummaryByMonth(req.user.userId, {
      startDate,
      endDate,
    });
  }

  @Get('summary/by-category')
  getSummaryByCategory(
    @Request() req: { user: { userId: string } },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expensesService.getSummaryByCategory(req.user.userId, {
      startDate,
      endDate,
    });
  }

  @Get('export/csv')
  exportToCsv(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expensesService.exportToCsv(req.user.userId, {
      startDate,
      endDate,
    });
  }
}
