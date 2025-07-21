// src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ExpensesModule } from './expenses/expenses.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, CategoriesModule, ExpensesModule],
  providers: [PrismaService],
})
export class AppModule {}
