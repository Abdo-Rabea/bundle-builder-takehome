import type { Totals } from "../../types/catalog";

type ReviewSummaryProps = {
  totals: Totals;
  onSave: () => void;
};

function ReviewSummary({ totals, onSave }: ReviewSummaryProps) {
  return (
    <div className="review-summary">
      <div className="review-summary__guarantee">
        <div className="review-summary__badge">
          <img
            src="/assets/ui/satisfaction-badge.svg"
            alt="Satisfaction Guarantee Badge"
          />
        </div>
        <div className="review-summary__guarantee-content">
          <h4>30-day hassle-free returns</h4>
          <p>
            If you're not totally in love with the product, we will refund you
            100%.
          </p>
        </div>
      </div>

      <div className="review-summary__pricing">
        <div className="review-summary__subtotal">
          <div className="review-summary__monthly">
            <span className="review-summary__monthly-badge">
              as low as $19.19/mo
            </span>
          </div>

          <div className="review-panel__total-row">
            <div className="review-panel__total-prices">
              <span className="review-panel__total-original">
                ${totals.subtotal.toFixed(2)}
              </span>
              <span className="review-panel__total-grand">
                ${totals.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="review-summary__savings">
          Congrats! You're saving ${totals.savings.toFixed(2)} on your security
          bundle!
        </div>

        <button
          className="review-summary__checkout"
          onClick={onSave}
          type="button"
        >
          Checkout
        </button>
        <a
          className="review-summary__save-later"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          Save my system for later
        </a>
      </div>
    </div>
  );
}

export default ReviewSummary;
