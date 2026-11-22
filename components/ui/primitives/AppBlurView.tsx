import { BlurView, type BlurViewProps } from "expo-blur";
import { Platform } from "react-native";

const AppBlurView = (props: BlurViewProps) => {
  const blurMethod =
    Platform.OS === "android"
      ? Platform.Version >= 31
        ? "dimezisBlurViewSdk31Plus"
        : "dimezisBlurView"
      : undefined;

  return <BlurView {...props} blurMethod={blurMethod} />;
};

export default AppBlurView;
