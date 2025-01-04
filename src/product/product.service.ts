import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { REDIS_CLIENT } from "../Redis/redis-provider";
import { GetAllProductsDTO } from "./dto/get-all-products.dto";
import { ProductDTO } from "./dto/product.dto";
import { TopProductsDto } from "./dto/get-top-products.dto";
import Redis from "ioredis";
import { PaginatedResponse } from "./types/paginated-response.type";
import { ProductRepository } from "./product.repository";

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private readonly productsRepository: ProductRepository,

    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {
    this.redis = new Redis({
      host: "localhost",
      port: 6379,
    });
  }

  async getAllProducts(
    filters: GetAllProductsDTO
  ): Promise<PaginatedResponse<ProductDTO>> {
    const { categories, name, area, page = 1, page_size = 10 } = filters;

    const currentPage = Math.max(1, page);
    const currentPageSize = Math.min(100, Math.max(1, page_size));

    const where: any = {};
    if (categories && categories.length) {
      where.category = { in: categories };
    }
    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }
    if (area) {
      where.area = area;
    }

    try {
      const [total, products] = await this.prismaService.$transaction([
        this.prismaService.product.count({ where }),
        this.prismaService.product.findMany({
          where,
          skip: (currentPage - 1) * currentPageSize,
          take: currentPageSize,
        }),
      ]);

      return {
        data: products,
        page: currentPage,
        page_size: currentPageSize,
        total: total,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
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

    await this.redis.set(cacheKey, JSON.stringify(products), "EX", 7200);

    return products;
  }
}
