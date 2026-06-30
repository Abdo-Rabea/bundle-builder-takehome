import bundleData from "../data/bundle-data.json";
import type { CatalogData } from "../types/catalog";

export const catalog = bundleData as CatalogData;

export function getStepById(stepId: string) {
  return catalog.steps.find((step) => step.id === stepId);
}

export function getProductsForStep(stepId: string) {
  return catalog.products.filter((product) => product.stepId === stepId);
}

export function getDefaultExpandedStep() {
  return (
    catalog.steps.find((step) => step.defaultExpanded)?.id ??
    catalog.steps[0]?.id ??
    ""
  );
}
