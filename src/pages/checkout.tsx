import { useContext, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import Header from "../components/CheckoutHeader";
import Footer from "../components/Footer";
import "../styles/checkout.css";
import { DataContext } from "../dataContext";
import { createOrder } from "../api/ordersAPI";
import type { CartItem, CartStateProps } from "../types/cart";
import type { Order } from "../types/orders";

const money = (value: number) =>
  new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(
    value,
  );

interface CheckoutPageProps {
  cart?: CartItem[];
  setCart: CartStateProps["setCart"];
}

export default function Checkout({ cart = [], setCart }: CheckoutPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const context = useContext(DataContext);
  const user = context?.user ?? null;
  const userId = user?.id ?? null;
  const setOrders = context?.setOrders ?? (() => undefined);
  const safeCart = Array.isArray(cart) ? cart : [];
  const delivery = location.state?.delivery || "standard";
  const subtotal = safeCart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );
  const shipping = safeCart.length && delivery === "premium" ? 45 : 0;
  const tax = (subtotal + shipping) * 0.085;
  const total = subtotal + shipping + tax;

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  async function handleConfirmOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!safeCart.length || !userId) return;

    const formData = new FormData(event.currentTarget);
    const order: Order = {
      id: `order-${Date.now()}`,
      userId: userId,
      orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      status: "Processing",
      items: safeCart.map(({ id, mainImage, selectedSize, ...item }) => ({
        ...item,
        productId: id,
        image: mainImage,
        size: selectedSize,
      })),
      total,
      delivery,
      paymentMethod,
      shippingAddress: {
        fullName: String(formData.get("fullName") || ""),
        email: String(formData.get("email") || ""),
        address: String(formData.get("address") || ""),
        city: String(formData.get("city") || ""),
        postalCode: String(formData.get("postalCode") || ""),
      },
    };

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const savedOrder = await createOrder(order);
      setOrders((currentOrders) => [savedOrder as Order, ...(currentOrders ?? [])]);
      if (typeof setCart === "function") setCart([]);
      navigate("/orders", { replace: true });
    } catch (error) {
      console.error("Unable to place order:", error);
      setSubmitError("We could not place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <title>Checkout</title>
      <Header />
      <main className="checkout-shell">
        <div className="checkout-title">
          <p className="eyebrow">Finalize your order</p>
          <h1>Checkout</h1>
          <p>Review your shipping details and payment summary before confirming.</p>
        </div>

        <div className="checkout-grid">
          <section className="checkout-form-card">
            <h2>Delivery information</h2>
            <form id="checkout-form" className="checkout-form" onSubmit={handleConfirmOrder}>
              <label>
                Full Name
                <input name="fullName" type="text" placeholder="Jane Doe" required />
              </label>
              <label>
                Email Address
                <input name="email" type="email" placeholder="email@example.com" required />
              </label>
              <label>
                Shipping Address
                <input name="address" type="text" placeholder="123 Main Street" required />
              </label>
              <label>
                City
                <input name="city" type="text" placeholder="New York" required />
              </label>
              <label>
                Postal Code
                <input name="postalCode" type="text" placeholder="10001" required />
              </label>
              <label>
                Payment Method
                <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                  <option>Credit Card</option>
                  <option>PayPal</option>
                  <option>Apple Pay</option>
                </select>
              </label>

              {paymentMethod === "Credit Card" ? (
                <div className="payment-details">
                  <h3>Card details</h3>
                  <label className="card-number-field">
                    Card Number
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9 ]*"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      placeholder="0000 0000 0000 0000"
                      required
                    />
                  </label>
                  <div className="card-field-grid">
                    <label>
                      Expiry Date
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(event) => setExpiryDate(event.target.value)}
                        placeholder="MM / YY"
                        required
                      />
                    </label>
                    <label>
                      CVV
                      <input
                        type="password"
                        value={cvv}
                        onChange={(event) => setCvv(event.target.value)}
                        placeholder="***"
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Name on card
                    <input
                      type="text"
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                      placeholder="Jane Doe"
                      required
                    />
                  </label>
                </div>
              ) : (
                <div className="payment-redirect-card">
                  <p>
                    {paymentMethod === "PayPal"
                      ? "PayPal has been selected as your payment method."
                      : "Apple Pay has been selected as your payment method."}
                  </p>
                </div>
              )}
            </form>
          </section>

          <aside className="checkout-summary-card">
            <div className="summary-head">
              <p className="eyebrow">Order details</p>
              <h2>Summary</h2>
            </div>

            <div className="order-review">
              {safeCart.length ? (
                safeCart.map((item) => (
                  <div className="order-review-item" key={item.id}>
                    <span>{item.name}</span>
                    <strong>{money(item.price * item.quantity)}</strong>
                  </div>
                ))
              ) : (
                <p className="empty-message">No cart items available.</p>
              )}
            </div>

            <div className="checkout-totals">
              <p>
                <span>Subtotal</span>
                <strong>{money(subtotal)}</strong>
              </p>
              <p>
                <span>Delivery</span>
                <strong>{shipping ? money(shipping) : "Complimentary"}</strong>
              </p>
              <p>
                <span>Estimated tax</span>
                <strong>{money(tax)}</strong>
              </p>
              <div className="checkout-total-row">
                <span>Total</span>
                <strong>{money(total)}</strong>
              </div>
            </div>

            <button
              className="checkout-button"
              type="submit"
              form="checkout-form"
              disabled={!safeCart.length || isSubmitting}
            >
              {isSubmitting ? "Placing order..." : "Confirm order"}
            </button>
            {submitError && <p className="empty-message" role="alert">{submitError}</p>}
            <p className="checkout-note">
              Your payment details are not stored. Confirming this order completes the checkout demo.
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
