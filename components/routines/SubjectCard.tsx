import { AssignmentIcon, ScheduleIcon } from "@/assets/icons";
import { useAppTheme } from "@/contexts/ThemeContext";
import { SubjectData } from "@/interfaces/interfaces";
import { calculateFullPeriodTime } from "@/utils/dateUtils";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ThemedText, ThemedView } from "../themed";
import AssignTeacherModal from "./AssignTeacherModal";
import AssignTimeModal from "./AssignTimeModal";

const SubjectCard = ({
  subjectName,
  onTimeChange,
  onTeacherChange,
  initialData,
}: {
  subjectName: string;
  onTimeChange: (startTime: string, duration: string) => void;
  onTeacherChange: (teacherId: string, teacherName: string) => void;
  initialData?: SubjectData;
}) => {
  const [subjectData, setSubjectData] = useState<SubjectData>(
    initialData || {
      subjectCode: "",
      teacherId: "",
      startTime: "",
      teacherName: "",
      duration: "",
    },
  );

  useEffect(() => {
    if (initialData) setSubjectData(initialData);
  }, [initialData]);

  const { theme } = useAppTheme();
  const colors = theme.colors;
  const [visible, setVisible] = useState<{
    timeModal: boolean;
    teacherModal: boolean;
  }>({ timeModal: false, teacherModal: false });

  return (
    <ThemedView
      style={{
        backgroundColor: colors.base200,
        borderRadius: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 8,
        padding: 8,
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
          {subjectData.startTime === "" || subjectData.duration === ""
            ? "Time not selected"
            : calculateFullPeriodTime(
                subjectData.startTime,
                Number(subjectData.duration),
                false,
              )}
        </ThemedText>

        {/*  Subject Name */}
        <ThemedText style={{ fontWeight: "600", fontSize: 14, opacity: 0.9 }}>
          {subjectName.split(":")[1].trim()}
        </ThemedText>

        {/*  Subject Code */}
        <ThemedText style={{ fontWeight: "400", fontSize: 14, opacity: 0.8 }}>
          {subjectName.split(":")[0].trim()}
        </ThemedText>

        {/* Assigned Status  */}
        <ThemedText
          style={{ fontSize: 12, color: colors.primary, marginTop: 4 }}
        >
          {subjectData?.teacherId !== "" && subjectData?.teacherName !== ""
            ? `Teacher: ${subjectData.teacherName}`
            : "Not assigned"}
        </ThemedText>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0,
          minWidth: 80,
          flexDirection: "row",
        }}
      >
        <ScheduleIcon
          height={28}
          width={28}
          fillItem={
            subjectData?.startTime !== "" && subjectData?.duration !== ""
              ? true
              : false
          }
          fill={colors.secondary}
          onPress={() => setVisible((prev) => ({ ...prev, timeModal: true }))}
        />
        <AssignTimeModal
          title="Select Time Schedule"
          visible={visible.timeModal}
          onClose={() => setVisible((prev) => ({ ...prev, timeModal: false }))}
          onSubmit={(time, duration) => {
            const updatedData: SubjectData = {
              ...subjectData,
              startTime: time,
              duration: duration,
            };

            setSubjectData(updatedData);
            onTimeChange(updatedData.startTime, updatedData.duration);
          }}
        />
        <AssignmentIcon
          height={28}
          width={28}
          fillItem={subjectData?.teacherId !== "" ? true : false}
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
            const updatedData = {
              ...subjectData,
              teacherId: selectedTeacherId,
              teacherName: selectedTeacherName,
            };
            setSubjectData(updatedData);
            onTeacherChange(updatedData.teacherId, updatedData.teacherName);

            setVisible((prev) => ({ ...prev, teacherModal: false }));
          }}
        />
      </View>
    </ThemedView>
  );
};

export default SubjectCard;
