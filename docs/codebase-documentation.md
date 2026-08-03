# Codebase Documentation

## 1. Project Overview

This project is a React + TypeScript e-commerce storefront for browsing products, adding items to a cart, checking out, and viewing order history. The application is implemented as a single-page experience using React Router and a custom context-based state layer.

### What the application does
- Displays a curated product catalog with featured and new-arrival sections.
- Allows users to view a product detail page and choose a size and quantity.
- Supports a cart experience with quantity updates, item removal, delivery selection, and checkout.
- Supports authentication through Supabase Auth for sign-up and login.
- Displays account pages for authenticated users and shows order-related screens.

### Problem it solves
The app provides a simple front-end shopping experience for a boutique-style marketplace. It combines product browsing, cart management, authentication, and order flow in one interface.

### Target users
- Shoppers browsing a curated product collection.
- Users who want to create an account and track orders.
- Developers using this codebase as a learning example for React, TypeScript, React Router, and Supabase integration.

---

## 2. Technology Stack

### Core technologies
- React 19: UI rendering and component composition.
- TypeScript: Static typing for safer component and API code.
- Vite: Development server and build tooling.
- React Router: SPA routing and navigation.
- Axios: HTTP requests to remote APIs.
- Supabase JS: Authentication integration.

### Why these were chosen
- React and TypeScript were used to build a modern component-based UI with safer data handling.
- Vite provides a fast local development experience and simple production builds.
- React Router supports route-based navigation for products, cart, checkout, and account pages.
- Axios is used for API calls to cart and orders endpoints.
- Supabase JS is used for authentication operations such as sign-up and login.

---

## 3. Project Structure

### Root files
- package.json: Scripts and dependencies.
- tsconfig.json, tsconfig.app.json, tsconfig.node.json: TypeScript configuration.
- vite.config.ts: Vite configuration.
- index.html: HTML entry point.
- eslint.config.js: ESLint rules.
- README.md: Placeholder documentation (currently the default Vite README).

### Source folders
- src/main.tsx: Bootstraps the React app and wraps it in BrowserRouter.
- src/App.tsx: Defines the application routes and shared cart state.
- src/dataContext.tsx: Provides application-wide context for products, user, orders, and loading state.
- src/hooks/useUserCart.ts: Manages cart state and persistence for authenticated users.
- src/api/: API modules for authentication, cart, orders, and Supabase client setup.
- src/pages/: Page-level components for the storefront experience.
- src/components/: Reusable presentational and layout components.
- src/types/: TypeScript interfaces and types.
- src/styles/: CSS files for the UI.
- src/actions/: Form-action wrappers used by the auth pages.

### Important files
- src/api/authAPI.ts: Implements sign-up and login through Supabase Auth.
- src/api/cartAPI.ts: Fetches and updates the cart via REST calls.
- src/api/ordersAPI.ts: Creates and retrieves orders.
- src/api/supabaseClient.ts: Initializes the Supabase client.
- src/hooks/useUserCart.ts: Normalizes cart data from API responses and syncs cart updates.
- src/dataContext.tsx: Acts as the application’s shared data provider.

---

## 4. Architecture

### Overall architecture
The app uses a component-based architecture with:
- page components for route-level UI,
- shared context for cross-cutting data,
- custom hooks for cart logic,
- API modules for external services,
- typed data models for safety.

### Data flow
1. The app boots in src/main.tsx and mounts BrowserRouter.
2. App renders DataProvider from src/dataContext.tsx.
3. AppRoutes inside App.tsx reads the current authenticated user and uses useUserCart to manage cart state.
4. Product-related pages read data from DataContext and update the cart via the shared setter.
5. Checkout and order pages use the cart data and the user context to place orders.

### Component communication
- Parent-to-child props are used for simple page data like cart and setter props.
- Context is used for products, user, orders, and loading state.
- Outlet context is used for account pages to share the current user.

### Services, hooks, and utilities
- API modules encapsulate network concerns.
- The custom hook manages cart normalization and persistence logic.
- Page components handle presentation and user interaction.
- Type definitions ensure data passed between layers is structured.

---

## 5. Authentication

### Authentication flow
The project implements basic authentication with Supabase Auth.

#### Signup flow
1. The sign-up page collects name, email, and password.
2. The action wrapper in src/actions/signup.ts builds a Credentials object and calls signup() from src/api/authAPI.ts.
3. authAPI.ts calls supabase.auth.signUp().
4. On success, the app receives the authenticated user and stores it via the context setter.

#### Login flow
1. The login page collects email and password.
2. The action wrapper in src/actions/login.ts calls login() from src/api/authAPI.ts.
3. authAPI.ts calls supabase.auth.signInWithPassword().
4. On success, the app stores the authenticated user in context and navigates home.

#### Logout flow
Logout is implemented in the account layout. It calls setUser(null) and navigates back to /login.

