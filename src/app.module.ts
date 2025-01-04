import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "../prisma/prisma.service";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";
import { OrderService } from "./order/order.service";

@Module({
  imports: [ProductModule, OrderModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, OrderService],
  exports: [PrismaService],
})
export class AppModule {}
