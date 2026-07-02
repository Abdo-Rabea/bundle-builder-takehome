import type { CatalogProduct } from "../../types/catalog";

type VariantSelectorProps = {
  product: CatalogProduct;
  activeVariantId: string;
  onSelectVariant: (variantId: string) => void;
};

function VariantSelector({
  product,
  activeVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  if (product.variants.length <= 1) {
    return null;
  }

  return (
    <div
      className="variant-row"
      role="list"
      aria-label={`${product.name} variants`}
    >
      {product.variants.map((variant) => (
        <button
          className={`variant-chip${variant.id === activeVariantId ? " is-active" : ""}`}
          key={variant.id}
          onClick={() => onSelectVariant(variant.id)}
          type="button"
        >
          {variant.swatch ? (
            <span
              className="variant-chip__swatch"
              style={{ backgroundColor: variant.swatch }}
            />
          ) : null}
          <img
            src={variant.image}
            alt={variant.label}
            className="variant-chip__image"
          />
          {variant.label}
        </button>
      ))}
    </div>
  );
}

export default VariantSelector;
