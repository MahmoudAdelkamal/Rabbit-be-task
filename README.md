# Rabbit-be-task

This document describes the development and optimization of Rabbit orders APIs as per the requirements provided.

## Table of Contents

- [Top 10 Most Frequently Ordered Products API](#top-10-most-frequently-ordered-products-api)
- [Optimizing the Existing Products Listing API](#optimizing-the-existing-products-listing-api)
- [Technical Details](#technical-details)
- [Performance Optimization Techniques](#performance-optimization-techniques)
- [Setup and Usage](#setup-and-usage)

---

## Top 10 Most Frequently Ordered Products API

### Overview
This API provides the top 10 most frequently ordered products for a specific area. It is designed to handle high traffic efficiently and integrate seamlessly with a mobile application's homepage.

### Endpoint
- **GET `/top-products/:area`**

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
