# QuickBite - Mini Food Delivery App

A B.Tech Full Stack lab project built with React, Vite, Node.js, Express.js, MongoDB, Mongoose and Axios.

## Features

- Menu browsing
- Search and category filter
- Shopping cart
- Quantity increase/decrease
- Checkout validation
- Server-side order total calculation
- Order history
- Order cancellation while Placed
- Admin menu CRUD
- Admin availability control
- Admin order status progression

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend:
http://localhost:5000

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:
http://localhost:5173

## MongoDB

Local MongoDB connection:

mongodb://127.0.0.1:27017/quickbite

Make sure MongoDB is running before starting the backend.

## API List

GET /api/items
GET /api/items?search=pizza
GET /api/items?category=Drinks

POST /api/items
PUT /api/items/:id
DELETE /api/items/:id

POST /api/orders
GET /api/orders
PATCH /api/orders/:id/status

## Sample Menu Item

```json
{
  "name": "Margherita Pizza",
  "price": 249,
  "category": "Main Course",
  "isAvailable": true
}
```

## Sample Order

```json
{
  "customerName": "Vansh Tomar",
  "phone": "9058698490",
  "address": "shamli, Uttar Pradesh",
  "items": [
    {
      "itemId": "MENU_ITEM_ID",
      "qty": 2
    }
  ]
}
```

## Order Status

Placed -> Preparing -> Out for Delivery -> Delivered

Cancellation is allowed only while the order is Placed.

## HTTP Status Codes

200 - Successful request
201 - Resource created
400 - Invalid request
404 - Resource not found
500 - Server error
