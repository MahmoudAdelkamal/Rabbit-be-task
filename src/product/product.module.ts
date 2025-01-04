import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PrismaService } from "../prisma/prisma.service";
import { REDIS_CLIENT, RedisProvider } from "../Redis/redis-provider";
import { ProductRepository } from "./product.repository";

@Module({
  controllers: [ProductController],
  providers: [PrismaService, ProductService, RedisProvider, ProductRepository],
  exports: [REDIS_CLIENT],
})
export class ProductModule {}
