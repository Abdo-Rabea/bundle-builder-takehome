import QuantityStepper from "../../components/QuantityStepper/QuantityStepper";
import { useBundleStore } from "../../store/bundleStore";
import type { ReviewLine as ReviewLineType } from "../../types/catalog";

type ReviewLineProps = {
  line: ReviewLineType;
};

function ReviewLine({ line }: ReviewLineProps) {
  const setQuantity = useBundleStore((state) => state.setQuantity);

  return (
    <li className="review-line">
      <div className="review-line__details">
        <div>
          <strong>{line.productName}</strong>
          <div className="review-line__variant">{line.variantLabel}</div>
        </div>
        <div className="review-line__prices">
          <span>${line.unitPrice.toFixed(2)} each</span>
          <span>${line.lineTotal.toFixed(2)}</span>
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
    </li>
  );
}

export default ReviewLine;
