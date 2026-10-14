import { BlurTargetView } from "expo-blur";
import { createContext, ReactNode, RefObject, useContext, useRef } from "react";
import { Platform, View } from "react-native";

type BlurContextValue = {
  targetRef: RefObject<View | null>;
  blurMethod: undefined | "dimezisBlurView" | "dimezisBlurViewSdk31Plus";
};

const BlurContext = createContext<BlurContextValue | null>(null);

export function BlurProvider({ children }: { children: ReactNode }) {
  const targetRef = useRef<View | null>(null);

  const blurMethod =
    Platform.OS !== "android"
      ? undefined
      : Platform.Version >= 31
        ? "dimezisBlurViewSdk31Plus"
        : "dimezisBlurView";

  return (
    <BlurContext.Provider value={{ targetRef, blurMethod }}>
      <BlurTargetView ref={targetRef} style={{ flex: 1 }}>
        {children}
      </BlurTargetView>
    </BlurContext.Provider>
  );
}

export function useBlurContext() {
  const context = useContext(BlurContext);

  if (!context) {
    throw new Error("useBlurContext must be used within BlurProvider");
  }

  return context;
}
