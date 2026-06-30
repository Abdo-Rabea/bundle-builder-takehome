import { catalog } from "../../services/apiBundleData";
import type { Totals } from "../../types/catalog";

type ReviewSummaryProps = {
  totals: Totals;
  onSave: () => void;
};

function ReviewSummary({ totals, onSave }: ReviewSummaryProps) {
  return (
    <div className="review-summary">
      <div className="review-summary__row">
        <span>{catalog.reviewExtras.shipping.label}</span>
        <span>
          <s>
            $
            {catalog.reviewExtras.shipping.compareAtPrice?.toFixed(2) ?? "0.00"}
          </s>{" "}
          {totals.shipping.toFixed(2)}
        </span>
      </div>
      <div className="review-summary__row">
        <span>{catalog.reviewExtras.guarantee.label}</span>
        <span>Included</span>
      </div>
      <div className="review-summary__row">
        <span>Subtotal</span>
        <span>${totals.subtotal.toFixed(2)}</span>
      </div>
      <div className="review-summary__row review-summary__row--muted">
        <span>Savings</span>
        <span>${totals.savings.toFixed(2)}</span>
      </div>
      <div className="review-summary__row review-summary__row--total">
        <span>Grand total</span>
        <span>${totals.grandTotal.toFixed(2)}</span>
      </div>
      <button onClick={onSave} type="button">
        {catalog.reviewExtras.saveForLaterLabel}
      </button>
    </div>
  );
}

export default ReviewSummary;
