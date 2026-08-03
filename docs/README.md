# Joe Market

Joe Market is a React + TypeScript e-commerce demo built with Vite. The app lets users browse a curated product catalog, add products to a cart, proceed to checkout, and view their orders.

## Features
- Product browsing with featured and new-arrival sections
- Product detail pages with size and quantity selection
- Shopping cart with quantity updates and delivery selection
- Checkout flow with order submission
- Authentication via Supabase Auth
- Account pages for authenticated users

## Tech Stack
- React
- TypeScript
- Vite
- React Router
- Axios
- Supabase JS

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
```bash
npm install
```

### Environment Variables
Create a .env file with:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_PRODUCTS_API_URL=your-products-api-url
VITE_CART_API_URL=your-cart-api-url
VITE_ORDERS_API_URL=your-orders-api-url
```

### Run locally
```bash
npm run dev
```

### Build
```bash
npm run build
```
