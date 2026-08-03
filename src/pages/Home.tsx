import { Link } from "react-router";
import "../styles/HomePage.css";
import { useDataContext } from "../dataContext";
import type { CartItem, CartStateProps } from "../types/cart";
import type { Product } from "../types/products";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  }).format(price);

interface HomePageProps extends Pick<CartStateProps, "setCart"> {
  cart?: CartItem[];
}

export default function HomePage({ setCart }: HomePageProps) {
  const { products, loading } = useDataContext();
  const newArrivals = products.filter((product) => product.newArrival);
  const Fearured = products.filter((product) => product.featured);
  const handleAddToCart = (product: Product) => {
    if (typeof setCart !== "function") return;
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      return existingItem
        ? currentCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
              : item,
          )
        : [...currentCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <>
      <title>Home Page</title>
      <main>
        <section className="hero">
          <video className="bg-video" autoPlay loop muted playsInline>
            <source src="/videos/video.mp4" type="video/mp4" />
          </video>

          <div className="hero-content">
            <div className="hero-copy">
              <h1>
                Objects of
                <br />
                <em>quiet distinction.</em>
              </h1>
              <p>
                Exceptional pieces chosen for the way you live now — and the
                stories you will carry forward.
              </p>
              <Link to="/products" className="pill-button">
                Shop now →
              </Link>
            </div>
          </div>
        </section>

        <section className="editorial" id="collection">
          <p className="eyebrow">Selected with intention</p>
          <h2>A life well collected.</h2>
          <p>
            Thoughtful essentials, rare finds and enduring designs, assembled
            for a world of considered living.
          </p>
        </section>

        <section className="collection">
          <div className="section-heading">
            <h2>New arrivals</h2>
            <Link to="/products">View all pieces →</Link>
          </div>
          <div className="luxury-grid">
            {loading ? (
              <p>Loading new arrivals...</p>
            ) : newArrivals.length ? (
              newArrivals
                .slice(0, 8)
                .map((ProductInfo) => (
                  <article className="luxury-card" key={ProductInfo.id}>
                    <Link to={`/products/${ProductInfo.id}`} state={ProductInfo}>
                      <div className="product-photo">
                        <img src={ProductInfo.mainImage} alt={ProductInfo.name} />
                      </div>
                    </Link>
                    <p className="eyebrow">{ProductInfo.category}</p>
                    <h3>{ProductInfo.name}</h3>
                    <div className="card-bottom">
                      <span>{formatPrice(ProductInfo.price)}</span>
                      <span className="eyebrow">View More</span>
                    </div>
                    <button type="button" className="AddCart" onClick={() => handleAddToCart(ProductInfo)}>
                      Add to cart
                    </button>
                  </article>
                ))
            ) : (
              <p>No new arrivals yet.</p>
            )}
          </div>
        </section>

        <section className="collection">
          <div className="section-heading">
            <h2>Featured Products</h2>
            <Link to="/products">View all pieces →</Link>
          </div>
          <div className="luxury-grid">
            {Fearured.slice(0, 8).map(
              (ProductInfo) => (
                <article className="luxury-card" key={ProductInfo.id}>
                  <Link to={`/products/${ProductInfo.id}`} state={ProductInfo}>
                    <div className="product-photo">
                      <img src={ProductInfo.mainImage} alt={ProductInfo.name} />
                    </div>
                  </Link>
                  <p className="eyebrow">{ProductInfo.category}</p>
                  <h3>{ProductInfo.name}</h3>
                  <div className="card-bottom">
                    <span>{formatPrice(ProductInfo.price)}</span>
                    <span className="eyebrow">View More</span>
                  </div>
                    <button type="button" className="AddCart" onClick={() => handleAddToCart(ProductInfo)}>
                      Add to cart
                    </button>
                </article>
              ),
            )}
          </div>
        </section>
      </main>
    </>
  );
}
