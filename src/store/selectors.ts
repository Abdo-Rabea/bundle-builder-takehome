import { catalog } from "../services/apiBundleData";
import {
  getProductForVariant,
  getVariantById,
  useBundleStore,
  type BundleState,
} from "./bundleStore";
import type { ReviewLine, Totals } from "../types/catalog";

// selector factory (now component and store separated)
export const selectIsStepOpen = (stepId: string) => (state: BundleState) =>
  state.expandedStep === stepId;

export function selectSteps() {
  return catalog.steps;
}

export function selectProductsByStep(stepId: string) {
  return catalog.products.filter((product) => product.stepId === stepId);
}

export function countSelectedProducts(
  stepId: string,
  quantities: Record<string, number>,
) {
  return selectProductsByStep(stepId).filter((product) =>
    product.variants.some((variant) => (quantities[variant.id] ?? 0) > 0),
  ).length;
}

export function buildReviewLines(
  quantities: Record<string, number>,
): ReviewLine[] {
  return catalog.products.flatMap((product) =>
    product.variants
      .map((variant) => {
        const quantity = quantities[variant.id] ?? 0;
        if (quantity <= 0) {
          return null;
        }

        const step = catalog.steps.find((entry) => entry.id === product.stepId);
        return {
          productId: product.id,
          productName: product.name,
          stepId: product.stepId,
          reviewCategory: step?.reviewCategory ?? "Accessories",
          variantId: variant.id,
          variantLabel: variant.label,
          quantity,
          unitPrice: variant.price,
          lineTotal: variant.price * quantity,
        } satisfies ReviewLine;
      })
      .filter((line): line is ReviewLine => line !== null),
  );
}

export function selectReviewLines(): ReviewLine[] {
  const state = useBundleStore.getState();

  return buildReviewLines(state.quantities);
}

export function selectTotals(): Totals {
  const lines = selectReviewLines();
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const savings = catalog.products
    .flatMap((product) => product.variants)
    .reduce((sum, variant) => {
      const quantity = useBundleStore.getState().quantities[variant.id] ?? 0;
      const compareAtPrice = variant.compareAtPrice ?? variant.price;
      return sum + Math.max(0, compareAtPrice - variant.price) * quantity;
    }, 0);

  return {
    subtotal,
    savings,
    shipping: catalog.reviewExtras.shipping.price,
    grandTotal: subtotal + catalog.reviewExtras.shipping.price,
  };
}

export function selectProductState(productId: string) {
  const state = useBundleStore.getState();
  const product = catalog.products.find((entry) => entry.id === productId);
  const activeVariantId =
    state.activeVariant[productId] ?? product?.variants[0]?.id ?? "";
  const activeVariant = getVariantById(activeVariantId);

  return {
    product,
    activeVariant,
    activeQuantity: activeVariant
      ? (state.quantities[activeVariant.id] ?? 0)
      : 0,
    isSelected:
      product?.variants.some(
        (variant) => (state.quantities[variant.id] ?? 0) > 0,
      ) ?? false,
  };
}

export function selectProductByVariant(variantId: string) {
  return getProductForVariant(variantId);
}
