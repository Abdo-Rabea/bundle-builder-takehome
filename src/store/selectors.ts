import { useCatalogStore, type CatalogState } from "./catalogStore";
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

export const selectProductsByStep = (stepId: string) => (state: CatalogState) =>
  state.products.filter((product) => product.stepId === stepId);

export function selectProductsByStepOLDV(stepId: string) {
  return useCatalogStore
    .getState()
    .products.filter((product) => product.stepId === stepId);
}

export function countSelectedProducts(
  stepId: string,
  quantities: Record<string, number>,
) {
  return selectProductsByStepOLDV(stepId).filter((product) =>
    product.variants.some((variant) => (quantities[variant.id] ?? 0) > 0),
  ).length;
}

export function buildReviewLines(
  quantities: Record<string, number>,
): ReviewLine[] {
  const { products, steps } = useCatalogStore.getState();
  return products.flatMap((product) =>
    product.variants
      .map((variant) => {
        const quantity = quantities[variant.id] ?? 0;
        if (quantity <= 0) {
          return null;
        }

        const step = steps.find((entry) => entry.id === product.stepId);
        const unitPrice = variant.price * (1 - product.discount / 100);
        return {
          productId: product.id,
          productName: product.name,
          stepId: product.stepId,
          reviewCategory: step?.reviewCategory ?? "Accessories",
          variantId: variant.id,
          variantLabel: variant.label,
          quantity,
          unitPrice,
          lineTotal: unitPrice * quantity,
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
  const { products, reviewExtras } = useCatalogStore.getState();
  const savings = products
    .flatMap((product) =>
      product.variants.map((variant) => ({ ...variant, discount: product.discount })),
    )
    .reduce((sum, variant) => {
      const quantity = useBundleStore.getState().quantities[variant.id] ?? 0;
      return sum + (variant.price * variant.discount / 100) * quantity;
    }, 0);

  return {
    subtotal,
    savings,
    shipping: reviewExtras.shipping.price,
    grandTotal: subtotal + reviewExtras.shipping.price,
  };
}

export function selectProductState(productId: string) {
  const state = useBundleStore.getState();
  const product = useCatalogStore
    .getState()
    .products.find((entry) => entry.id === productId);
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
