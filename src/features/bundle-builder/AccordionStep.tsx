import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { selectProductsByStep } from "../../store/selectors";
import { useCatalogStore } from "../../store/catalogStore";
import ProductCard from "./ProductCard";
import AccordionStepHeader from "./AccordionStepHeader";
import type { CatalogStep } from "../../types/catalog";
import NextStepButton from "./NextStepButton";
import AccordionStepPanel from "./AccordionStepPanel";

type AccordionStepProps = {
  step: CatalogStep;
};

function AccordionStep({ step }: AccordionStepProps) {
  const { id: stepId } = step;
  const products = useCatalogStore(useShallow(selectProductsByStep(stepId)));

  // TODO: scroll to the begining of the step when expanded
  const stepRef = useRef<HTMLElement | null>(null);
  // const SCROLL_TOP_OFFSET = 80;
  // const SCROLL_CORRECTION_DELAY_MS = 180;
  // useEffect(() => {
  //   if (!isOpen || !stepRef.current) {
  //     return;
  //   }

  //   let cancelled = false;

  //   const scrollStepIntoView = (behavior: ScrollBehavior) => {
  //     if (cancelled || !stepRef.current) {
  //       return;
  //     }

  //     const top =
  //       window.scrollY +
  //       stepRef.current.getBoundingClientRect().top -
  //       SCROLL_TOP_OFFSET;

  //     window.scrollTo({
  //       top: Math.max(0, top),
  //       behavior,
  //     });
  //   };

  //   const frameId = window.requestAnimationFrame(() => {
  //     scrollStepIntoView("auto");
  //   });

  //   const correctionTimeout = window.setTimeout(() => {
  //     scrollStepIntoView("auto");
  //   }, SCROLL_CORRECTION_DELAY_MS);

  //   return () => {
  //     cancelled = true;
  //     window.cancelAnimationFrame(frameId);
  //     window.clearTimeout(correctionTimeout);
  //   };
  // }, [isOpen]);

  return (
    <section className="accordion-step" ref={stepRef}>
      <AccordionStepHeader step={step} />

      <AccordionStepPanel stepId={stepId}>
        {products.map((product) => (
          <ProductCard key={product.id} productId={product.id} />
        ))}

        <NextStepButton step={step} />
      </AccordionStepPanel>
    </section>
  );
}

export default AccordionStep;
