import RoutinesFooter from "@/components/routines/RoutinesFooter";
import RoutinesHeader from "@/components/routines/RoutinesHeader";
import SubjectCard from "@/components/routines/SubjectCard";
import { ThemedLinearGradient, ThemedText } from "@/components/themed";
import { getSubjects } from "@/data/curricula/university/TU/tuHelpers";
import { useAppStore } from "@/store/useAppStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useRoutineStore } from "@/store/useRoutineStore";
import {
  AcademicLevel,
  CurriculumSubject,
  UniversityBranch,
  UniversityProgram,
} from "@/types/academic";
import { ActiveSubjectInfo } from "@/types/common";
import { RangeToSubjectTime } from "@/utils/dateUtils";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo, useState } from "react";
import { StatusBar } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const Routines = () => {
  const routineOptions = useAppStore((state) => state.routineOptions);
  const allProfiles = useProfileStore((state) => state.allProfiles);
  const statusMap = useProfileStore((state) => state.statusMap);
  const selectedProgram = useRoutineStore((state) => state.selectedProgram);
  const selectedBranch = useRoutineStore((state) => state.selectedBranch);
  const selectedAcademicLevel = useRoutineStore(
    (state) => state.selectedAcademicLevel,
  );
  const selectedBatchAndSection = useRoutineStore(
    (state) => state.selectedBatchAndSection,
  );
  const activeSubjects = useRoutineStore((state) => state.activeSubjects);
  const setProgram = useRoutineStore((state) => state.setProgram);
  const setBranch = useRoutineStore((state) => state.setBranch);
  const setAcademicLevel = useRoutineStore((state) => state.setAcademicLevel);
  const setBatchAndSection = useRoutineStore(
    (state) => state.setBatchAndSection,
  );
  const selectedRoutineOption = useRoutineStore(
    (state) => state.selectedRoutineOption,
  );
  const setActiveSubjects = useRoutineStore((state) => state.setActiveSubjects);
  const clearRoutine = useRoutineStore((state) => state.clearRoutine);

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

  const isLimitReached = activeSubjects.length >= maxSubjects;

  const error: { title: string; description: string; showError?: boolean } =
    useMemo(
      () => ({
        title: "Subject limit exceeded",
        description: `The selected routine option can only have ${maxSubjects} subjects. Please remove one of the subjects first or select a different routine option.`,
        showError: isLimitReached,
      }),
      [isLimitReached, maxSubjects],
    );

  const updateCurriculumData = ({
    updateType,
    data,
  }:
    | {
        updateType: "Program";
        data: UniversityProgram;
      }
    | {
        updateType: "Branch";
        data: UniversityBranch;
      }
    | {
        updateType: "Academic Level";
        data: AcademicLevel;
      }
    | {
        updateType: "Batch and Section";
        data: string;
      }) => {
    switch (updateType) {
      case "Program":
        setProgram(data);
        clearRoutine({
          branch: true,
          academicLevel: true,
          batchAndSection: true,
          activeSubjects: true,
        });
        break;
      case "Branch":
        setBranch(data);
        clearRoutine({
          academicLevel: true,
          batchAndSection: true,
          activeSubjects: true,
        });
        break;
      case "Academic Level":
        setAcademicLevel(data);
        clearRoutine({
          batchAndSection: true,
          activeSubjects: true,
        });
        break;
      case "Batch and Section":
        setBatchAndSection(data);
        clearRoutine({
          activeSubjects: true,
        });
        break;
      default:
        break;
    }
  };

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
    ({ index, subjectId, teacherId }: ActiveSubjectInfo) => {
      if (
        !subjectList?.some((subject) => subject.id === subjectId) ||
        !approvedProfiles.some((profile) => profile.id === teacherId)
      )
        return;

      setActiveSubjects((prev) => {
        const assignment = { index, subjectId, teacherId };
        const exists = prev.some((item) => item.index === index);

        return exists
          ? prev.map((item) => (item.index === index ? assignment : item))
          : [...prev, assignment];
      });
    },
    [subjectList, approvedProfiles],
  );

  const renderSubjectCard = useCallback(
    ({ item, index }: { item: CurriculumSubject; index: number }) => {
      const assignment = activeSubjects.find(
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
            if (!teacherId) return;

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
      activeSubjects,
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
    if (activeSubjects.length > maxSubjects) {
      setActiveSubjects((prev) =>
        prev.filter((subject) => subject.index < maxSubjects),
      );
    }
  }

  return (
    <ThemedLinearGradient style={StyleSheet.absoluteFillObject}>
      <FlashList
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
