import { RoutinesFooterComponent, SubjectCard } from "@/components/routines";
import RoutinesHeaderComponent from "@/components/routines/RoutinesHeaderComponent";
import { ThemedLinearGradient, ThemedText } from "@/components/themed";
import { useApp } from "@/contexts/AppContext";
import { useUserSearch } from "@/contexts/UserSearchContext";
import { getSubjects } from "@/data/curricula/university/TU/tuHelpers";
import { RoutineData } from "@/interfaces/interfaces";
import { CurriculumSubject } from "@/types/academic";
import { RangeToSubjectTime } from "@/utils/dateUtils";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StatusBar } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type ActiveSubjectInfo = {
  index: number;
  subjectId: string;
  teacherId: string;
};

const routines = () => {
  const { users } = useUserSearch();
  const { settings } = useApp();

  const [selectedCurriculumData, setSelectedCurriculumData] =
    useState<RoutineData>({
      program: undefined,
      branch: undefined,
      academicLevel: undefined,
      batchAndSectionId: undefined,
    });
  const [selectedRoutineId, setSelectedRoutineId] = useState<number>(0);
  const subjectList = getSubjects(
    selectedCurriculumData.program?.id || "",
    selectedCurriculumData.branch?.id,
    selectedCurriculumData.academicLevel?.id || "",
  );

  const [activeSubjects, setActiveSubjects] = useState<ActiveSubjectInfo[]>([]);
  const currentRoutineOption = settings.routineTimeOptions[selectedRoutineId];

  const maxSubjects = currentRoutineOption
    ? (RangeToSubjectTime({
        times: {
          start: currentRoutineOption.startTime,
          end: currentRoutineOption.endTime,
          duration: currentRoutineOption.duration,
        },
        index: 0,
      })?.totalSubjects ?? 0)
    : 0;

  const isLimitReached = activeSubjects.length >= maxSubjects;

  const error: { title: string; description: string; showError?: boolean } = {
    title: "Subject limit exceeded",
    description: `The selected routine option can only have ${maxSubjects} subjects. Please remove one of the subjects first or select a different routine option.`,
    showError: isLimitReached,
  };

  const updateCurriculumData = (
    updateType: "Program" | "Branch" | "Academic Level" | "Batch and Section",
    data: any,
  ) => {
    switch (updateType) {
      case "Program":
        setSelectedCurriculumData({
          program: data,
          branch: undefined,
          academicLevel: undefined,
          batchAndSectionId: undefined,
        });
        setActiveSubjects([]);
        break;
      case "Branch":
        setSelectedCurriculumData((prev) => ({
          ...prev,
          branch: data,
          academicLevel: undefined,
          batchAndSectionId: undefined,
        }));
        setActiveSubjects([]);
        break;
      case "Academic Level":
        setSelectedCurriculumData((prev) => ({
          ...prev,
          academicLevel: data,
          batchAndSectionId: undefined,
        }));
        setActiveSubjects([]);
        break;
      case "Batch and Section":
        setActiveSubjects([]);
        break;
      default:
        break;
    }
  };

  const computeCurrentSubjectTimes = (index: number) => {
    const defaultData = undefined;
    if (!currentRoutineOption) return defaultData;

    const result = RangeToSubjectTime({
      times: {
        start: currentRoutineOption.startTime,
        end: currentRoutineOption.endTime,
        duration: currentRoutineOption.duration,
      },
      index: index,
    });

    return result
      ? { startTime: result.startTime, duration: result.duration }
      : undefined;
  };

  const onTeacherChange = ({
    index,
    subjectId,
    teacherId,
  }: ActiveSubjectInfo) => {
    if (
      !subjectList?.some((subject) => subject.id === subjectId) ||
      !users.approved.some((user) => user.profile_id === teacherId)
    )
      return;

    setActiveSubjects((prev) => {
      const assignment = { index, subjectId, teacherId };
      const exists = prev.some((item) => item.index === index);

      return exists
        ? prev.map((item) => (item.index === index ? assignment : item))
        : [...prev, assignment];
    });
  };

  const renderSubjectCard = useCallback(
    ({ item, index }: { item: CurriculumSubject; index: number }) => {
      const assignment = activeSubjects.find(
        (subject) => subject.index === index,
      );

      const teacher = users.approved.find(
        (user) => user.profile_id === assignment?.teacherId,
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
                  teacherName: teacher?.profile.full_name ?? "",
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
      users.approved,
      computeCurrentSubjectTimes,
      onTeacherChange,
      error,
      isLimitReached,
    ],
  );

  useEffect(() => {
    setActiveSubjects((prev) =>
      prev.filter((subject) => subject.index < maxSubjects),
    );
  }, [maxSubjects]);

  return (
    <ThemedLinearGradient style={StyleSheet.absoluteFillObject}>
      <FlatList
        data={subjectList}
        style={{
          flex: 1,
          backgroundColor: "transparent",
          paddingTop: StatusBar.currentHeight,
        }}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <RoutinesHeaderComponent
            selectedProgram={selectedCurriculumData?.program}
            selectedBranch={selectedCurriculumData?.branch}
            selectedAcademicLevel={selectedCurriculumData?.academicLevel}
            selectedBatchAndSectionId={
              selectedCurriculumData?.batchAndSectionId
            }
            onProgramChange={(program) =>
              updateCurriculumData("Program", program)
            }
            onBranchChange={(branch) => updateCurriculumData("Branch", branch)}
            onAcademicLevelChange={(academicLevel) =>
              updateCurriculumData("Academic Level", academicLevel)
            }
            // Need to change this
            onBatchAndSectionChange={(program) =>
              updateCurriculumData("Batch and Section", program)
            }
            onDynamicRoutineSelect={(index) => setSelectedRoutineId(index)}
          />
        }
        renderItem={renderSubjectCard}
        ListFooterComponent={
          subjectList.length > 0 ? (
            <RoutinesFooterComponent />
          ) : (
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
          )
        }
        ListFooterComponentStyle={{ marginBottom: 128 }}
      />
    </ThemedLinearGradient>
  );
};

export default routines;
