import { useBundleStore } from "../../store/bundleStore";
import { selectIsStepOpen } from "../../store/selectors";

function AccordionStepPanel({
  stepId,
  children,
}: {
  stepId: string;
  children: React.ReactNode;
}) {
  const isOpen = useBundleStore(selectIsStepOpen(stepId));
  return (
    <div className={`accordion-step__panel${isOpen ? " is-open" : ""}`}>
      <div className="accordion-step__panel-inner">
        <div className="accordion-step__content">{children}</div>
      </div>
    </div>
  );
}

export default AccordionStepPanel;
