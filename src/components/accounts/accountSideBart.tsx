import { NavLink } from "react-router";

interface AccountSidebarProps {
  onLogout: () => void;
}

export default function AccountSidebar({ onLogout }: AccountSidebarProps) {
  const links = [
    {
      name: "Overview",
      path: "/account",
    },
    {
      name: "Profile Information",
      path: "/account/profile",
    },
    {
      name: "Orders",
      path: "/account/orders",
    }
  ];

  return (
    <aside className="account-sidebar">
      <h3>MY ACCOUNT</h3>

      <nav>
        {links.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/account"}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button type="button" onClick={onLogout}>Logout</button>
    </aside>
  );
}
