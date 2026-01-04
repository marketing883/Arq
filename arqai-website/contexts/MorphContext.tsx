"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type MorphType =
  | "comparison"
  | "roi"
  | "architecture"
  | "case-study"
  | "timeline"
  | "integration"
  | "features"
  | "pricing"
  | null;

const VALID_MORPH_TYPES = ["comparison", "roi", "architecture", "case-study", "timeline", "integration", "features", "pricing"];

interface MorphContextType {
  activeMorph: MorphType;
  setActiveMorph: (type: MorphType) => void;
  clearMorph: () => void;
  morphHistory: MorphType[];
}

const MorphContext = createContext<MorphContextType | undefined>(undefined);

export function MorphProvider({ children }: { children: ReactNode }) {
  const [activeMorph, setActiveMorphState] = useState<MorphType>(null);
  const [morphHistory, setMorphHistory] = useState<MorphType[]>([]);

  const setActiveMorph = useCallback((type: MorphType) => {
    setActiveMorphState(type);
    if (type) {
      setMorphHistory((prev) => [...prev, type]);
    }
  }, []);

  const clearMorph = useCallback(() => {
    setActiveMorphState(null);
  }, []);

  // Listen for morph events from the chat widget
  useEffect(() => {
    const handleMorphEvent = (event: CustomEvent<{ type: string }>) => {
      const morphType = event.detail.type;
      // Only set morph if it's a valid type
      if (morphType && VALID_MORPH_TYPES.includes(morphType)) {
        setActiveMorph(morphType as MorphType);
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
