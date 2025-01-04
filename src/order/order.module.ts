import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { RedisProvider } from "src/Redis/redis-provider";
import { PrismaService } from "@/prisma/prisma.service";

@Module({
  controllers: [OrderController],
  providers: [PrismaService, OrderService, OrderRepository, RedisProvider],
})
export class OrderModule {}
