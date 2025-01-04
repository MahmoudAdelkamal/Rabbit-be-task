import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "./product.service";
import { PrismaService } from "../prisma/prisma.service";
import { Redis } from "ioredis";
import { ProductRepository } from "./product.repository";
import { GetAllProductsDTO } from "./dto/get-all-products.dto";
import { ProductDTO } from "./dto/product.dto";
import { TopProductsDto } from "./dto/get-top-products.dto";
import { PaginatedResponse } from "./types/paginated-response.type";

// Mock PrismaService, Redis, and ProductRepository
const mockPrismaService = {
  product: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  $queryRawUnsafe: jest.fn(),
  $transaction: jest.fn(),
};

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
};

const mockProductRepository = {
  findById: jest.fn(),
};

describe("ProductService", () => {
  let service: ProductService;
  let prismaService: PrismaService;
  let redis: Redis;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
        {
          provide: "REDIS_CLIENT",
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    redis = module.get<Redis>("REDIS_CLIENT");
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return paginated products with filters", async () => {
      const filters: GetAllProductsDTO = {
        categories: ["electronics"],
        name: "laptop",
        area: "New York",
        page: 1,
        page_size: 10,
      };

      const mockProducts: ProductDTO[] = [
        {
          id: 1,
          name: "Laptop",
          category: "electronics",
          area: "New York",
          createdAt: new Date(),
        },
      ];

      const mockTotal = 1;

      mockPrismaService.$transaction.mockResolvedValue([
        mockTotal,
        mockProducts,
      ]);

      const result = await service.getAllProducts(filters);

      expect(result).toEqual({
        data: mockProducts,
        page: 1,
        page_size: 10,
        total: mockTotal,
      });

      expect(mockPrismaService.product.count).toHaveBeenCalledWith({
        where: {
          category: { in: filters.categories },
          name: { contains: filters.name, mode: "insensitive" },
          area: filters.area,
        },
      });
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          category: { in: filters.categories },
          name: { contains: filters.name, mode: "insensitive" },
          area: filters.area,
        },
        skip: 0,
        take: 10,
      });
    });

    it("should handle errors when fetching products", async () => {
      const filters: GetAllProductsDTO = {
        page: 1,
        page_size: 10,
      };

      mockPrismaService.$transaction.mockRejectedValue(
        new Error("Database error")
      );

      await expect(service.getAllProducts(filters)).rejects.toThrowError(
        "Failed to fetch products"
      );
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const mockProduct: ProductDTO = {
        id: 1,
        name: "Laptop",
        category: "electronics",
        area: "New York",
        createdAt: new Date(),
      };

      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.getProductById(1);

      expect(result).toEqual(mockProduct);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
    });

    it("should handle errors when fetching a product by ID", async () => {
      mockProductRepository.findById.mockRejectedValue(
        new Error("Product not found")
      );

      await expect(service.getProductById(1)).rejects.toThrowError(
        "Product not found"
      );
    });
  });

  describe("getTopOrderedProducts", () => {
    const mockArea = "Nasr city";
    const mockTopProducts: TopProductsDto[] = [
      {
        id: 1,
        name: "Product 1",
        category: "Category 1",
        area: "Nasr city",
        total_quantity: 100,
      },
      {
        id: 2,
        name: "Product 2",
        category: "Category 1",
        area: "Nasr city",
        total_quantity: 80,
      },
    ];

    mockRedis.get.mockResolvedValue(JSON.stringify(mockTopProducts));
    it("should return cached products if available", async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(mockTopProducts));

      const result = await service.getTopOrderedProducts(mockArea);

      expect(result).toEqual(mockTopProducts);
    });

    it("should fetch from database and cache if no cached data is found", async () => {
      mockRedis.get.mockResolvedValue(null);

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockTopProducts);

      const result = await service.getTopOrderedProducts(mockArea);
      console.log(`Result is: ${JSON.stringify(result)}`);

      expect(result).toEqual(mockTopProducts);
    });
  });

  afterAll(() => {
    if (redis.quit) {
      redis.quit();
    }
  });
});
