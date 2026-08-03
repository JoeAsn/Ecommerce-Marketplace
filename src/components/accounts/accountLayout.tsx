import { Navigate, Outlet, useNavigate } from "react-router";
import { useDataContext } from "../../dataContext";
import AccountSidebar from "./accountSideBart";

export default function AccountLayout() {
  const { user, setUser } = useDataContext();
  const navigate = useNavigate();

  if (!user?.id) return <Navigate to="/login" replace />;

  function handleLogout() {
    setUser(null);
    navigate("/login", { replace: true });
  }

  return (
    <div className="account-layout">
      <AccountSidebar onLogout={handleLogout} />

      <section className="account-content">
        <Outlet context={{ user }} />
      </section>
    </div>
  );
}
