import RoutinesFooter from "@/components/routines/RoutinesFooter";
import RoutinesHeader from "@/components/routines/RoutinesHeader";
import SubjectCard from "@/components/routines/SubjectCard";
import { ThemedLinearGradient, ThemedText } from "@/components/themed";
import { getSubjects } from "@/data/curricula/university/TU/tuHelpers";
import { useProfileStore } from "@/store/useProfileStore";
import { useRoutineStore } from "@/store/useRoutineStore";
import { CurriculumSubject } from "@/types/academic";
import { ActiveSubjectInfo } from "@/types/routines";
import { RangeToSubjectTime } from "@/utils/dateUtils";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StatusBar } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const Routines = () => {
  const allProfiles = useProfileStore((state) => state.allProfiles);
  const statusMap = useProfileStore((state) => state.statusMap);
  const selectedProgram = useRoutineStore((state) => state.selectedProgram);
  const selectedBranch = useRoutineStore((state) => state.selectedBranch);
  const selectedAcademicLevel = useRoutineStore(
    (state) => state.selectedAcademicLevel,
  );
  const activeSubjectsInfo = useRoutineStore(
    (state) => state.activeSubjectsInfo,
  );
  const selectedRoutineOption = useRoutineStore(
    (state) => state.selectedRoutineOption,
  );
  const trimActiveSubjectsInfo = useRoutineStore(
    (state) => state.trimActiveSubjectsInfo,
  );
  const upsertActiveSubjectInfo = useRoutineStore(
    (state) => state.upsertActiveSubjectInfo,
  );

  const approvedProfiles = useMemo(
    () =>
      allProfiles.filter((profile) => statusMap.get(profile.id) === "approved"),
    [allProfiles, statusMap],
  );

  const subjectList: CurriculumSubject[] = useMemo(
    () =>
      getSubjects(
        selectedProgram?.id || "",
        selectedBranch?.id,
        selectedAcademicLevel?.id || "",
      ),
    [selectedProgram?.id, selectedBranch?.id, selectedAcademicLevel?.id],
  );

  const maxSubjects = selectedRoutineOption
    ? (RangeToSubjectTime({
        times: {
          start: selectedRoutineOption.startTime,
          end: selectedRoutineOption.endTime,
          duration: selectedRoutineOption.periodDuration,
        },
        index: 0,
      })?.totalSubjects ?? 0)
    : 0;

  const isLimitReached = activeSubjectsInfo.length >= maxSubjects;

  const error: { title: string; description: string; showError?: boolean } =
    useMemo(
      () => ({
        title: "Subject limit exceeded",
        description: `The selected routine option can only have ${maxSubjects} subjects. Please remove one of the subjects first or select a different routine option.`,
        showError: isLimitReached,
      }),
      [isLimitReached, maxSubjects],
    );

  const computeCurrentSubjectTimes = useCallback(
    (index: number) => {
      const defaultData = undefined;
      if (!selectedRoutineOption) return defaultData;

      const result = RangeToSubjectTime({
        times: {
          start: selectedRoutineOption.startTime,
          end: selectedRoutineOption.endTime,
          duration: selectedRoutineOption.periodDuration,
        },
        index: index,
      });

      return result
        ? { startTime: result.startTime, duration: result.duration }
        : undefined;
    },
    [selectedRoutineOption],
  );

  const onTeacherChange = useCallback(
    (subjectInfo: ActiveSubjectInfo) => {
      upsertActiveSubjectInfo(subjectInfo);
    },
    [upsertActiveSubjectInfo],
  );

  const renderSubjectCard = useCallback(
    ({ item, index }: { item: CurriculumSubject; index: number }) => {
      const assignment = activeSubjectsInfo.find(
        (subject) => subject.index === index,
      );

      const teacher = approvedProfiles.find(
        (profile) => profile.id === assignment?.teacherId,
      );

      return (
        <SubjectCard
          subject={item}
          durationInfo={
            assignment ? computeCurrentSubjectTimes(index) : undefined
          }
          teacherInfo={
            assignment
              ? {
                  teacherId: assignment.teacherId,
                  teacherName: teacher?.fullName ?? "",
                }
              : undefined
          }
          onTeacherChange={(teacherId) => {
            onTeacherChange({
              index: index,
              subjectId: item.id,
              teacherId: teacherId,
            });
          }}
          errorInfo={{
            ...error,
            showError: !assignment && isLimitReached,
          }}
        />
      );
    },
    [
      activeSubjectsInfo,
      approvedProfiles,
      computeCurrentSubjectTimes,
      onTeacherChange,
      error,
      isLimitReached,
    ],
  );

  const [prevMaxSubjects, setPrevMaxSubjects] = useState<number>(maxSubjects);

  if (maxSubjects !== prevMaxSubjects) {
    setPrevMaxSubjects(maxSubjects);
    trimActiveSubjectsInfo(maxSubjects);
  }

  return (
    <ThemedLinearGradient style={StyleSheet.absoluteFillObject}>
      <FlatList
        data={subjectList}
        style={{
          flex: 1,
          backgroundColor: "transparent",
          paddingTop: StatusBar.currentHeight,
        }}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={RoutinesHeader}
        renderItem={renderSubjectCard}
        ListEmptyComponent={
          <ThemedText
            style={{
              fontWeight: "600",
              fontSize: 16,
              padding: 4,
              marginHorizontal: 8,
            }}
            type="text"
          >
            Please select program details.
          </ThemedText>
        }
        ListFooterComponent={RoutinesFooter}
        ListFooterComponentStyle={{ marginBottom: 128 }}
      />
    </ThemedLinearGradient>
  );
};

export default Routines;
