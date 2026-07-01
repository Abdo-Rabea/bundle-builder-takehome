import { useCatalogStore } from "../../store/catalogStore";
import AccordionStep from "./AccordionStep";

function BundleBuilder() {
  const steps = useCatalogStore((s) => s.steps);

  return (
    <div className="bundle-builder">
      {steps.map((step) => (
        <AccordionStep key={step.id} step={step} />
      ))}
    </div>
  );
}

export default BundleBuilder;
