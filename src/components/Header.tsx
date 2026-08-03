import { useEffect, useState, useContext, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { DataContext } from "../dataContext";
import "../styles/header.css";

interface IconProps {
  children: ReactNode;
  className?: string;
}

const Icon = ({ children, className = "" }: IconProps) => (
  <span className={`icon ${className}`} aria-hidden="true">
    {children}
  </span>
);

interface HeaderProps {
  cartNum?: number | string;
}

export default function Header(props: HeaderProps) {
  const context = useContext(DataContext);
  const user = context?.user ?? null;
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = search.trim();
    const nextParams = new URLSearchParams();
    const category = params.get("category");
    if (query) nextParams.set("search", query);
    if (category) nextParams.set("category", category);

    const queryString = nextParams.toString();
    navigate(queryString ? `/products?${queryString}` : "/products");
  }

  return (
    <>
      <header className={`site-header${isScrolled ? " scrolled" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link to="/" className="wordmark">
            Joe Market
          </Link>
        </div>

        <form
          className="header-search"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <Icon aria-hidden>
            <i className="fa-solid fa-magnifying-glass"></i>
          </Icon>
          <input
            name="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
            placeholder="Search Product"
          />
        </form>

        <div className="header-actions">
          <Link to={user?.id ? "/account" : "/login"} aria-label="Account">
            {user ? (
              <Icon>
                <i className="fa-regular fa-user"></i>
              </Icon>
            ) : (
              <Icon className="login"> Login </Icon>
            )}
          </Link>
          <Link to="/orders" aria-label="Orders">
            <Icon>
              <i className="fa-regular fa-truck"></i>
            </Icon>
          </Link>
          <Link to="/cart" className="cart-action" aria-label="Cart">
            <Icon>
              <i className="fa-solid fa-cart-arrow-down"></i>
            </Icon>
            <b>{props.cartNum}</b>
          </Link>
        </div>
      </header>
    </>
  );
}
