# Rabbit-be-task

This document describes the development and optimization of Rabbit orders APIs as per the requirements provided.

## Table of Contents

- [Top 10 Most Frequently Ordered Products API](#top-10-most-frequently-ordered-products-api)
- [Optimizing the Existing Products Listing API](#optimizing-the-existing-products-listing-api)
- [Technical Details](#technical-details)
- [Setup and Usage](#setup-and-usage)

---

## Top 10 Most Frequently Ordered Products API

### Overview
This API provides the top 10 most frequently ordered products for a specific area. It is designed to handle high traffic efficiently and integrate seamlessly with a mobile application's homepage.

### Endpoint
- **GET `/top-products/:area`**

### Caching Details

To improve the performance of the **Top 10 Most Frequently Ordered Products API**, especially under high traffic conditions, we have implemented caching mechanisms that reduce the need to repeatedly query the database for the same area. This helps in reducing database load and providing faster response times for frequently accessed data.

#### Caching Mechanism
- **Cache Layer**: Redis is used as the caching layer to store the results of the query for top 10 products for each area.
- **Cache Expiration**: The cached data is set to expire after a specific period (e.g., 10 minutes). This ensures that the API returns up-to-date data while reducing the number of database hits.
- **Cache Key**: The cache key is generated using the area passed in the request (e.g., `/top-products/Giza`). This ensures that the cached data is specific to each area.
  
#### Cache Flow
1. When the API is called, it first checks if the data for the specific area exists in the cache.
2. If the data is present in the cache, the API returns the cached data.
3. If the data is not found in the cache, the API queries the database for the top 10 products for the requested area.
4. The resulting data from the database is stored in the cache for subsequent requests and is returned to the user.
5. After the cache expiration time (e.g., 10 minutes), the data is automatically removed from the cache, and the next request will fetch fresh data from the database.

This caching approach significantly reduces response times and minimizes the load on the database for frequently accessed endpoints.

#### Request Example
```http
GET /top-products/Giza
```

#### Response Example

```json
{
  "data": [
    {
      "id": 1,
      "name": "Product 1",
      "category": "Category 1",
      "area": "Giza",
      "total_quantity": 150
    },
    {
      "id": 2,
      "name": "Product 2",
      "category": "Category 2",
      "area": "Giza",
      "total_quantity": 120
    },
    {
      "id": 3,
      "name": "Product 3",
      "category": "Category 1",
      "area": "Giza",
      "total_quantity": 110
    },
    {
      "id": 4,
      "name": "Product 4",
      "category": "Category 3",
      "area": "Giza",
      "total_quantity": 100
    },
    {
      "id": 5,
      "name": "Product 5",
      "category": "Category 2",
      "area": "Giza",
      "total_quantity": 95
    },
    {
      "id": 6,
      "name": "Product 6",
      "category": "Category 3",
      "area": "Giza",
      "total_quantity": 90
    },
    {
      "id": 7,
      "name": "Product 7",
      "category": "Category 1",
      "area": "Giza",
      "total_quantity": 85
    },
    {
      "id": 8,
      "name": "Product 8",
      "category": "Category 2",
      "area": "Giza",
      "total_quantity": 80
    },
    {
      "id": 9,
      "name": "Product 9",
      "category": "Category 3",
      "area": "Giza",
      "total_quantity": 75
    },
    {
      "id": 10,
      "name": "Product 10",
      "category": "Category 1",
      "area": "Giza",
      "total_quantity": 70
    }
  ]
}
```

## optimizing the Existing Products Listing API

### Overview
The existing `/products` API suffered from poor performance due to inefficient database queries and suboptimal code practices. In this section, we describe the optimization process where we refactored the API to improve its performance, scalability, and maintainability. The goal was to ensure the API can handle a large number of requests efficiently while providing accurate and timely product listings with improved filtering and pagination support.

### Process

The main areas of optimization were:
- **Reducing Database Queries:** The old logic involved querying the database for each category separately, which led to multiple database calls. This was replaced with a more efficient single query approach that could handle filtering by multiple categories.
- **Adding Pagination:** To avoid loading large datasets at once, pagination was added to allow clients to request a subset of results based on page and page size.
- **Combining Queries with Transactions:** Instead of issuing multiple queries separately, both the total count of products and the actual product list were fetched in a single transactional operation, reducing database round trips and improving performance.
- **Improved Filtering Logic:** The new logic introduced enhanced filtering by product name, area, and categories, ensuring that the user can request specific subsets of products more efficiently.

### Advantages of the New Logic

1. **Single Query for Categories:**
   - Instead of iterating over categories and making multiple `findFirst` calls, the new logic efficiently uses a single query with `where.category = { in: categories }`.

2. **Pagination Support:**
   - Introduced pagination with `skip` and `take`, allowing the API to return only the relevant subset of results for each request.
   - Prevents large payloads, ensuring faster responses and reduced client-side processing.

3. **Combined Queries with Transactions:**
   - Uses `Prisma.$transaction` to group the `count` and `findMany` queries, reducing database round-trips and improving atomicity.

4. **Comprehensive Filtering:**
   - Added support for filtering products by:
     - **Name**: Case-insensitive search using `contains`.
     - **Area**: Filtering products based on a specific region.

5. **Performance Optimization:**
   - Reduced the number of database queries and unnecessary data fetching, significantly lowering API latency.
   - Replaced sequential asynchronous operations with a single optimized query.

6. **Scalability:**
   - The new logic can handle high traffic efficiently, making it suitable for large-scale systems.

7. **Improved Maintainability:**
   - Cleaner and more modular code, making it easier to maintain, test, and extend in the future.

8. **Error Handling:**
   - Includes robust error handling, ensuring better visibility of issues and meaningful error messages.

9. **Page Size Limit:**
   - Ensures that a maximum of 100 items can be fetched per request, protecting the system from performance degradation due to large payloads.

10. **Flexible Response Structure:**
    - Returns paginated data along with metadata (`page`, `page_size`, and `total`), providing a structured and user-friendly response.

## Technical Details

This section provides a deep dive into the technical aspects of the Rabbit Orders APIs. We will cover the architecture, technology stack, database schema, and other important details that enable the smooth functioning of the APIs.

### Architecture

The Rabbit Orders API follows a modular architecture designed to separate concerns and allow easy scalability and maintainability. The system is composed of several key components:

1. **API Layer (Controller)**:
   - Handles incoming requests, performs validation, and forwards the necessary data to the service layer.
   - Returns appropriate responses back to the clients, following RESTful API principles.

2. **Service Layer**:
   - Contains the business logic of the application.
   - Coordinates actions across different entities, performs necessary data transformations, and calls the data layer (database) to fetch or modify data.
   
3. **Data Layer (Database)**:
   - The application uses **Prisma ORM** to interact with the database, ensuring efficient and type-safe database queries.
   - The database is optimized for fast retrieval and manipulation of product and order data.

4. **Database Schema**:
   - The schema consists of several entities such as `Product`, `Order`, `Category`, and `Area`, which are linked to one another.
   - Each product has attributes like `id`, `name`, `category`, `area`, and `total_quantity`, which are essential for listing and filtering products.

5. **Error Handling**:
   - A robust error-handling mechanism is implemented throughout the application. Errors are logged for analysis, and meaningful error messages are returned to clients for better user experience.
   - Common errors like database failures, validation errors, and missing parameters are properly caught and handled.

### Technology Stack

- **Backend Framework**: NestJS (Node.js framework)
  - It provides a robust and scalable platform for building APIs with TypeScript.
  
- **Database**: PostgreSQL
  - The database is designed to store product, order, and other necessary data efficiently.

- **ORM**: Prisma
  - Prisma is used to interact with the PostgreSQL database. It helps in generating the database schema, performing type-safe queries, and optimizing the queries.

- **Caching**:
  - Redis or in-memory caching could be added in the future to store frequently requested product data, reducing database load.

- **Error Logging**:
  - Errors are logged using tools like **Winston** or **Sentry**, which help track and resolve issues quickly.

- **Authentication**:
  - **JWT** (JSON Web Token) is used for secure authentication and authorization of users. This ensures that only authorized users can access certain resources.

- **API Documentation**:
  - The API is documented manually using markdown in Notion, and no Swagger integration is currently in place.

- **Testing**:
  - Unit tests and integration tests are written using **Jest** to ensure the correctness of the code.
  - End-to-end tests are performed to simulate real-world usage and verify the entire system works as expected.

### Database Schema

The primary entities for the Rabbit Orders API are as follows:

1. **Product**:
   - Stores product details such as `id`, `name`, `category`, `area`, and `total_quantity`.
   - Example Schema:
     ```prisma
     model Product {
       id            Int      @id @default(autoincrement())
       name          String
       category      String
       area          String
       total_quantity Int
       created_at    DateTime @default(now())
       updated_at    DateTime @updatedAt
     }
     ```

2. **Order**:
   - Tracks orders placed for products, including customer information, order details, and timestamps.
   - Example Schema:
     ```prisma
     model Order {
       id           Int      @id @default(autoincrement())
       product_id   Int
       quantity     Int
       customer_id  Int
       created_at   DateTime @default(now())
       status       String
       product      Product  @relation(fields: [product_id], references: [id])
     }
     ```

3. **Category**:
   - Stores product categories such as "Food", "Electronics", "Clothing", etc.
   - Example Schema:
     ```prisma
     model Category {
       id   Int      @id @default(autoincrement())
       name String
     }
     ```

4. **Area**:
   - Represents geographic areas where the products are available, such as "Cairo", "Giza", "Alexandria".
   - Example Schema:
     ```prisma
     model Area {
       id   Int      @id @default(autoincrement())
       name String
     }
     ```

### API Flow

The flow of data between the API layers is as follows:

1. The user makes a request to the API endpoint (e.g., `/top-products/:area`).
2. The controller receives the request and performs validation (e.g., checking for the correct area format).
3. The service layer processes the request, applies business logic, and prepares the necessary query.
4. The query is sent to the database through Prisma, which retrieves or updates data accordingly.
5. The results are returned to the controller, which sends the response back to the user.

### Performance Optimization

To ensure that the Rabbit Orders API is performant and can scale under heavy traffic, the following techniques are employed:

1. **Database Indexing**:
   - Important fields like `category`, `area`, and `product_id` are indexed to speed up queries.
   
2. **Caching**:
   - Future work could include integrating Redis or another caching solution to store frequently accessed data and reduce database load.
   
3. **Database Transactions**:
   - Grouping multiple database queries in a single transaction helps reduce latency and ensure atomic operations.

4. **Lazy Loading**:
   - Product listings are paginated to avoid returning too many results in a single response, thus optimizing response time and reducing server load.

---

This concludes the **Technical Details** section. The API is designed to be robust, scalable, and maintainable, ensuring that it can efficiently handle large-scale operations with minimal latency.


By implementing these optimizations, the API now supports better performance, handles larger datasets efficiently, and improves the overall user experience.

