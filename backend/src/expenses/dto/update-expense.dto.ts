// src/expenses/dto/update-expense.dto.ts
import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateExpenseDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
