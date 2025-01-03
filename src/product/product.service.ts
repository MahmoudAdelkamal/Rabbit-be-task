import { Inject, Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { CreateProductDto } from "./dto/create-product.dto";
import { PrismaService } from "prisma/prisma.service";
import { GetAllProductsDTO } from "./dto/get-all-products.dto";
import { ProductDTO } from "./dto/product.dto";
import { TopProductsDto } from "./dto/get-top-products.dto";
import Redis from "ioredis";
import { REDIS_CLIENT } from "src/Redis/redis-provider";

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    private prismaService: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {
    this.redis = new Redis({
      host: "localhost",
      port: 6379,
    });
  }

  async getAllProducts(filters: GetAllProductsDTO): Promise<ProductDTO[]> {
    if (filters.categories && filters.categories.length) {
      const products = [];
      for (let i = 0; i < filters.categories.length; i++) {
        products.push(
          await this.prismaService.product.findFirst({
            where: { category: filters.categories[i] },
          })
        );
      }
    }
    return this.prismaService.product.findMany();
  }

  async getProductById(id: number): Promise<ProductDTO> {
    return this.productsRepository.findById(id);
  }

  async getTopOrderedProducts(area: string): Promise<TopProductsDto[]> {
    const cacheKey = `top_products:${area}`;

    const cachedResult = await this.redis.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const query = `
      SELECT
        p.id,
        p.name,
        p.category,
        p.area,
        SUM(oi.quantity) ::NUMERIC AS total_quantity
      FROM
        "Product" p
      JOIN
        "OrderItem" oi ON p.id = oi."productId"
      WHERE
        p.area = $1
      GROUP BY
        p.id
      ORDER BY
        total_quantity DESC
      LIMIT 10;
    `;

    const products = await this.prismaService.$queryRawUnsafe<TopProductsDto[]>(
      query,
      area
    );

    await this.redis.set(cacheKey, JSON.stringify(products), "EX", 3600);

    return products;
  }
}
