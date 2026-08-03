import { Link } from "react-router";
export default function cartHeader() {
  return (
    <header className="cart-top">
      <Link to="/" className="wordmark">
        Joe Market
      </Link>
      <div>♙ &nbsp; Secure cart</div>
    </header>
  );
}
