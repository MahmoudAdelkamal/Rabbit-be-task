import { Injectable } from "@nestjs/common";
import { Product } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // async create(data: { name: string; category: string }): Promise<Product> {
  //   return this.prisma.product.create({ data });
  //}
}
