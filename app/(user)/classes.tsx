import {
  ThemedClassCard,
  ThemedLinearGradient,
  ThemedStatusBar,
  ThemedText,
} from "@/components/themed";
import { getGreeting } from "@/utils/stringUtils";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";

const classes = () => {
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);
  return (
    <ThemedLinearGradient style={styles.rootContainer}>
      <ThemedStatusBar />
      <ThemedText type="text" style={styles.headingText}>
        Today's classes are
        {/* Choose "no classes today, if no classes available" */}
      </ThemedText>
      <ThemedClassCard
        class={{ degreeName: "BCA", semester: 4, totalYears: 4 }}
        startTime="09:30"
        subject="Database Management System"
      ></ThemedClassCard>
    </ThemedLinearGradient>
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
});

export default classes;
