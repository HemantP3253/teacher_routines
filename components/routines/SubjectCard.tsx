import { AssignmentIcon } from "@/assets/icons";
import { SubjectCardProps } from "@/interfaces/interfaces";
import { calculateFullPeriodTime } from "@/utils/dateUtils";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ThemedAlertWindow, ThemedText } from "../themed";
import AssignTeacherModal from "./AssignTeacherModal";

const SubjectCard = ({
  subjectName,
  startTime,
  duration,
  teacherId,
  teacherName,
  onTeacherChange,
  errorInfo,
}: SubjectCardProps) => {
  console.log("SubjectCard props", {
    subject: subjectName,
    startTime: startTime,
    duration: duration,
  });

  const { theme } = useUnistyles();
  const colors = theme.colors;

  const [visible, setVisible] = useState<boolean>(false);

  const nameSegments = subjectName.includes(":")
    ? subjectName.split(":")
    : [subjectName, ""];
  const courseCode = nameSegments[0].trim();
  const courseTitle = nameSegments[1].trim() || courseCode;

  return (
    <View
      style={{
        marginVertical: theme.spacing.xs,
        marginHorizontal: theme.spacing.md,
        borderRadius: theme.radius.md,
        elevation: 2,
        shadowColor: colors.border,
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        backgroundColor: "transparent",
      }}
    >
      <LinearGradient
        colors={[colors.surface, colors.surfaceElevated]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: colors.borderMuted,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 12,
        }}
      >
        <View>
          {/* Subject Time */}
          <ThemedText
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: colors.primary,
            }}
          >
            {!startTime || !duration
              ? "Time not selected"
              : calculateFullPeriodTime(startTime, Number(duration))}
          </ThemedText>

          {/*  Subject Name */}
          <ThemedText style={{ fontWeight: "600", fontSize: 14, opacity: 0.9 }}>
            {courseTitle}
          </ThemedText>

          {/*  Subject Code */}
          <ThemedText style={{ fontWeight: "400", fontSize: 14, opacity: 0.8 }}>
            {courseCode}
          </ThemedText>

          {/* Assigned Status  */}
          <ThemedText
            style={{ fontSize: 12, color: colors.primary, marginTop: 4 }}
          >
            {teacherId !== "" && teacherName !== ""
              ? `Teacher: ${teacherName}`
              : "Not assigned"}
          </ThemedText>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
            minWidth: 80,
            flexDirection: "row",
          }}
        >
          <AssignmentIcon
            height={28}
            width={28}
            fillItem={!!teacherId}
            fill={colors.secondary}
            onPress={() => {
              setVisible(true);
              console.log(errorInfo);
            }}
          />
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
              onSelectTeacher={(selectedTeacherId, selectedTeacherName) => {
                onTeacherChange(selectedTeacherId, selectedTeacherName);
                setVisible(false);
              }}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default SubjectCard;
