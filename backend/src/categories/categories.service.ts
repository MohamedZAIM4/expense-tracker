// src/categories/categories.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        userId,
        color: dto.color,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.category.findMany({ where: { userId } });
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category || category.userId !== userId)
      throw new NotFoundException('Category not found');
    return this.prisma.category.update({
      where: { id },
      data: { name: dto.name, color: dto.color },
    });
  }

  async delete(userId: string, id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category || category.userId !== userId)
      throw new NotFoundException('Category not found');
    try {
      return await this.prisma.category.delete({ where: { id } });
    } catch (error: unknown) {
      const err = error as Prisma.PrismaClientKnownRequestError;
      if (err.code === 'P2003' || err.message?.includes('Foreign key')) {
        throw new BadRequestException(
          'Impossible de supprimer une catégorie qui contient des dépenses.',
        );
      }
      throw error;
    }
  }

  async cascadeDelete(userId: string, id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category || category.userId !== userId)
      throw new NotFoundException('Category not found');
    // Supprimer toutes les dépenses liées à cette catégorie
    await this.prisma.expense.deleteMany({ where: { categoryId: id, userId } });
    // Supprimer la catégorie
    return this.prisma.category.delete({ where: { id } });
  }
}
