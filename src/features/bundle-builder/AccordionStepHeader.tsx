import { useBundleStore } from "../../store/bundleStore";
import { useCatalogStore } from "../../store/catalogStore";
import { countSelectedProducts, selectIsStepOpen } from "../../store/selectors";
import type { CatalogStep } from "../../types/catalog";
import livestreamIcon from "../../assets/livestream-icon.svg";
function AccordionStepHeader({ step }: { step: CatalogStep }) {
  const selectedCount = useBundleStore((state) =>
    countSelectedProducts(step.id, state.quantities),
  );
  const setExpandedStep = useBundleStore((state) => state.setExpandedStep);
  const isOpen = useBundleStore(selectIsStepOpen(step.id));
  const totalSteps = useCatalogStore((state) => state.steps.length);
  return (
    <button
      className={`accordion-step__header ${isOpen ? "is-open" : ""}`}
      onClick={() => setExpandedStep(step.id)}
      type="button"
    >
      <div className="accordion-step__eyebrow">
        Step {step.stepNumber} of {totalSteps}
      </div>
      <div className="accordion-step__header-content">
        <div className="accordion-step__title">
          {/* i have livestream-icon.svg into the assets and want to render it here how to do it
          
          */}
          <img
            src={step.icon}
            alt={step.title}
            className="accordion-step__icon"
          />
          <h2>{step.title}</h2>
        </div>
        <div className="accordion-step__meta">
          <span>{selectedCount} selected</span>
          <span className="accordion-step__arrow">
            {isOpen ? "\u25B2" : "\u25BC"}
          </span>
        </div>
      </div>
    </button>
  );
}

export default AccordionStepHeader;
