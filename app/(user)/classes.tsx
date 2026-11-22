import { ClassCard } from "@/components/features/routines/";
import { AppLinearGradient, AppStatusBar, CustomText } from "@/components/ui";
import { useDynamicGreeting } from "@/hooks/useDynamicGreeting";
import { StatusBar, StyleSheet } from "react-native";

const Classes = () => {
  const greeting = useDynamicGreeting();

  return (
    <AppLinearGradient style={styles.rootContainer}>
      <AppStatusBar />
      <CustomText type="text" style={styles.headingText}>
        {"Today's classes are"}
        {/* TODO: Choose "no classes today, if no classes available" */}
      </CustomText>
      {/* Placeholder */}
      <ClassCard
        class={{ degreeName: "BCA", semester: 4, totalYears: 4 }}
        startTime="09:30"
        subject="Database Management System"
      ></ClassCard>
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
});

export default Classes;
