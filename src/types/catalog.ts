export type StepSelectionMode = "multi" | "single";

export type CatalogStep = {
  id: string;
  stepNumber: number;
  title: string;
  icon: string;
  reviewCategory: "Cameras" | "Plan" | "Sensors" | "Accessories";
  selectionMode: StepSelectionMode;
  defaultExpanded: boolean;
  nextLabel: string | null;
};

export type CatalogVariant = {
  id: string;
  label: string;
  swatch: string | null;
  image: string;
  price: number;
  initialQuantity: number;
  isDefaultActive?: boolean;
  locked?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
};

export type CatalogProduct = {
  id: string;
  stepId: string;
  name: string;
  description: string;
  learnMoreUrl: string;
  image: string;
  discount: number;
  billingPeriod?: string;
  variants: CatalogVariant[];
};

export type CatalogReviewExtras = {
  shipping: {
    label: string;
    price: number;
    compareAtPrice: number | null;
    icon: string;
  };
  guarantee: {
    label: string;
    icon: string;
  };
  financing: {
    label: string;
    months: number;
  };
  checkoutLabel: string;
  saveForLaterLabel: string;
};

export type CatalogData = {
  _notes?: Record<string, string>;
  steps: CatalogStep[];
  products: CatalogProduct[];
  reviewExtras: CatalogReviewExtras;
};

export type ReviewLine = {
  productId: string;
  productName: string;
  stepId: string;
  reviewCategory: CatalogStep["reviewCategory"];
  variantId: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  billingPeriod?: string;
};

export type Totals = {
  subtotal: number;
  savings: number;
  shipping: number;
  grandTotal: number;
};
