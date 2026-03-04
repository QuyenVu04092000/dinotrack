// File: app/head.tsx
import React from "react";

export default function Head() {
  return (
    <>
      <title>Money Management</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Mobile-first PWA for managing your money." />
      {/* Favicon for desktop browsers */}
      <link rel="icon" href="/icons/icon-48x48.png" sizes="48x48" type="image/png" />
      {/* SVG fallback for browsers that support it */}
    </>
  );
}