#### Session persistence
The code uses Supabase’s auth session handling through the Supabase JS client. The current implementation does not show explicit persistence configuration beyond the default client setup.

#### Protected routes
Account routes are protected by the AccountLayout component. If there is no authenticated user, it redirects to /login.

### Important note
The codebase uses Supabase Auth, but it does not show a dedicated session restore or token refresh flow in the files inspected.

---

## 6. Database

The codebase does not define a local database schema in the application source. Instead, it relies on external services for data.

### Tables used
The code does not include SQL schema definitions or migration files. The app appears to use remote resources through the following endpoints:
- Products API via VITE_PRODUCTS_API_URL.
- Cart API via VITE_CART_API_URL.
- Orders API via VITE_ORDERS_API_URL.
- Supabase Auth for user authentication.

### Relationships between tables
No table relationships are defined in the inspected codebase.

### CRUD operations in the app
- Products: fetched with GET from the products API.
- Cart: fetched with GET and updated with PUT.
- Orders: created with POST and fetched with GET.
- Auth: sign-up and sign-in performed through Supabase Auth.

---

## 7. API Layer

### API organization
API logic is separated into files under src/api/:
- authAPI.ts: authentication requests.
- cartAPI.ts: cart retrieval and updates.
- ordersAPI.ts: order retrieval and creation.
- supabaseClient.ts: shared Supabase client setup.

### Service functions
#### authAPI.ts
- signup(data): creates a new account with Supabase Auth.
- login(data): authenticates a user with Supabase Auth.

#### cartAPI.ts
- getCartForUser(userId): fetches the current cart for a user.
- updateCart(cartId, userId, items): saves the cart payload to the cart API.

#### ordersAPI.ts
- getOrdersForUser(userId): retrieves orders for a user.
- createOrder(order): sends a new order to the orders API.

### Error handling
- API modules check for response errors and return safe fallback values.
- In hooks and page components, errors are logged to the console.
- Checkout pages display an error message if order placement fails.

### Loading states
- The DataContext tracks a loading flag for products.
- The data context also tracks ordersLoading while fetching orders.
- Pages show loading messages when product or order data is being retrieved.

---

## 8. State Management

### State management approach
The app uses a mix of:
- React local state for form inputs and page-level UI state.
- Context for shared application data.
- Custom hook state for cart logic.

### Where each type is used
- Local state:
  - Product quantity and selected size on the product page.
  - Delivery selection in the cart page.
  - Checkout form fields and submitting state in the checkout page.
- Global state:
  - User information, products, orders, and loading flags are stored in DataContext.
- Derived state:
  - Cart quantity is derived from the cart array in App.tsx.
  - Categories and filtered products are derived in Products.tsx.

### Why this approach was chosen
- Context is sufficient for this app’s moderate size and avoids introducing Redux or another external state library.
- Local state is used where state is only relevant to one component.
- The cart hook centralizes cart normalization and persistence logic.

---

## 9. Routing

### Routes defined
The app uses React Router with these routes:
- /: home page.
- /products: product listing page.
- /products/:id: product detail page.
- /cart: shopping cart page.
- /checkout: checkout page.
- /orders: order page.
- /login: login page.
- /sign-up: sign-up page.
- /account: account layout containing nested routes.
  - /account: overview.
  - /account/profile: profile.
  - /account/orders: orders.

### Navigation flow
- The header links users to account, orders, and cart.
- The home and products pages link to product detail pages.
- The cart page routes to checkout.
- Auth pages redirect users based on authentication state.

### Dynamic routes
- /products/:id is implemented with React Router dynamic route matching.

### Protected routes
The account section is guarded by AccountLayout.

---

## 10. TypeScript

### Important types and interfaces
- Product: defines the product model used throughout the catalog and detail pages.
- CartItem: defines the shape of cart entries used in the UI and API layer.
- User: represents the current authenticated user.
- Order and OrderItem: define order data structures.
- Credentials: defines the shape of auth inputs.

### TypeScript usage patterns
- Interfaces are used for structured data objects.
- Pick and partial types are used in the cart typing layer.
- React state and event handler types are used in page components.

### How TypeScript improves safety
- It catches invalid prop usage and data shape mismatches.
- It makes API payloads and cart state less error-prone.
- It helps prevent accidental use of undefined values in components.

---

## 11. Reusable Components

### Header
- Displays the navigation and search UI.
- Receives cart count through props.

### Footer
- Displays footer links and branding.

### CheckoutHeader
- Displays the secure-cart header used on cart and checkout pages.

### AccountSidebar
- Displays navigation links for the account section and logout action.

### CartItem
- Renders a single cart entry with quantity controls and remove action.

---

## 12. Performance

### Existing optimizations
- useMemo is used in Products.tsx to memoize category list and filtered products.
- The cart hook uses refs to avoid unnecessary state churn for cart persistence.
- The app uses React Router and lazy-style page composition without heavy extra libraries.

