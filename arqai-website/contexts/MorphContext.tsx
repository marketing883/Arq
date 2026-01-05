"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CardCustomization } from "@/lib/chat/types";

export type MorphType =
  | "comparison"
  | "roi"
  | "architecture"
  | "case-study"
  | "casestudy"
  | "timeline"
  | "integration"
  | "features"
  | "pricing"
  | null;

const VALID_MORPH_TYPES = [
  "comparison",
  "roi",
  "architecture",
  "case-study",
  "casestudy",
  "timeline",
  "integration",
  "features",
  "pricing",
];

interface MorphContextType {
  activeMorph: MorphType;
  customizations: CardCustomization | null;
  setActiveMorph: (type: MorphType, customizations?: CardCustomization) => void;
  clearMorph: () => void;
  morphHistory: MorphType[];
}

const MorphContext = createContext<MorphContextType | undefined>(undefined);

export function MorphProvider({ children }: { children: ReactNode }) {
  const [activeMorph, setActiveMorphState] = useState<MorphType>(null);
  const [customizations, setCustomizations] = useState<CardCustomization | null>(null);
  const [morphHistory, setMorphHistory] = useState<MorphType[]>([]);

  const setActiveMorph = useCallback((type: MorphType, cardCustomizations?: CardCustomization) => {
    setActiveMorphState(type);
    setCustomizations(cardCustomizations || null);
    if (type) {
      setMorphHistory((prev) => [...prev, type]);
    }
  }, []);

  const clearMorph = useCallback(() => {
    setActiveMorphState(null);
    setCustomizations(null);
  }, []);

  // Listen for morph events from the chat widget
  useEffect(() => {
    const handleMorphEvent = (event: CustomEvent<{ type: string; customizations?: CardCustomization }>) => {
      const morphType = event.detail.type;
      const morphCustomizations = event.detail.customizations;

      // Normalize type (case-study vs casestudy)
      const normalizedType = morphType === "case-study" ? "casestudy" : morphType;

      // Only set morph if it's a valid type
      if (normalizedType && VALID_MORPH_TYPES.includes(normalizedType)) {
        setActiveMorph(normalizedType as MorphType, morphCustomizations);
      } else {
        console.warn(`Invalid morph type received: ${morphType}`);
      }
    };

    window.addEventListener("arqai:morph", handleMorphEvent as EventListener);
    return () => {
      window.removeEventListener("arqai:morph", handleMorphEvent as EventListener);
    };
  }, [setActiveMorph]);

  return (
    <MorphContext.Provider
      value={{
        activeMorph,
        customizations,
        setActiveMorph,
        clearMorph,
        morphHistory,
      }}
    >
      {children}
    </MorphContext.Provider>
  );
}

export function useMorph() {
  const context = useContext(MorphContext);
  if (context === undefined) {
    throw new Error("useMorph must be used within a MorphProvider");
  }
  return context;
}
