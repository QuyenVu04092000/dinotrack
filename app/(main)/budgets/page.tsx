"use client";

import React, { Suspense } from "react";
import ListBudgets from "app/components/budgets/ListBudgets";

export default function BudgetsPage() {
  // ListBudgets reads ?month via useSearchParams, which needs a Suspense boundary in static export
  return (
    <Suspense fallback={null}>
      <ListBudgets />
    </Suspense>
  );
}
