import { useBundleStore } from "../../store/bundleStore";
import type { CatalogStep } from "../../types/catalog";

function NextStepButton({ step }: { step: CatalogStep }) {
  const advanceStep = useBundleStore((state) => state.advanceStep);

  return (
    step.nextLabel && (
      <div className="next-step">
        <button onClick={() => advanceStep(step.stepNumber)} type="button">
          {step.nextLabel}
        </button>
      </div>
    )
  );
}

export default NextStepButton;
