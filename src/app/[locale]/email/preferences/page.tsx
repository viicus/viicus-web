import { Suspense } from "react";
import PreferencesClient from "./PreferencesClient";

export const dynamic = "force-dynamic";

export default function PreferencesPage() {
  return (
    <Suspense fallback={null}>
      <PreferencesClient />
    </Suspense>
  );
}
