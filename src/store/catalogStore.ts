import { create } from "zustand";
import type {
  CatalogStep,
  CatalogProduct,
  CatalogReviewExtras,
} from "../types/catalog";

export type CatalogStatus = "idle" | "loading" | "success" | "error";

const ENDPOINT = "/bundle-data.json";

export interface CatalogState {
  steps: CatalogStep[];
  products: CatalogProduct[];
  reviewExtras: CatalogReviewExtras;
  status: CatalogStatus;
  error: string | null;
}

export const useCatalogStore = create<
  CatalogState & {
    loadCatalog: () => Promise<void>;
    getDefaultExpandedStep: () => string;
  }
>((set, get) => ({
  steps: [],
  products: [],
  reviewExtras: {
    shipping: { label: "", price: 0, compareAtPrice: null, icon: "" },
    guarantee: { label: "", icon: "" },
    financing: { label: "", months: 0 },
    checkoutLabel: "",
    saveForLaterLabel: "",
  },
  status: "idle",
  error: null,
  loadCatalog: async () => {
    set({ status: "loading", error: null });
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);
      const data = await res.json();
      set({
        steps: data.steps ?? [],
        products: data.products ?? [],
        reviewExtras: data.reviewExtras ?? get().reviewExtras,
        status: "success",
      });
    } catch (err) {
      set({ status: "error", error: (err as Error).message });
    }
  },
  getDefaultExpandedStep: () => {
    const { steps } = get();
    return steps.find((s) => s.defaultExpanded)?.id ?? steps[0]?.id ?? "";
  },
}));
