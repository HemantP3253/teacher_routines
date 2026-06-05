import { ThemedStatusBar, ThemedText, ThemedView } from "@/components/themed";
import { getGreeting } from "@/utils/stringUtils";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";

const home = () => {
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);
  return (
    <ThemedView style={styles.rootContainer}>
      <ThemedStatusBar />
      <ThemedText type="baseContent" style={styles.headingText}>
        {greeting} {/* Add name for greeting, as well */}
      </ThemedText>
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="baseContent" style={styles.infoText}>
          You have 5 classes today!
        </ThemedText>
      </ThemedView>
    </ThemedView>
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

export default home;
