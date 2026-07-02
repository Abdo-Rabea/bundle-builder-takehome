import { useMemo } from "react";
import { useCatalogStore } from "../../store/catalogStore";
import { buildReviewLines } from "../../store/selectors";
import { useBundleStore } from "../../store/bundleStore";
import type { Totals } from "../../types/catalog";
import ReviewLine from "./ReviewLine";
import ReviewSummary from "./ReviewSummary";

function ReviewPanel() {
  const quantities = useBundleStore((state) => state.quantities);
  const saveSystem = useBundleStore((state) => state.saveSystem);
  const steps = useCatalogStore((s) => s.steps);
  const products = useCatalogStore((s) => s.products);
  const reviewExtras = useCatalogStore((s) => s.reviewExtras);
  const lines = useMemo(() => buildReviewLines(quantities), [quantities]);
  const totals: Totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const savings = products
      .flatMap((product) =>
        product.variants.map((variant) => ({
          ...variant,
          discount: product.discount,
        })),
      )
      .reduce((sum, variant) => {
        const quantity = quantities[variant.id] ?? 0;
        return sum + ((variant.price * variant.discount) / 100) * quantity;
      }, 0);

    return {
      subtotal,
      savings,
      shipping: reviewExtras.shipping.price,
      grandTotal: subtotal + reviewExtras.shipping.price,
    };
  }, [lines, quantities, products, reviewExtras]);

  const reviewLinesByCategory = steps.reduce<Record<string, typeof lines>>(
    (accumulator, step) => {
      accumulator[step.reviewCategory] = lines.filter(
        (line) => line.reviewCategory === step.reviewCategory,
      );
      return accumulator;
    },
    {},
  );

  const categoryOrder = ["Cameras", "Sensors", "Accessories", "Plan"];
  const orderedSteps = categoryOrder
    .map((cat) => steps.find((s) => s.reviewCategory === cat))
    .filter(Boolean) as typeof steps;

  return (
    <aside className="review-panel">
      <div className="review-panel__layout">
        <div className="review-panel__items">
          <div className="review-panel__header">
            <span className="review-panel__eyebrow">REVIEW</span>
            <h2>Your security system</h2>
            <p>
              Review your personalized protection system designed to keep what
              matters most safe.
            </p>
          </div>

          {orderedSteps.map((step) => {
            const stepLines = reviewLinesByCategory[step.reviewCategory] ?? [];

            return (
              <section className="review-group" key={step.id}>
                <h3>{step.reviewCategory}</h3>
                {stepLines.length > 0 ? (
                  <ul>
                    {stepLines.map((line) => (
                      <ReviewLine key={line.variantId} line={line} />
                    ))}
                  </ul>
                ) : (
                  <p className="review-group__empty">No items selected.</p>
                )}
              </section>
            );
          })}
        </div>

        <div className="review-panel__sidebar">
          <ReviewSummary onSave={saveSystem} totals={totals} />
        </div>
      </div>
    </aside>
  );
}

export default ReviewPanel;
