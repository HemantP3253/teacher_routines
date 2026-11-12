import { RoutinesFooterComponent, SubjectCard } from "@/components/routines";
import RoutinesHeaderComponent from "@/components/routines/RoutinesHeader/RoutinesHeaderComponent";
import { ThemedLinearGradient, ThemedText } from "@/components/themed";
import { getSubjects } from "@/data/curricula/university/TU/tuHelpers";
import { useAppStore } from "@/store/useAppStore";
import { useProfileStore } from "@/store/useProfileStore";
import {
  AcademicLevel,
  CurriculumSubject,
  UniversityBranch,
  UniversityProgram,
} from "@/types/academic";
import { ActiveSubjectInfo, RoutineFilterData } from "@/types/common";
import { RangeToSubjectTime } from "@/utils/dateUtils";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo, useState } from "react";
import { StatusBar } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const Routines = () => {
  const routineOptions = useAppStore((state) => state.routineOptions);
  const allProfiles = useProfileStore((state) => state.allProfiles);
  const statusMap = useProfileStore((state) => state.statusMap);
  const approvedProfiles = useMemo(
    () =>
      allProfiles.filter((profile) => statusMap.get(profile.id) === "approved"),
    [allProfiles, statusMap],
  );

  const [selectedCurriculumData, setSelectedCurriculumData] =
    useState<RoutineFilterData>({
      program: undefined,
      branch: undefined,
      academicLevel: undefined,
      batchAndSection: undefined,
    });
  const [selectedRoutineId, setSelectedRoutineId] = useState<number>(0);
  const subjectList: CurriculumSubject[] = useMemo(
    () =>
      getSubjects(
        selectedCurriculumData.program?.id || "",
        selectedCurriculumData.branch?.id,
        selectedCurriculumData.academicLevel?.id || "",
      ),
    [
      selectedCurriculumData.program,
      selectedCurriculumData.branch,
      selectedCurriculumData.academicLevel,
    ],
  );

  const [activeSubjects, setActiveSubjects] = useState<ActiveSubjectInfo[]>([]);
  const currentRoutineOption = routineOptions[selectedRoutineId];

  const maxSubjects = currentRoutineOption
    ? (RangeToSubjectTime({
        times: {
          start: currentRoutineOption.startTime,
          end: currentRoutineOption.endTime,
          duration: currentRoutineOption.periodDuration,
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
        setSelectedCurriculumData({
          program: data,
          branch: undefined,
          academicLevel: undefined,
          batchAndSection: undefined,
        });
        setActiveSubjects([]);
        break;
      case "Branch":
        setSelectedCurriculumData((prev) => ({
          ...prev,
          branch: data,
          academicLevel: undefined,
          batchAndSection: undefined,
        }));
        setActiveSubjects([]);
        break;
      case "Academic Level":
        setSelectedCurriculumData((prev) => ({
          ...prev,
          academicLevel: data,
          batchAndSection: undefined,
        }));
        setActiveSubjects([]);
        break;
      case "Batch and Section":
        setSelectedCurriculumData((prev) => ({
          ...prev,
          batchAndSection: data,
        }));
        setActiveSubjects([]);
        break;
      default:
        break;
    }
  };

  const computeCurrentSubjectTimes = useCallback(
    (index: number) => {
      const defaultData = undefined;
      if (!currentRoutineOption) return defaultData;

      const result = RangeToSubjectTime({
        times: {
          start: currentRoutineOption.startTime,
          end: currentRoutineOption.endTime,
          duration: currentRoutineOption.periodDuration,
        },
        index: index,
      });

      return result
        ? { startTime: result.startTime, duration: result.duration }
        : undefined;
    },
    [currentRoutineOption],
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
        ListHeaderComponent={
          <RoutinesHeaderComponent
            selectedProgram={selectedCurriculumData?.program}
            selectedBranch={selectedCurriculumData?.branch}
            selectedAcademicLevel={selectedCurriculumData?.academicLevel}
            selectedBatchAndSection={selectedCurriculumData?.batchAndSection}
            onProgramChange={(program) =>
              updateCurriculumData({ updateType: "Program", data: program })
            }
            onBranchChange={(branch) =>
              updateCurriculumData({ updateType: "Branch", data: branch })
            }
            onAcademicLevelChange={(academicLevel) =>
              updateCurriculumData({
                updateType: "Academic Level",
                data: academicLevel,
              })
            }
            onBatchAndSectionChange={(batchAndSection) =>
              updateCurriculumData({
                updateType: "Batch and Section",
                data: batchAndSection,
              })
            }
            onDynamicRoutineSelect={(index) => setSelectedRoutineId(index)}
          />
        }
        renderItem={renderSubjectCard}
        ListFooterComponent={
          subjectList.length > 0 ? (
            <RoutinesFooterComponent
              selectedRoutineId={selectedRoutineId}
              activeSubjects={activeSubjects}
              routineFilter={selectedCurriculumData}
              subjectInfo={subjectList}
            />
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

export default Routines;
