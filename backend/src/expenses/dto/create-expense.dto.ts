// src/expenses/dto/create-expense.dto.ts
import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  amount: number;

  @IsString()
  categoryId: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;
}
