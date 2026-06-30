import { catalog } from "../../services/apiBundleData";
import AccordionStep from "./AccordionStep";

function BundleBuilder() {
  return (
    <div className="bundle-builder">
      {catalog.steps.map((step) => (
        <AccordionStep key={step.id} step={step} />
      ))}
    </div>
  );
}

export default BundleBuilder;
