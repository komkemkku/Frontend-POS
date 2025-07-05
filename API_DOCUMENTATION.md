# API Documentation

## Base URL
`https://backend-pos-production.up.railway.app`

## Authentication
- **Staff/Admin endpoints**: Require `Authorization: Bearer <token>` header
- **Public endpoints**: No authentication required

## Endpoints Overview

### Authentication
- `POST /staff/login` - Staff login

### Staff Management (Auth Required)
- `GET /staff/info` - Get current staff info
- `GET /staff` - List all staff
- `GET /staff/:id` - Get staff by ID
- `POST /staff/create` - Create new staff
- `PATCH /staff/:id` - Update staff
- `DELETE /staff/:id` - Delete staff

### Categories (Auth Required)
- `GET /categories` - List categories
- `GET /categories/:id` - Get category by ID
- `POST /categories/create` - Create category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Menu Items (Auth Required)
- `GET /menu-items` - List menu items
- `GET /menu-items/:id` - Get menu item by ID
- `POST /menu-items/create` - Create menu item
- `PATCH /menu-items/:id` - Update menu item
- `DELETE /menu-items/:id` - Delete menu item

### Orders (Auth Required)
- `GET /orders` - List orders
- `GET /orders/:id` - Get order by ID
- `POST /orders/create` - Create order
- `PATCH /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

### Order Items (Auth Required)
- `GET /order-items` - List order items
- `GET /order-items/:id` - Get order item by ID
- `POST /order-items/create` - Create order item
- `PATCH /order-items/:id` - Update order item
- `DELETE /order-items/:id` - Delete order item

### Payments (Auth Required)
- `GET /payments` - List payments
- `GET /payments/:id` - Get payment by ID
- `POST /payments/create` - Create payment
- `PATCH /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment

### Reservations (Auth Required)
- `GET /reservations` - List reservations
- `GET /reservations/:id` - Get reservation by ID
- `POST /reservations/create` - Create reservation
- `PATCH /reservations/:id` - Update reservation
- `DELETE /reservations/:id` - Delete reservation

### Tables (Auth Required)
- `GET /tables` - List tables
- `GET /tables/:id` - Get table by ID
- `POST /tables/create` - Create table
- `PATCH /tables/:id` - Update table
- `DELETE /tables/:id` - Delete table

### Expenses (Auth Required)
- `GET /expenses` - List expenses
- `GET /expenses/:id` - Get expense by ID
- `POST /expenses/create` - Create expense
- `PATCH /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

## Public Endpoints (Customer)

### Menu & QR Code
- `GET /public/menu/:qrCodeIdentifier` - Get menu by QR code
- `GET /public/menu` - Get all menu items (public)

### Orders (Customer)
- `POST /public/orders/create` - Create order (customer)
- `GET /public/orders/table/:qrCodeIdentifier` - Get unpaid orders by table
- `GET /public/orders/:orderID/table/:qrCodeIdentifier` - Get specific order status
- `GET /public/orders/history/:qrCodeIdentifier` - Get all order history
- `GET /public/table/summary/:qrCodeIdentifier` - Get table summary

## Staff Order Management (Auth Required)
- `POST /staff/orders/clear-table/:qrCodeIdentifier` - Clear table history
- `POST /staff/orders/advanced-clear/:qrCodeIdentifier` - Advanced clear table
- `POST /staff/orders/cancel/:orderID/table/:qrCodeIdentifier` - Cancel specific order
- `PATCH /staff/orders/:orderID/status` - Update order status

## Health Check
- `GET /health` - Health check
- `GET /ping` - Simple ping test

## Usage Examples

### Login
```javascript
import { loginApi } from '../api/authApi';
const response = await loginApi('username', 'password');
```

### Get Menu (Customer)
```javascript
import { customerApi } from '../api/customerApi';
const menu = await customerApi.getMenuItems();
```

### Get Staff List (Admin)
```javascript
import { staffApi } from '../api/adminApi';
const staffList = await staffApi.getList();
```

### Create Order (Customer)
```javascript
import { customerApi } from '../api/customerApi';
const order = await customerApi.createOrder({
  qrCodeIdentifier: 'table-001',
  items: [{ menuItemId: 1, quantity: 2 }]
});
```