### Realistic improvements
- Add lazy loading for page components to reduce initial bundle size.
- Memoize repeated UI computations in more components.
- Avoid passing large objects through route state when a smaller identifier would suffice.
- Consider debouncing search input updates.

---

## 13. Security

### How secrets are handled
- Environment variables are loaded from Vite env files, such as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
- The app uses the Supabase anon key as configured in the client.

### Potential security issues
- The code currently uses the Supabase anon key directly in the browser client. This is expected for public access, but it means the client-side app cannot be trusted with privileged operations.
- The app does not appear to enforce server-side authentication or authorization for cart or orders.
- Form data is handled directly in the client and not validated beyond HTML required attributes.

---

## 14. Challenges

### Challenge: cart state across pages
The app needs a cart that persists across multiple routes and can also sync to an API for authenticated users. This was solved with a shared setter passed through routes and a custom hook that normalizes and syncs cart data.

### Challenge: mixed data sources
Products, orders, and auth come from different services. The data context centralizes access so page components do not need to know where the data comes from.

### Challenge: typed cart mapping
Cart data from the API uses a different shape than the UI-facing cart model. The hook normalizes that data before the UI consumes it.

---

## 15. Possible Improvements

### Ranked by impact
1. Add server-side validation and real backend authorization for carts and orders.
2. Add persistent auth/session handling and refresh support.
3. Introduce a more structured loading/error state system.
4. Add unit and integration tests.
5. Reduce duplicate cart logic across pages by centralizing cart actions into helpers.

---

## 16. README

The following README is ready to use for GitHub:

```md
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
```

---

## 17. Interview Preparation

### Major feature: product catalog
Simple explanation:
A product catalog page loads items from a remote products API and displays them in a clean storefront layout.

Why it was implemented this way:
The app uses a simple shared data source so the home page and products page can both render the same product dataset without duplicating logic.

Common interview questions:
- How would you structure a product listing page in React?
- What is the difference between local state and context in this project?

Sample answer:
I would keep product data in a shared context and use page components to render filtered views. That keeps the data accessible across pages while allowing each page to derive its own UI state.

Common mistakes:
- Duplicating product data across components.
- Mixing presentation logic with data fetching logic.

### Major feature: cart management
Simple explanation:
The cart stores selected products and quantities, and users can update them as they browse the site.

Why it was implemented this way:
The cart needs to be shared across multiple routes, so it is managed in a custom hook and passed through the app state.

Common interview questions:
- Why use a custom hook for cart logic?
- How do you handle state updates in a list-based UI?

Sample answer:
A custom hook centralizes the logic for normalizing, updating, and syncing the cart. That keeps the component code simpler and makes the behavior easier to reuse.

Common mistakes:
- Updating the cart in multiple places without a shared source of truth.
- Mutating array state directly.

### Major feature: authentication
Simple explanation:
Users can create an account and sign in with Supabase Auth, and the app stores the authenticated user in shared context.

Why it was implemented this way:
Authentication is a cross-cutting concern, so the app uses context to expose the current user throughout the interface.

Common interview questions:
- How would you protect routes in a React app?
- What is the difference between client-side auth and server-side auth?

Sample answer:
I would protect routes by checking whether a user exists in context and redirecting unauthenticated users to a login page. In this project, the account layout uses that pattern.

Common mistakes:
- Trusting client-side state alone for protected access.
- Forgetting to handle auth failures.

### Major feature: checkout and orders
Simple explanation:
The checkout page gathers shipping details, creates an order payload, and sends it to the orders API.

Why it was implemented this way:
The app keeps checkout and orders separated from product browsing so each feature has a clear responsibility.

Common interview questions:
- How do you manage a multi-step checkout experience?
- How would you handle failures when placing an order?

Sample answer:
I would keep the checkout flow as a dedicated page, manage form state locally, and show clear loading and error states while the order API request is running.

Common mistakes:
- Submitting incomplete order data.
- Not handling network failures gracefully.

---

## 18. Code Review

### Duplicated code
- Cart add-to-cart logic is repeated in Home.tsx, Products.tsx, and Product.tsx.
- Product formatting logic is repeated in multiple page components.
- The same route configuration structure is repeated in the app layout.

### Refactoring opportunities
- Extract shared cart update helpers to reduce duplication.
- Create a shared formatPrice helper.
- Add a reusable ProductCard component.
- Centralize product filtering logic in a helper module.

### Code smells
- Some components still use inline styles and ad hoc markup rather than shared UI patterns.
- The app mixes presentational and data-handling concerns in page components.
- A few names are inconsistent, such as “Fearured” in Home.tsx.

### Best practices not fully followed
- Some files still rely on implicit any in earlier versions of the code; this has been improved, but stricter typing could be applied further.
- The cart and order flows would benefit from dedicated service helpers and shared validation.
- The project would benefit from unit tests for core flows such as cart updates and auth actions.
