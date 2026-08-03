import { Link, useOutletContext } from "react-router";
import { useDataContext } from "../../dataContext";
import type { User } from "../../types/user";

export default function Overview() {
  const { user } = useOutletContext<{ user: User | null }>();
  const { orders = [], ordersLoading } = useDataContext();

  return (
    <div>
      <h1>Welcome back, {user?.name}</h1>
      <p>Manage your account and orders.</p>

      <div className="account-stats">
        <div>
          <span>Orders</span>
          <strong>{ordersLoading ? "—" : orders.length}</strong>
        </div>

        <div>
          <span>Latest status</span>
          <strong>{orders[0]?.status || "None"}</strong>
        </div>

        <div>
          <span>Membership</span>
          <strong>Gold</strong>
        </div>
      </div>

      <Link className="gold-button" to="/account/orders">View your orders</Link>
    </div>
  );
}
