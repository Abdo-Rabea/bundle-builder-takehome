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
          <div className="review-summary__badge-inner">
            <span className="review-summary__badge-text">100%</span>
            <span className="review-summary__badge-sub">
              Wyze
              <br />
              satisfaction
              <br />
              guarantee
            </span>
          </div>
        </div>
        <div className="review-summary__guarantee-content">
          <h4>30-day hassle-free returns</h4>
          <p>
            If you're not totally in love with the product, we will refund you
            100%.
          </p>
        </div>
      </div>

      <div className="review-summary__shipping">
        <div className="review-summary__shipping-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#eef0f6" />
            <path
              d="M8 12h12v8H8v-8z"
              stroke="#4e2fd2"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M20 14h3l2 3v3h-5v-6z"
              stroke="#4e2fd2"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="12" cy="21" r="1.5" fill="#4e2fd2" />
            <circle cx="22" cy="21" r="1.5" fill="#4e2fd2" />
          </svg>
        </div>
        <div className="review-summary__shipping-details">
          <span className="review-summary__shipping-label">Fast Shipping</span>
        </div>
        <div className="review-summary__shipping-prices">
          <span className="review-summary__shipping-compare">$5.99</span>
          <span className="review-summary__shipping-price">FREE</span>
        </div>
      </div>

      <div className="review-summary__pricing">
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
