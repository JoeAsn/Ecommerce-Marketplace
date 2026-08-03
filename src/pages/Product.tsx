import { useState, type MouseEvent } from "react";
import { useLocation } from "react-router";
import type { CartStateProps } from "../types/cart";
import type { Product as ProductType } from "../types/products";

interface ProductPageProps extends Pick<CartStateProps, "setCart"> {
  cart?: CartStateProps["cart"];
}

export default function Product({ setCart }: ProductPageProps) {
  const { state } = useLocation();
  const [product, setProduct] = useState<ProductType | null>(state as ProductType | null);
  function handleCart() {
    if (!product) return;

    setCart((currentCart) => {
      const safeCart = Array.isArray(currentCart) ? currentCart : [];
      const isInCart = safeCart.some((cartItem) => cartItem.id === product.id);
      return isInCart
        ? safeCart.map((cartItems) => {
            if (cartItems.id === product.id) {
              return {
                ...cartItems,
                quantity: cartItems.quantity + product.quantity,
              };
            }
            return cartItems;
          })
        : [
            ...safeCart,
            {
              id: product.id,
              name: product.name,
              selectedSize: product.selectedSize,
              quantity: product.quantity,
              price: product.price,
              mainImage: product.mainImage,
            },
          ];
    });
  }
  function handleSpec(event: MouseEvent<HTMLButtonElement>) {
    const target = event.currentTarget;
    if (!product) return;

    if (target.name === "size") {
      setProduct({ ...product, selectedSize: target.value });
    }
    if (target.name === "Add") {
      setProduct({ ...product, quantity: product.quantity + 1 });
    }
    if (target.name === "Sub") {
      setProduct({
        ...product,
        quantity: product.quantity > 1 ? product.quantity - 1 : 1,
      });
    }
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <title>{product.name}</title>
      <main className="product-page">
        <section className="product-gallery">
          <img
            className="main-product-image"
            src={product.mainImage}
            alt={product.name}
          />

          <div>
            {product.gallery.map((image) => (
              <img key={image} src={image} alt={product.name} />
            ))}
          </div>
        </section>

        <section className="product-details-luxury">
          <p className="eyebrow">
            {product.category} &nbsp;/&nbsp; {product.collection}
          </p>

          <h1>{product.name}</h1>

          <h2>{product.price}</h2>

          <p className="eyebrow">Description</p>

          <p>
            {product.description.replace(product.highlight, "")}
            <b>{product.highlight}</b>
          </p>

          <p className="eyebrow">Strap size</p>

          <div className="sizes">
            {product.sizes.map((size) => (
              <button
                name="size"
                key={size}
                className={size === product.selectedSize ? "chosen" : ""}
                value={size}
                onClick={handleSpec}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="quantity-control" style={{ margin: "1rem 0" }}>
            <button type="button" onClick={handleSpec} name="Sub">
              −
            </button>
            <span>{product.quantity}</span>
            <button type="button" onClick={handleSpec} name="Add">
              +
            </button>
          </div>

          <button
            className="gold-button full"
            type="button"
            onClick={handleCart}
          >
            Add to Cart
          </button>

          {product.accordion.map((item) => (
            <div className="accordion">
              {Object.keys(item)[0]}
              <p style={{fontSize : "16px" , lineHeight : 1.65 ,marginTop : "20px"}}>{item[Object.keys(item)[0]]}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
