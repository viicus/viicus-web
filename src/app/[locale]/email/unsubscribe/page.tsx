import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export const dynamic = "force-dynamic";

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeClient />
    </Suspense>
  );
}
