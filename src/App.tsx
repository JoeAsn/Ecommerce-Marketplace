import HomePage from "./pages/Home";
import { Route, Routes } from "react-router";
import Cart from "./pages/cart";
import OrdersPage from "./pages/OrderPage";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Checkout from "./pages/checkout.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/sign-up.jsx";
import MainLayout from "./Layouts/mainLayout";
import { DataProvider, useDataContext } from "./dataContext.jsx";
import { useUserCart } from "./hooks/useUserCart";
import AccountLayout from "./components/accounts/accountLayout";
import Overview from "./components/accounts/overview";
import Profile from "./components/accounts/profile";
import Orders from "./components/accounts/order";
import "./styles/account.css";
export default function App() {
  return (
    <DataProvider>
      <AppRoutes />
    </DataProvider>
  );
}

function AppRoutes() {
  const { user } = useDataContext();
  const { cart: cartItems, updateCart: setCartItems } = useUserCart(user);
  const cartQuantity = cartItems.reduce(
    (total, item) => total + Math.max(0, Number(item.quantity) || 0),
    0,
  );

  return (
    <Routes>
        <Route element={<MainLayout CartNo={cartQuantity}/>}>
          <Route
            index
            element={<HomePage cart={cartItems} setCart={setCartItems} />}
          />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/products/:id"
            element={<Product cart={cartItems} setCart={setCartItems} />}
          />
          <Route
            path="/products"
            element={<Products cart={cartItems} setCart={setCartItems} />}
          />
          <Route path="/login" element={<Login/>} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Overview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
        <Route
          path="/cart"
          element={<Cart cart={cartItems} setCart={setCartItems} />}
        />
        <Route
          path="/checkout"
          element={<Checkout cart={cartItems} setCart={setCartItems} />}
        />
    </Routes>
  );
}
