import { AssignmentIcon } from "@/assets/icons";
import { SubjectCardProps } from "@/interfaces/interfaces";
import { calculateFullPeriodTime } from "@/utils/dateUtils";
import { useState } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ThemedAlertWindow, ThemedLinearGradient, ThemedText } from "../themed";
import AssignTeacherModal from "./AssignTeacherModal";

const SubjectCard = ({
  subject,
  durationInfo,
  teacherInfo,
  onTeacherChange,
  errorInfo,
}: SubjectCardProps) => {
  const { colors } = useUnistyles().theme;
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <View style={styles.rootView}>
      {/* Gradient View for the subtle background in the card */}
      <ThemedLinearGradient
        type="surface"
        end={{ x: 0, y: 1 }}
        style={styles.cardContainer}
      >
        {/* Left column container (Subject info container) */}
        <View>
          {/* Subject Time */}
          <ThemedText style={styles.timeContainer}>
            {!durationInfo
              ? "Time not selected"
              : calculateFullPeriodTime(
                  durationInfo.startTime,
                  Number(durationInfo.duration),
                )}
          </ThemedText>

          {/*  Subject Name */}
          <ThemedText style={styles.titleText}>{subject.name}</ThemedText>

          {/*  Subject Code */}
          <ThemedText style={styles.codeText}>{subject.code}</ThemedText>

          {/* Assigned Status  */}
          <ThemedText style={styles.teacherAssignedText}>
            {teacherInfo?.teacherId
              ? `Teacher: ${teacherInfo?.teacherName}`
              : "Not assigned"}
          </ThemedText>
        </View>

        {/* Icon for selecting teachers */}
        <AssignmentIcon
          height={32}
          width={32}
          fillItem={!!teacherInfo}
          fill={colors.secondary}
          style={styles.icon}
          onPress={() => setVisible(true)}
        />

        {/* If error is shown, then the error modal appears, otherwise assign teacher modal appears */}
        {errorInfo && errorInfo.showError ? (
          <ThemedAlertWindow
            title={errorInfo.title}
            description={errorInfo?.description || ""}
            visible={visible}
            onClose={() => setVisible(false)}
            onConfirm={() => setVisible(false)}
          />
        ) : (
          <AssignTeacherModal
            visible={visible}
            onClose={() => setVisible(false)}
            onSelectTeacher={(id, name) => {
              onTeacherChange(id, name);
              setVisible(false);
            }}
          />
        )}
      </ThemedLinearGradient>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  rootView: {
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    elevation: 2,
    shadowColor: theme.colors.border,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: "transparent",
  },
  cardContainer: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderMuted,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  timeContainer: {
    fontWeight: "bold",
    fontSize: 16,
    color: theme.colors.primary,
  },
  titleText: { fontWeight: "600", fontSize: 14, opacity: 0.9 },
  codeText: { fontWeight: "400", fontSize: 14, opacity: 0.8 },
  teacherAssignedText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
  },
  icon: { alignSelf: "center", margin: theme.spacing.lg },
}));

export default SubjectCard;
