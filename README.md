## Requirements

- Node.js (v12+ recommended)
- npm

## Install

Open a PowerShell terminal in the project folder (where `package.json` and `server.js` live) and run:

```powershell
npm install
```

## Run the server

Start the server with:

```powershell
# start the server
node server.js

# Or, if you have nodemon installed globally
nodemon server.js
```

The server listens on port 3000 by default. Visit http://localhost:3000 to see the root route message.

Important: this API uses a simple API key header for authentication. Include the header on every request:

Header: `x-api-key: 12345`

Requests missing this header (or using a different value) will receive a 401 Unauthorized response.

## API Reference

Base URL: `http://localhost:3000/api/products`

All endpoints require the `x-api-key` header.

- GET `/api/products`
   - Description: Get a paginated list of products. Supports optional `category`, `page`, and `limit` query parameters.
   - Query params:
      - `category` (optional) — filter by product category (case-insensitive)
      - `page` (optional, default `1`) — page number for pagination
      - `limit` (optional, default `5`) — number of items per page
   - Response (200):
      ```json
      {
         "page": 1,
         "limit": 5,
         "total": 3,
         "products": [ /* array of product objects */ ]
      }
      ```

- GET `/api/products/:id`
   - Description: Get a single product by its `id`.
   - Response (200): product object
   - Response (404): `{ "message": "Product not found" }`

- POST `/api/products`
   - Description: Create a new product.
   - Body (JSON):
      ```json
      {
         "name": "string",
         "description": "string",
         "price": 0,
         "category": "string",
         "inStock": true
      }
      ```
   - Response (201): newly created product (includes generated `id`)

- PUT `/api/products/:id`
   - Description: Replace an existing product (all fields required in the request body).
   - Body (JSON): same shape as POST body, except `id` is taken from the URL.
   - Response (200): updated product
   - Response (404): `{ "message": "Product not found" }`

- DELETE `/api/products/:id`
   - Description: Delete a product by id.
   - Response (204): no content
   - Response (404): `{ "message": "Product not found" }`

- GET `/api/products/search/:name`
   - Description: Search products by name (case-insensitive, partial matches).
   - Response (200): array of matching products

- GET `/api/products/stats`
   - Description: Basic statistics about the products collection.
   - Response (200):
      ```json
      {
         "totalProducts": 3,
         "categories": ["electronics","kitchen"],
         "inStockCount": 2
      }
      ```

## Example requests (PowerShell / curl)

Note: include the `x-api-key: 12345` header on each request.

- List products (first page):

```powershell
curl -H "Content-Type: application/json" -H "x-api-key: 12345" http://localhost:3000/api/products
```

- Filter by category `electronics`:

```powershell
curl -H "Content-Type: application/json" -H "x-api-key: 12345" "http://localhost:3000/api/products?category=electronics"
```

- Get product by id:

```powershell
curl -H "Content-Type: application/json" -H "x-api-key: 12345" http://localhost:3000/api/products/1
```

- Create a product:

```powershell
curl -X POST -H "Content-Type: application/json" -H "x-api-key: 12345" -d '{"name":"Blender","description":"High-speed blender","price":99,"category":"kitchen","inStock":true}' http://localhost:3000/api/products
```

- Update a product:

```powershell
curl -X PUT -H "Content-Type: application/json" -H "x-api-key: 12345" -d '{"name":"Updated","description":"Updated","price":10,"category":"misc","inStock":false}' http://localhost:3000/api/products/1
```

- Delete a product:

```powershell
curl -X DELETE -H "x-api-key: 12345" http://localhost:3000/api/products/1
```

- Search products by name `phone`:

```powershell
curl -H "Content-Type: application/json" -H "x-api-key: 12345" http://localhost:3000/api/products/search/phone
```

- Get stats:

```powershell
curl -H "Content-Type: application/json" -H "x-api-key: 12345" http://localhost:3000/api/products/stats
```

## Sample product object

```json
{
   "id": "1",
   "name": "Laptop",
   "description": "High-performance laptop with 16GB RAM",
   "price": 1200,
   "category": "electronics",
   "inStock": true
}
```

## Notes

- This project uses an in-memory array for products (`server.js`). Data will reset when the server restarts.
- The authentication is a simple API key header for assignment/demo purposes only. Do not use this approach in production.

## Next steps / improvements (optional)

- Persist products to a database (MongoDB).
- Add input validation and better error messages.
- Implement partial updates (PATCH) and more robust filtering/sorting.

---

Created for Week 2 MERN Stack assignment. See `server.js` for implementation details.