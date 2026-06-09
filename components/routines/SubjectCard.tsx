import { AssignmentIcon, ScheduleIcon } from "@/assets/icons";
import { SubjectCardProps } from "@/interfaces/interfaces";
import { calculateFullPeriodTime } from "@/utils/dateUtils";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ThemedText } from "../themed";
import AssignTeacherModal from "./AssignTeacherModal";
import AssignTimeModal from "./AssignTimeModal";

const SubjectCard = ({
  subjectName,
  startTime,
  duration,
  teacherId,
  teacherName,
  onTimeChange,
  onTeacherChange,
}: SubjectCardProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const [visible, setVisible] = useState<{
    timeModal: boolean;
    teacherModal: boolean;
  }>({ timeModal: false, teacherModal: false });

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
        colors={[colors.background, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: colors.border,
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
              : calculateFullPeriodTime(startTime, Number(duration), false)}
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
          <ScheduleIcon
            height={28}
            width={28}
            fillItem={!!(startTime && duration)}
            fill={colors.secondary}
            onPress={() => setVisible((prev) => ({ ...prev, timeModal: true }))}
          />
          <AssignTimeModal
            title="Select Time Schedule"
            visible={visible.timeModal}
            onClose={() =>
              setVisible((prev) => ({ ...prev, timeModal: false }))
            }
            onSubmit={(time, duration) => {
              onTimeChange(time, duration);
              setVisible((prev) => ({ ...prev, timeModal: false }));
            }}
          />
          <AssignmentIcon
            height={28}
            width={28}
            fillItem={!!teacherId}
            fill={colors.secondary}
            onPress={() =>
              setVisible((prev) => ({ ...prev, teacherModal: true }))
            }
          />
          <AssignTeacherModal
            visible={visible.teacherModal}
            onClose={() =>
              setVisible((prev) => ({ ...prev, teacherModal: false }))
            }
            onSelectTeacher={(selectedTeacherId, selectedTeacherName) => {
              onTeacherChange(selectedTeacherId, selectedTeacherName);
              setVisible((prev) => ({ ...prev, teacherModal: false }));
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default SubjectCard;
