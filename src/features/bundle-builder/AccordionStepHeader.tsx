import { useBundleStore } from "../../store/bundleStore";
import { countSelectedProducts, selectIsStepOpen } from "../../store/selectors";
import type { CatalogStep } from "../../types/catalog";

function AccordionStepHeader({ step }: { step: CatalogStep }) {
  const selectedCount = useBundleStore((state) =>
    countSelectedProducts(step.id, state.quantities),
  );
  const setExpandedStep = useBundleStore((state) => state.setExpandedStep);
  const isOpen = useBundleStore(selectIsStepOpen(step.id));

  return (
    <button
      className="accordion-step__header"
      onClick={() => setExpandedStep(step.id)}
      type="button"
    >
      <div>
        <div className="accordion-step__eyebrow">Step {step.stepNumber}</div>
        <h2>{step.title}</h2>
      </div>
      <div className="accordion-step__meta">
        <span>{selectedCount} selected</span>
        <span>{isOpen ? "−" : "+"}</span>
      </div>
    </button>
  );
}

export default AccordionStepHeader;
