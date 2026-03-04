"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { FooterContextType } from "app/types/context";

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export function FooterProvider({ children }: { children: ReactNode }) {
  const [isFooterVisible, setFooterVisible] = useState(true);

  return <FooterContext.Provider value={{ isFooterVisible, setFooterVisible }}>{children}</FooterContext.Provider>;
}

export function useFooter() {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error("useFooter must be used within a FooterProvider");
  }
  return context;
}
