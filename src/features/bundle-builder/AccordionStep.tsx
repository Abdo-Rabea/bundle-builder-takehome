import { catalog } from "../../services/apiBundleData";
import {
  countSelectedProducts,
  selectProductsByStep,
} from "../../store/selectors";
import { useBundleStore } from "../../store/bundleStore";
import ProductCard from "./ProductCard";

type AccordionStepProps = {
  stepId: string;
};

function AccordionStep({ stepId }: AccordionStepProps) {
  const step = catalog.steps.find((entry) => entry.id === stepId);
  const products = selectProductsByStep(stepId);
  const selectedCount = useBundleStore((state) =>
    countSelectedProducts(stepId, state.quantities),
  );
  const expandedStep = useBundleStore((state) => state.expandedStep);
  const setExpandedStep = useBundleStore((state) => state.setExpandedStep);
  const advanceStep = useBundleStore((state) => state.advanceStep);

  if (!step) {
    return null;
  }

  const isOpen = expandedStep === step.id;

  return (
    <section className="accordion-step">
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

      {isOpen ? (
        <div className="accordion-step__content">
          {products.map((product) => (
            <ProductCard key={product.id} productId={product.id} />
          ))}

          {step.nextLabel ? (
            <button
              className="next-step"
              onClick={() => advanceStep(step.id)}
              type="button"
            >
              {step.nextLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default AccordionStep;
