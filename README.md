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

By implementing these optimizations, the API now supports better performance, handles larger datasets efficiently, and improves the overall user experience.

