import QuantityStepper from "../../ui/QuantityStepper";
import { useBundleStore } from "../../store/bundleStore";
import VariantSelector from "./VariantSelector";
import type { CatalogProduct } from "../../types/catalog";

type ProductCardProps = {
  product: CatalogProduct;
};

function ProductCard({ product }: ProductCardProps) {
  const setQuantity = useBundleStore((state) => state.setQuantity);
  const setActiveVariant = useBundleStore((state) => state.setActiveVariant);

  const activeVariantId = useBundleStore(
    (state) =>
      state.activeVariant[product.id] ?? product?.variants[0]?.id ?? "",
  );
  const activeVariant =
    product?.variants.find((variant) => variant.id === activeVariantId) ??
    product?.variants[0];
  const activeQuantity = useBundleStore((state) =>
    activeVariant ? (state.quantities[activeVariant.id] ?? 0) : 0,
  );
  const isSelected = useBundleStore(
    (state) =>
      product?.variants.some(
        (variant) => (state.quantities[variant.id] ?? 0) > 0,
      ) ?? false,
  );

  if (!product || !activeVariant) {
    return null;
  }

  const originalPrice = activeVariant.price;
  const hasDiscount = product.discount > 0;
  const salePrice = hasDiscount
    ? originalPrice * (1 - product.discount / 100)
    : originalPrice;

  return (
    <article className={`product-card${isSelected ? " is-selected" : ""}`}>
      <div className="product-card__media" aria-hidden="true">
        <img alt="" src={product.image} />
        {hasDiscount ? (
          <span className="badge">Save {product.discount}%</span>
        ) : null}
      </div>

      <div className="product-card__body">
        <div className="product-card__header">
          <h3>{product.name}</h3>
        </div>

        <p>{product.description}</p>

        <a className="product-card__learn-more" href={product.learnMoreUrl}>
          Learn More
        </a>

        <VariantSelector
          activeVariantId={activeVariant.id}
          onSelectVariant={(variantId) =>
            setActiveVariant(product.id, variantId)
          }
          product={product}
        />

        <div className="product-card__footer">
          <QuantityStepper
            disabled={Boolean(activeVariant.locked)}
            max={activeVariant.maxQuantity ?? Number.POSITIVE_INFINITY}
            min={activeVariant.minQuantity ?? 0}
            onChange={(nextValue) => setQuantity(activeVariant.id, nextValue)}
            value={activeQuantity}
          />
          <div className="product-card__prices">
            {hasDiscount ? (
              <span className="product-card__price--original">
                ${originalPrice.toFixed(2)}
              </span>
            ) : null}
            <span className="product-card__price--sale">
              ${salePrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
