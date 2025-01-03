import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { PrismaService } from 'prisma/prisma.service';
import { REDIS_CLIENT, RedisProvider } from 'src/Redis/redis-provider';

@Module({
  controllers: [ProductController],
  providers: [PrismaService, ProductService, ProductRepository, RedisProvider],
  exports: [REDIS_CLIENT], //
})
export class ProductModule {}
