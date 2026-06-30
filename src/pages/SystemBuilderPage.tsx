import { useEffect } from "react";
import BundleBuilder from "../features/bundle-builder/BundleBuilder";
import ReviewPanel from "../features/review-panel/ReviewPanel";
import { hydrateBundleStore } from "../store/bundleStore";

function SystemBuilderPage() {
  useEffect(() => {
    hydrateBundleStore();
  }, []);

  return (
    <main className="system-builder-page">
      <section>
        <BundleBuilder />
      </section>
      <ReviewPanel />
    </main>
  );
}

export default SystemBuilderPage;
