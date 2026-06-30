import { create } from "zustand";
import { catalog, getDefaultExpandedStep } from "../services/apiBundleData";
import type { CatalogProduct, CatalogVariant } from "../types/catalog";

type BundleSnapshot = {
  quantities: Record<string, number>;
  activeVariant: Record<string, string>;
  selectedPlanId: string | null;
  expandedStep: string | null;
};

export type BundleState = BundleSnapshot & {
  hasHydrated: boolean;
  setQuantity: (variantId: string, quantity: number) => void;
  setActiveVariant: (productId: string, variantId: string) => void;
  setExpandedStep: (stepId: string) => void;
  advanceStep: (stepNumber: number) => void;
  saveSystem: () => void;
  resetToDefaults: () => void;
};

const storageKey = "bundle-builder-state";

function buildDefaultSnapshot(): BundleSnapshot {
  const quantities: Record<string, number> = {};
  const activeVariant: Record<string, string> = {};
  let selectedPlanId: string | null = null;

  catalog.products.forEach((product) => {
    const defaultVariant =
      product.variants.find((variant) => variant.isDefaultActive) ??
      product.variants[0];

    if (defaultVariant) {
      activeVariant[product.id] = defaultVariant.id;
    }

    product.variants.forEach((variant) => {
      quantities[variant.id] = variant.initialQuantity;
      if (product.stepId === "plan" && variant.initialQuantity > 0) {
        selectedPlanId = product.id;
      }
    });
  });

  return {
    quantities,
    activeVariant,
    selectedPlanId,
    expandedStep: getDefaultExpandedStep(),
  };
}

function readSavedSnapshot(): BundleSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as BundleSnapshot;
  } catch {
    return null;
  }
}

function getProductByVariantId(variantId: string) {
  return catalog.products.find((product) =>
    product.variants.some((variant) => variant.id === variantId),
  );
}

function setVariantQuantitySnapshot(
  state: BundleState,
  variantId: string,
  nextQuantity: number,
  product?: CatalogProduct,
) {
  const nextQuantities = { ...state.quantities, [variantId]: nextQuantity };

  if (product?.stepId === "plan" && nextQuantity > 0) {
    product.variants.forEach((variant) => {
      nextQuantities[variant.id] = variant.id === variantId ? nextQuantity : 0;
    });
  }

  return nextQuantities;
}

const defaultSnapshot = buildDefaultSnapshot();
const initialSnapshot = readSavedSnapshot() ?? defaultSnapshot;

export const useBundleStore = create<BundleState>((set, get) => ({
  ...initialSnapshot,
  hasHydrated: false,
  setQuantity: (variantId, quantity) => {
    set((state) => {
      const product = getProductByVariantId(variantId);
      const variant = product?.variants.find((entry) => entry.id === variantId);

      if (variant?.locked) {
        return state;
      }

      const clampedQuantity = Math.max(0, quantity);
      const quantities = setVariantQuantitySnapshot(
        state,
        variantId,
        clampedQuantity,
        product,
      );
      const selectedPlanId =
        product?.stepId === "plan" && clampedQuantity > 0
          ? product.id
          : state.selectedPlanId;

      return {
        ...state,
        quantities,
        selectedPlanId,
      };
    });
  },
  setActiveVariant: (productId, variantId) => {
    set((state) => ({
      ...state,
      activeVariant: {
        ...state.activeVariant,
        [productId]: variantId,
      },
    }));
  },
  setExpandedStep: (stepId) => {
    set((state) => ({
      ...state,
      expandedStep: stepId === state.expandedStep ? null : stepId,
    }));
  },
  advanceStep: (stepNumber) => {
    const nextStep = catalog.steps[stepNumber];

    if (!nextStep) {
      return;
    }

    set((state) => ({
      ...state,
      expandedStep: nextStep.id,
    }));
  },
  saveSystem: () => {
    if (typeof window === "undefined") {
      return;
    }

    const snapshot = get();
    const payload: BundleSnapshot = {
      quantities: snapshot.quantities,
      activeVariant: snapshot.activeVariant,
      selectedPlanId: snapshot.selectedPlanId,
      expandedStep: snapshot.expandedStep,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  },
  resetToDefaults: () => {
    set(() => ({
      ...buildDefaultSnapshot(),
      hasHydrated: true,
    }));
  },
}));

export function hydrateBundleStore() {
  if (typeof window === "undefined") {
    return;
  }

  const savedSnapshot = readSavedSnapshot();
  if (savedSnapshot) {
    useBundleStore.setState({ ...savedSnapshot, hasHydrated: true });
    return;
  }

  useBundleStore.setState({ ...defaultSnapshot, hasHydrated: true });
}

export function getVariantById(variantId: string): CatalogVariant | undefined {
  return catalog.products
    .flatMap((product) => product.variants)
    .find((variant) => variant.id === variantId);
}

export function getProductForVariant(variantId: string) {
  return getProductByVariantId(variantId);
}
