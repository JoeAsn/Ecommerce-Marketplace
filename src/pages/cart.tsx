import { Link, useNavigate } from "react-router";
import Header from "../components/CheckoutHeader";
import Footer from "../components/Footer";
import { useState } from "react";
import type { CartItem, CartStateProps } from "../types/cart";

const money = (value : number) =>
  new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(
    value,
  );
interface CartPageProps {
  cart?: CartItem[];
  setCart: CartStateProps["setCart"];
}

export default function Cart({ cart = [], setCart }: CartPageProps) {
  const [delivery, setDelivery] = useState("premium");
  const safeCart = Array.isArray(cart) ? cart : [];
  const navigate = useNavigate();
  const subtotal =
    safeCart.length > 0
      ? safeCart.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0;
  const shipping = safeCart.length > 0 && delivery === "premium" ? 45 : 0;
  const tax = (subtotal + shipping) * 0.085;

  function handleCheckout() {
    navigate("/checkout", {
      state: {
        cart: safeCart,
        delivery,
      },
    });
  }

  return (
    <>
    <title>Cart</title>
      <Header />
      <main className="cart-shell">
        <div className="cart-title">
          <div>
            <p className="eyebrow">Your private selection</p>
            <h1>Shopping Bag</h1>
            <p>
              {safeCart.reduce((total, item) => total + (Number(item.quantity) || 0), 0)} curated pieces reserved for you.
            </p>
          </div>
          <Link to="/products" className="continue-shopping">
            ← Continue shopping
          </Link>
        </div>
        <div className="cart-grid">
          <section className="cart-items">
            <div className="cart-labels">
              <span>Acquisition</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {safeCart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                cart={safeCart}
                setCart={setCart}
              />
            ))}
            <section className="delivery-section">
              <p className="eyebrow">Delivery preference</p>
              <h2>How should we deliver?</h2>

              <div
                className={`delivery-choice ${delivery === "premium" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === "premium"}
                  onChange={() => setDelivery("premium")}
                />
                <p>
                  <strong>Premium Delivery</strong>
                  <small>Delivered in 2–3 business days</small>
                </p>
                <b>{money(45.00)}</b>
              </div>

              <div
                className={`delivery-choice ${delivery === "standard" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === "standard"}
                  onChange={() => setDelivery("standard")}
                />
                <p>
                  <strong>Standard Delivery</strong>
                  <small>Delivered in 5–7 business days</small>
                </p>
                <b>Complimentary</b>
              </div>
            </section>
          </section>
          <aside className="cart-summary cart-summary">
            <p className="eyebrow">Order summary</p>
            <h2>The details</h2>
            <div className="totals">
              <p>
                <span>Subtotal</span>
                <b>{money(subtotal)}</b>
              </p>
              <p>
                <span>Delivery</span>
                <b>{shipping ? money(shipping) : "Complimentary"}</b>
              </p>
              <p>
                <span>Estimated Tax</span>
                <b>{money(tax)}</b>
              </p>
              <h2>
                <span>Total</span>
                <b>{money(subtotal + shipping + tax)}</b>
              </h2>
            </div>
            <button
              className="gold-button full"
              type="button"
              onClick={handleCheckout}
              disabled={!safeCart.length}
            >
              Proceed to Check-out
            </button>
            <small className="secure-note">
              Secure transaction · Guaranteed authenticity
            </small>
            <p className="summary-note">
              You will confirm your delivery address and payment method on the
              next step.
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface CartItemProps {
  item: CartItem;
  cart: CartItem[];
  setCart: CartStateProps["setCart"];
}

export function CartItem({ item, setCart }: CartItemProps) {
  function handleAmount(action: "Add" | "Sub") {
    setCart((currentCart) =>
      currentCart.flatMap((cartItem) => {
        if (cartItem.id !== item.id) return [cartItem];
        const nextQuantity = action === "Add" ? cartItem.quantity + 1 : cartItem.quantity - 1;
        return nextQuantity > 0 ? [{ ...cartItem, quantity: nextQuantity }] : [];
      }),
    );
  }

  function handleRemove() {
    setCart((currentCart) =>
      currentCart.filter((cartItem) => cartItem.id !== item.id),
    );
  }

  return (
    <article className="cart-item">
      <img src={item.mainImage} alt={item.name} />
      <div className="cart-product-info">
        <p className="eyebrow">Selected acquisition</p>
        <h2>{item.name}</h2>
        <p>{item.details}</p>
        <p>Quantity: {item.quantity}</p>
        <p>Size: {item.selectedSize}</p>
        <button className="remove-item" onClick={handleRemove}>
          remove
        </button>
      </div>
      <div className="quantity-control">
        <button
          type="button"
          aria-label={`Decrease ${item.name} quantity`}
          onClick={() => handleAmount("Sub")}
        >
          −
        </button>
        <span>{item.quantity}</span>
        <button
          type="button"
          aria-label={`Increase ${item.name} quantity`}
          onClick={() => handleAmount("Add")}
        >
          +
        </button>
      </div>
      <strong className="item-total">
        {money(item.price * item.quantity)}
      </strong>
    </article>
  );
}
