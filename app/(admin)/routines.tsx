import {
  RoutinesFooter,
  RoutinesHeader,
  SubjectCard,
} from "@/components/features/routines";
import { AppLinearGradient, CustomText } from "@/components/ui";
import { getSubjects } from "@/data/curricula/university/TU/tuHelpers";
import { useProfileStore } from "@/store/useProfileStore";
import { useRoutineStore } from "@/store/useRoutineStore";
import { CurriculumSubject } from "@/types/academic";
import { ActiveSubjectInfo } from "@/types/routines";
import { changeTimeMode, minutesToHours } from "@/utils/dateUtils";
import { getValidTeachingSlots } from "@/utils/routineUtils";
import { useCallback, useEffect, useMemo } from "react";
import { FlatList, StatusBar } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const EmptyRoutineComponent = () => (
  <CustomText
    style={{
      fontWeight: "600",
      fontSize: 16,
      padding: 4,
      marginHorizontal: 8,
    }}
    type="text"
  >
    Please select program details.
  </CustomText>
);

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

  const timeSlots = getValidTeachingSlots(selectedRoutineOption);
  const maxSubjects = timeSlots.length ?? 0;
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

  const onTeacherChange = useCallback(
    (subjectInfo: ActiveSubjectInfo) => {
      upsertActiveSubjectInfo(subjectInfo);
    },
    [upsertActiveSubjectInfo],
  );

  // TODO: Change this to render using the actual subject index and display an error if the user tries to set user to a subject which isn't in the max subjects range. This is to be done when actually using draggable flatlist.
  const renderSubjectCard = useCallback(
    ({ item, index }: { item: CurriculumSubject; index: number }) => {
      const assignment = activeSubjectsInfo.find(
        (subject) => subject.index === index,
      );

      const teacher = approvedProfiles.find(
        (profile) => profile.id === assignment?.teacherId,
      );

      const teacherInfo =
        assignment && teacher
          ? { teacherId: assignment.teacherId, teacherName: teacher.fullName }
          : undefined;

      const activeIndex = activeSubjectsInfo.findIndex(
        (info) => info.subjectId === item.id,
      );
      const currentTimeSlot =
        activeIndex !== -1 ? timeSlots[activeIndex] : undefined;
      const durationInfo =
        assignment && currentTimeSlot
          ? {
              startTime: changeTimeMode(
                minutesToHours(currentTimeSlot.start),
                "12-hour",
              ),
              duration: currentTimeSlot.duration,
            }
          : undefined;
      const errorInfo = { ...error, showError: !assignment && isLimitReached };

      return (
        <SubjectCard
          subject={item}
          durationInfo={durationInfo}
          teacherInfo={teacherInfo}
          onTeacherChange={(teacherId) =>
            onTeacherChange({
              index: index,
              subjectId: item.id,
              teacherId: teacherId,
            })
          }
          errorInfo={errorInfo}
        />
      );
    },
    [
      activeSubjectsInfo,
      approvedProfiles,
      timeSlots,
      onTeacherChange,
      error,
      isLimitReached,
    ],
  );

  useEffect(() => {
    if (activeSubjectsInfo.length > maxSubjects) {
      trimActiveSubjectsInfo(maxSubjects);
    }
  }, [maxSubjects, activeSubjectsInfo.length, trimActiveSubjectsInfo]);

  return (
    <AppLinearGradient style={StyleSheet.absoluteFillObject}>
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
        ListEmptyComponent={EmptyRoutineComponent}
        ListFooterComponent={RoutinesFooter}
        ListFooterComponentStyle={{ marginBottom: 128 }}
      />
    </AppLinearGradient>
  );
};

export default Routines;
