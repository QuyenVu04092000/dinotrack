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
      {/* spinner from https://loading.io/ */}
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </section>
  );
}
