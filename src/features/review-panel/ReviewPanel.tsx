import { useMemo } from "react";
import { catalog } from "../../services/apiBundleData";
import { buildReviewLines } from "../../store/selectors";
import { useBundleStore } from "../../store/bundleStore";
import type { Totals } from "../../types/catalog";
import ReviewLine from "./ReviewLine";
import ReviewSummary from "./ReviewSummary";

function ReviewPanel() {
  const quantities = useBundleStore((state) => state.quantities);
  const saveSystem = useBundleStore((state) => state.saveSystem);
  const lines = useMemo(() => buildReviewLines(quantities), [quantities]);
  const totals: Totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const savings = catalog.products
      .flatMap((product) => product.variants)
      .reduce((sum, variant) => {
        const quantity = quantities[variant.id] ?? 0;
        const compareAtPrice = variant.compareAtPrice ?? variant.price;
        return sum + Math.max(0, compareAtPrice - variant.price) * quantity;
      }, 0);

    return {
      subtotal,
      savings,
      shipping: catalog.reviewExtras.shipping.price,
      grandTotal: subtotal + catalog.reviewExtras.shipping.price,
    };
  }, [lines, quantities]);

  const reviewLinesByCategory = catalog.steps.reduce<
    Record<string, typeof lines>
  >((accumulator, step) => {
    accumulator[step.reviewCategory] = lines.filter(
      (line) => line.reviewCategory === step.reviewCategory,
    );
    return accumulator;
  }, {});

  return (
    <aside className="review-panel">
      <h2>Your security system</h2>

      {catalog.steps.map((step) => {
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
              <p>No items selected.</p>
            )}
          </section>
        );
      })}

      <ReviewSummary onSave={saveSystem} totals={totals} />
    </aside>
  );
}

export default ReviewPanel;
