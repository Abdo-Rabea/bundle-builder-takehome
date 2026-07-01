import QuantityStepper from "../../components/QuantityStepper/QuantityStepper";
import { useCatalogStore } from "../../store/catalogStore";
import { useBundleStore } from "../../store/bundleStore";
import VariantSelector from "./VariantSelector";

type ProductCardProps = {
  productId: string;
};

function ProductCard({ productId }: ProductCardProps) {
  const setQuantity = useBundleStore((state) => state.setQuantity);
  const setActiveVariant = useBundleStore((state) => state.setActiveVariant);
  const products = useCatalogStore((s) => s.products);
  const product = products.find((entry) => entry.id === productId);
  const activeVariantId = useBundleStore(
    (state) => state.activeVariant[productId] ?? product?.variants[0]?.id ?? "",
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

  return (
    <article className={`product-card${isSelected ? " is-selected" : ""}`}>
      <div className="product-card__media" aria-hidden="true">
        <img alt="" src={activeVariant.image} />
      </div>

      <div className="product-card__body">
        <div className="product-card__header">
          <h3>{product.name}</h3>
          {product.badge ? (
            <span className="badge">{product.badge.label}</span>
          ) : null}
        </div>

        <p>{product.description}</p>

        <VariantSelector
          activeVariantId={activeVariant.id}
          onSelectVariant={(variantId) =>
            setActiveVariant(product.id, variantId)
          }
          product={product}
        />

        <div className="product-card__footer">
          <a href={product.learnMoreUrl}>Learn More</a>
          <QuantityStepper
            disabled={Boolean(activeVariant.locked)}
            max={activeVariant.maxQuantity ?? Number.POSITIVE_INFINITY}
            min={activeVariant.minQuantity ?? 0}
            onChange={(nextValue) => setQuantity(activeVariant.id, nextValue)}
            value={activeQuantity}
          />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
