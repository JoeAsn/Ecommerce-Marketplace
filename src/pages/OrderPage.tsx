import { Link } from "react-router";
import { useDataContext } from "../dataContext";
import type { Order, OrderItem } from "../types/orders";

const money = (value: number) =>
  new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(
    Number(value) || 0,
  );

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value))
    : "Date unavailable";

export default function OrdersPage() {
  const { user, orders, ordersLoading } = useDataContext();
  const safeOrders = orders ?? [];

  if (!user?.id) {
    return (
      <main className="page-shell orders-layout">
        <section>
          <p className="eyebrow">Order management</p>
          <h1>Your Journey</h1>
          <p className="intro">Sign in to view and manage your orders.</p>
          <Link className="gold-button" to="/login">Sign in</Link>
        </section>
      </main>
    );
  }

  return (
    <>
      <title>Orders</title>
      <main className="page-shell orders-layout">
        <section>
          <p className="eyebrow">Order management</p>
          <h1>Your Journey</h1>
          <p className="intro">Track every curated acquisition in one place.</p>

          {ordersLoading ? (
            <p>Loading your orders...</p>
          ) : safeOrders.length ? (
            safeOrders.map((order) => <OrderDetails key={order.id} order={order} />)
          ) : (
            <div className="live-order">
              <h2>No orders yet</h2>
              <p>Your completed purchases will appear here.</p>
              <Link className="gold-button" to="/products">Explore products</Link>
            </div>
          )}
        </section>

        <aside className="history">
          <h2>Purchase History</h2>
          {safeOrders.map((order) => (
            <div className="history-card" key={order.id}>
              <div>
                <small>{formatDate(order.createdAt)}</small>
                <strong>{order.orderNumber || `Order #${order.id}`}</strong>
              </div>
              <span className={`pill ${(order.status || "processing").toLowerCase()}`}>
                {order.status || "Processing"}
              </span>
              <hr />
              <div>
                <small>Total</small>
                <strong>{money(order.total)}</strong>
              </div>
            </div>
          ))}
        </aside>
      </main>
    </>
  );
}

function OrderDetails({ order }: { order: Order }) {
  const address = order.shippingAddress || {
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
  };

  return (
    <article className="live-order">
      <div className="live-order-head">
        <div>
          <p className="eyebrow">{order.status || "Processing"}</p>
          <h2>Order <span>{order.orderNumber || `#${order.id}`}</span></h2>
        </div>
        <div>
          <p className="eyebrow">Placed</p>
          <h3>{formatDate(order.createdAt)}</h3>
        </div>
      </div>
      <div className="order-meta">
        <div>
          <p className="eyebrow">Shipping address</p>
          <p>{address.fullName}<br />{address.address}<br />{address.city} {address.postalCode}</p>
        </div>
        <div>
          <p className="eyebrow">Order details</p>
          <p>{order.items?.length || 0} item(s)<br />Standard delivery<br />{money(order.total)}</p>
        </div>
      </div>
      <div className="button-row">
        {order.items?.map((item: OrderItem) => (
          <span key={`${order.id}-${item.productId}`}>{item.name} × {item.quantity}</span>
        ))}
      </div>
    </article>
  );
}
