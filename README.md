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
GET /top-products/Nasr%20city
