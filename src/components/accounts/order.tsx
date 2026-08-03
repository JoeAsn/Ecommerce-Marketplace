import { Link } from "react-router";
import { useDataContext } from "../../dataContext";
import type { Order } from "../../types/orders";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(value) || 0,
  );

export default function Orders() {
  const { orders = [], ordersLoading } = useDataContext();

  return (
    <div>
      <h1>Your Orders</h1>
      {ordersLoading ? (
        <p>Loading your orders...</p>
      ) : orders.length ? (
        <div className="orders-list">
          {orders.map((order: Order) => (
            <div className="order-card" key={order.id}>
              <div>
                <h3>{order.orderNumber || `Order #${order.id}`}</h3>
                <p>{order.items?.length || 0} item(s) · {money(order.total)}</p>
                <p>Status: {order.status || "Processing"}</p>
              </div>
              <Link className="outline-button" to="/orders">Details</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not placed any orders yet.</p>
      )}
    </div>
  );
}
