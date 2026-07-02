import { useEffect, useCallback } from "react";
import { useCatalogStore } from "../store/catalogStore";
import { useBundleStore, hydrateBundleStore } from "../store/bundleStore";
import BundleBuilder from "../features/bundle-builder/BundleBuilder";
import ReviewPanel from "../features/review-panel/ReviewPanel";

function LoadingSkeleton() {
  return (
    <main className="system-builder-page system-builder-page--loading">
      <section aria-busy="true">
        <div className="skeleton-builder" />
      </section>
      <aside className="skeleton-panel" />
    </main>
  );
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <main className="system-builder-page system-builder-page--error">
      <div className="error-card">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={onRetry} type="button">
          Retry
        </button>
      </div>
    </main>
  );
}

function SystemBuilderPage() {
  const status = useCatalogStore((s) => s.status);
  const error = useCatalogStore((s) => s.error);
  const loadCatalog = useCatalogStore((s) => s.loadCatalog);
  const hasHydrated = useBundleStore((s) => s.hasHydrated);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    if (status === "success" && !hasHydrated) {
      hydrateBundleStore();
    }
  }, [status, hasHydrated]);

  const handleRetry = useCallback(() => {
    loadCatalog();
  }, [loadCatalog]);

  if (status === "loading" || !hasHydrated) {
    return <LoadingSkeleton />;
  }

  if (status === "error") {
    return (
      <ErrorState error={error ?? "Unknown error"} onRetry={handleRetry} />
    );
  }

  return (
    <main className="system-builder-page">
      <section className="system-builder-page__main">
        <BundleBuilder />
      </section>
      <ReviewPanel />
    </main>
  );
}

export default SystemBuilderPage;
