// src/expenses/expenses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category || category.userId !== userId)
      throw new NotFoundException('Category not found');
    return this.prisma.expense.create({
      data: {
        amount: dto.amount,
        categoryId: dto.categoryId,
        userId,
        date: new Date(dto.date),
        description: dto.description,
      },
    });
  }

  async findAll(
    userId: string,
    filters: { startDate?: string; endDate?: string },
  ) {
    return this.prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: filters.startDate ? new Date(filters.startDate) : undefined,
          lte: filters.endDate ? new Date(filters.endDate) : undefined,
        },
      },
      include: { category: true },
    });
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense || expense.userId !== userId)
      throw new NotFoundException('Expense not found');
    return this.prisma.expense.update({
      where: { id },
      data: {
        amount: dto.amount,
        categoryId: dto.categoryId,
        date: dto.date ? new Date(dto.date) : undefined,
        description: dto.description,
      },
    });
  }

  async delete(userId: string, id: string) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense || expense.userId !== userId)
      throw new NotFoundException('Expense not found');
    return this.prisma.expense.delete({ where: { id } });
  }

  async getSummaryByMonth(
    userId: string,
    filters: { startDate?: string; endDate?: string },
  ) {
    const expenses = await this.findAll(userId, filters);
    const summary = expenses.reduce((acc, expense) => {
      const month = expense.date.toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});
    return Object.entries(summary).map(([month, total]) => ({ month, total }));
  }

  async getSummaryByCategory(
    userId: string,
    filters: { startDate?: string; endDate?: string },
  ) {
    const expenses = await this.findAll(userId, filters);
    const summary = expenses.reduce((acc, expense) => {
      const categoryName = expense.category.name;
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
      return acc;
    }, {});
    return Object.entries(summary).map(([categoryName, total]) => ({
      categoryName,
      total,
    }));
  }

  async exportToCsv(
    userId: string,
    filters: { startDate?: string; endDate?: string },
  ) {
    const expenses = await this.findAll(userId, filters);
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'amount', title: 'Amount' },
        { id: 'categoryName', title: 'Category' },
        { id: 'date', title: 'Date' },
        { id: 'description', title: 'Description' },
      ],
    });
    const records = expenses.map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      categoryName: expense.category.name,
      date: expense.date.toISOString(),
      description: expense.description || '',
    }));
    return (
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records)
    );
  }
}
