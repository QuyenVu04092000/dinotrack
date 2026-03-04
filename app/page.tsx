"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/signin");
  }, []);
  return (
    <section aria-label="App home placeholder">
      <h1 className="text-lg font-semibold">Money Management</h1>
      <p className="mt-2 text-sm text-mutedForeground">Home screen will be implemented based on Figma designs.</p>
    </section>
  );
}
