import QuantityStepper from "../../ui/QuantityStepper";
import { useBundleStore } from "../../store/bundleStore";
import { useCatalogStore } from "../../store/catalogStore";
import type { ReviewLine as ReviewLineType } from "../../types/catalog";

type ReviewLineProps = {
  line: ReviewLineType;
};

function ReviewLine({ line }: ReviewLineProps) {
  const setQuantity = useBundleStore((state) => state.setQuantity);
  const product = useCatalogStore((state) =>
    state.products.find((product) => product.id === line.productId),
  );
  const variant = product?.variants.find(
    (variant) => variant.id === line.variantId,
  );
  const previewImage = variant?.image || product?.image;

  const originalTotal = variant
    ? variant.price * line.quantity
    : line.unitPrice * line.quantity;
  const hasDiscount = line.unitPrice < (variant?.price ?? line.unitPrice);
  const suffix = line.billingPeriod ? `/${line.billingPeriod}` : "";

  return (
    <li className="review-line">
      <div className="review-line__details">
        <img src={previewImage} alt={line.productName} />
        <div>
          <span className="review-line__name">{line.productName}</span>
        </div>
      </div>

      <div className="review-line__controls">
        <QuantityStepper
          max={Number.POSITIVE_INFINITY}
          min={0}
          onChange={(nextValue) => setQuantity(line.variantId, nextValue)}
          value={line.quantity}
        />
      </div>

      <div className="review-line__prices">
        {(hasDiscount || line.lineTotal === 0) &&
          originalTotal !== line.lineTotal && (
            <span className="review-line__price--original">
              ${originalTotal.toFixed(2)}
              {suffix}
            </span>
          )}
        {line.lineTotal === 0 ? (
          <span className="review-line__price--free">FREE</span>
        ) : (
          <span className="review-line__price--sale">
            ${line.lineTotal.toFixed(2)}
            {suffix}
          </span>
        )}
      </div>
    </li>
  );
}

export default ReviewLine;
