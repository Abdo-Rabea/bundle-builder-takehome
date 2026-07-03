import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { selectIsStepOpen, selectProductsByStep } from "../../store/selectors";
import { useCatalogStore } from "../../store/catalogStore";
import ProductCard from "./ProductCard";
import AccordionStepHeader from "./AccordionStepHeader";
import type { CatalogStep } from "../../types/catalog";
import NextStepButton from "./NextStepButton";
import AccordionStepPanel from "./AccordionStepPanel";
import { useBundleStore } from "../../store/bundleStore";
const SCROLL_TOP_OFFSET = 50;
const SCROLL_CORRECTION_DELAY_MS = 200;
type AccordionStepProps = {
  step: CatalogStep;
};

function AccordionStep({ step }: AccordionStepProps) {
  const { id: stepId } = step;
  const products = useCatalogStore(useShallow(selectProductsByStep(stepId)));
  const isOpen = useBundleStore(useShallow(selectIsStepOpen(step.id)));

  const stepRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!isOpen || !stepRef.current) {
      return;
    }

    let cancelled = false;

    const scrollStepIntoView = (behavior: ScrollBehavior) => {
      if (cancelled || !stepRef.current) {
        return;
      }

      const top =
        window.scrollY +
        stepRef.current.getBoundingClientRect().top -
        SCROLL_TOP_OFFSET;

      window.scrollTo({
        top: Math.max(0, top),
        behavior,
      });
    };

    // const frameId = window.requestAnimationFrame(() => {
    //   scrollStepIntoView("auto");
    // });

    const correctionTimeout = window.setTimeout(() => {
      scrollStepIntoView("smooth");
    }, SCROLL_CORRECTION_DELAY_MS);

    return () => {
      cancelled = true;
      // window.cancelAnimationFrame(frameId);
      window.clearTimeout(correctionTimeout);
    };
  }, [isOpen]);

  return (
    <section
      className={`accordion-step ${isOpen ? "is-open" : ""}`}
      ref={stepRef}
    >
      <AccordionStepHeader step={step} />

      <AccordionStepPanel stepId={stepId}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        <NextStepButton step={step} />
      </AccordionStepPanel>
    </section>
  );
}

export default AccordionStep;
