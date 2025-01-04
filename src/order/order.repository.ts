import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}
}
