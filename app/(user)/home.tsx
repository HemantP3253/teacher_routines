import {
  AppLinearGradient,
  AppStatusBar,
  CustomText,
  CustomView,
} from "@/components/ui/primitives";
import { useDynamicGreeting } from "@/hooks/useDynamicGreeting";
import { StatusBar, StyleSheet } from "react-native";

const Home = () => {
  const greeting = useDynamicGreeting();

  return (
    <AppLinearGradient style={styles.rootContainer}>
      <AppStatusBar />
      <CustomText type="text" style={styles.headingText}>
        {greeting} {/* Add name for greeting, as well */}
      </CustomText>
      <CustomView style={styles.infoContainer}>
        <CustomText type="text" style={styles.infoText}>
          You have 5 classes today!
        </CustomText>
      </CustomView>
    </AppLinearGradient>
  );
};
const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: StatusBar.currentHeight ?? 0,
    height: "100%",
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  labelText: {
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: "600",
  },
  pressableText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  infoContainer: {},
  infoText: {},
});

export default Home;
