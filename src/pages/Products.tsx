import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { useDataContext } from "../dataContext";
import type { CartStateProps } from "../types/cart";
import type { Product } from "../types/products";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  }).format(price);

interface ProductsPageProps extends Pick<CartStateProps, "setCart"> {
  cart?: CartStateProps["cart"];
}

export default function Products({ setCart }: ProductsPageProps) {
  const { products, loading } = useDataContext();
  const [params, setParams] = useSearchParams();
  const searched = params.get("search") || "";
  const selected = params.get("category") || "All pieces";
  const categories = useMemo(
    () => ["All pieces", ...new Set(products.map((product) => product.category))],
    [products],
  );
  const shownProducts = useMemo(() => {
    const query = searched.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selected === "All pieces" || product.category === selected;

      if (!query) return matchesCategory;

      const searchableValues = [
        product.name,
        product.category,
        product.collection,
        ...(Array.isArray(product.keywords) ? product.keywords : []),
      ];
      const matchesSearch = searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(query),
      );

      return matchesCategory && matchesSearch;
    });
  }, [products, searched, selected]);

  const handleAddToCart = (product: Product) => {
    if (typeof setCart !== "function") return;
    setCart((currentCart) => {
      const safeCart = Array.isArray(currentCart) ? currentCart : [];
      const isInCart = safeCart.some((cartItem) => cartItem.id === product.id);
      return isInCart
        ? safeCart.map((cartItem) => {
            if (cartItem.id === product.id) {
              return {
                ...cartItem,
                quantity: (cartItem.quantity || 1) + 1,
              };
            }
            return cartItem;
          })
        : [
            ...safeCart,
            {
              ...product,
              quantity: 1,
            },
          ];
    });
  };

  const changeCategory = (category: string) => {
    const nextParams: Record<string, string> = {};
    if (searched) nextParams.search = searched;
    if (category !== "All pieces") nextParams.category = category;
    setParams(nextParams);
  };
  return (
    <>
    <title>Products</title>
      <main className="products-page">
        <div className="products-intro">
          <p className="eyebrow">The Joe Market collection</p>
          <h1>Discover the exceptional.</h1>
          <p>
            Every piece is chosen for its enduring material, thoughtful design,
            and ability to elevate the everyday.
          </p>
        </div>
        <div className="products-toolbar">
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                className={selected === category ? "active" : ""}
                onClick={() => changeCategory(category)}
                key={category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="products-result-row">
          <span>
            {shownProducts.length}{" "}
            {shownProducts.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
        {loading ? (
          <section className="no-results">
            <p>Loading collection...</p>
          </section>
        ) : shownProducts.length ? (
          <section className="catalogue-grid">
            {shownProducts.map((product) => (
              <article className="catalogue-card" key={product.id}>
                <Link to={`/products/${product.id}`} state={product}>
                  <div className="catalogue-photo">
                    <img src={product.mainImage} alt={product.name} />
                  </div>
                </Link>
                <p className="eyebrow">{product.category}</p>
                <h2>{product.name}</h2>
                <div>
                  <span>{formatPrice(product.price)}</span>
                  <Link to={`/products/${product.id}`} state={product} aria-label={`View ${product.name}`}>
                    →
                  </Link>
                </div>
                <button
                  type="button"
                  className="AddCart"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to shop
                </button>
              </article>
            ))}
          </section>
        ) : (
          <section className="no-results">
            <h2>No pieces found.</h2>
            <p>
              Browse the complete collection to explore the available pieces.
            </p>
            <button className="outline-button" onClick={() => setParams({})}>
              View all pieces
            </button>
          </section>
        )}
      </main>
    </>
  );
}
