import { RoutinesFooterComponent, SubjectCard } from "@/components/routines";
import RoutinesHeaderComponent from "@/components/routines/RoutinesHeaderComponent";
import { ThemedLinearGradient, ThemedText } from "@/components/themed";
import { useApp } from "@/contexts/AppContext";
import { getCurriculumData, searchByDegreeName } from "@/data/degreeDataTU";
import { level, RoutineData, SubjectData } from "@/interfaces/interfaces";
import { RangeToSubjectTime } from "@/utils/dateUtils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const routines = () => {
  const { settings } = useApp();

  const [routineData, setRoutineData] = useState<RoutineData>({
    degreeName: "",
    term: "",
    branch: "",
    batchAndSection: "",
    dayOfWeek: "",
  });
  const [selectedRoutineId, setSelectedRoutineId] = useState<number>(0);

  const [routineState, setRoutineState] = useState<{
    subjects: SubjectData[];
    activeOrder: string[];
  }>({
    subjects: [],
    activeOrder: [],
  });

  const degreeMetadata = useMemo(() => {
    return (
      searchByDegreeName(routineData.degreeName) || {
        faculty: "",
        degreeType: "",
      }
    );
  }, [routineData.degreeName]);

  const currentQueryContext = useMemo(() => {
    return {
      faculty: degreeMetadata.faculty,
      degreeType: degreeMetadata.degreeType,
      degreeName: routineData.degreeName,
      branch: routineData.branch,
      term: routineData.term,
      level: "faculty" as level,
    };
  }, [
    degreeMetadata,
    routineData.degreeName,
    routineData.branch,
    routineData.term,
  ]);

  const currentRoutineOption = useMemo(() => {
    return settings.routineTimeOptions[selectedRoutineId];
  }, [settings.routineTimeOptions, selectedRoutineId]);

  const maxSubjects = useMemo(() => {
    if (!routineState.subjects) return 0;
    if (!currentRoutineOption) return 0;

    const result = RangeToSubjectTime({
      times: {
        start: currentRoutineOption.startTime,
        end: currentRoutineOption.endTime,
        duration: currentRoutineOption.duration,
      },
      index: 0,
    });

    return result?.totalSubjects ?? 0;
  }, [currentRoutineOption, routineState.subjects]);

  const isLimitReached = routineState.activeOrder.length >= maxSubjects;

  const error: { title: string; description: string; showError?: boolean } =
    useMemo(() => {
      if (isLimitReached)
        return {
          title: "Subject limit exceeded",
          description: `The selected routine option can only have ${maxSubjects} subjects. Please remove one of the subjects first or select a different routine option.`,
          showError: true,
        };

      return { title: "", description: "", showError: false };
    }, [isLimitReached, maxSubjects]);

  const computeCurrentSubjectTimes = useCallback(
    (itemIndex: number) => {
      const defaultData = { startTime: "", duration: "" };
      if (!currentRoutineOption) return defaultData;

      const calculatedTimeRange = RangeToSubjectTime({
        times: {
          start: currentRoutineOption.startTime,
          end: currentRoutineOption.endTime,
          duration: currentRoutineOption.duration,
        },
        index: itemIndex,
      });

      return {
        startTime: calculatedTimeRange?.startTime ?? "",
        duration: calculatedTimeRange?.duration ?? "",
      };
    },
    [currentRoutineOption],
  );

  const assignTimes = useCallback(
    (subjects: SubjectData[], activeOrder: string[]) => {
      return subjects.map((subject) => {
        const queueIndex = activeOrder.indexOf(subject.subjectCode);
        if (queueIndex === -1)
          return { ...subject, startTime: "", duration: "" };

        return {
          ...subject,
          ...computeCurrentSubjectTimes(queueIndex),
        };
      });
    },
    [computeCurrentSubjectTimes],
  );

  // Sync subjects when parameters pivot
  useEffect(() => {
    if (!routineData.degreeName || !routineData.term) {
      setRoutineState({ subjects: [], activeOrder: [] });
      return;
    }

    const subjects = getCurriculumData({
      ...currentQueryContext,
      level: "subjects",
    });

    const initialSubjects: SubjectData[] = subjects.map((subjectString) => ({
      subjectCode: subjectString,
      teacherId: "",
      teacherName: "",
      startTime: "",
      duration: "",
    }));

    setRoutineState({ subjects: initialSubjects, activeOrder: [] });
  }, [currentQueryContext, routineData.degreeName, routineData.term]);

  const handleUpdateSubjectCard = useCallback(
    (index: number, updatedFields: Partial<SubjectData>) => {
      setRoutineState((prev) => {
        const subjects = [...prev.subjects];
        let activeOrder = [...prev.activeOrder];

        subjects[index] = {
          ...subjects[index],
          ...updatedFields,
        };

        if ("teacherId" in updatedFields) {
          const currentSubjectCode = subjects[index].subjectCode;
          const isAssigned = updatedFields.teacherId !== "";
          const isTracked = activeOrder.includes(currentSubjectCode);

          if (isAssigned && !isTracked) {
            activeOrder.push(currentSubjectCode);
          }

          if (!isAssigned && isTracked) {
            activeOrder = activeOrder.filter((i) => i !== currentSubjectCode);
          }
        }

        return {
          subjects: assignTimes(subjects, activeOrder),
          activeOrder,
        };
      });
    },
    [assignTimes],
  );

  useEffect(() => {
    setRoutineState((prev) => ({
      ...prev,
      subjects: assignTimes(prev.subjects, prev.activeOrder),
    }));
  }, [assignTimes]);

  const renderSubjectCard = useCallback(
    ({ item, index }: { item: SubjectData; index: number }) => (
      <SubjectCard
        subjectName={item.subjectCode}
        startTime={item.startTime}
        duration={item.duration}
        teacherId={item.teacherId}
        teacherName={item.teacherName}
        onTeacherChange={(teacherId, teacherName) =>
          handleUpdateSubjectCard(index, { teacherId, teacherName })
        }
        errorInfo={{ ...error, showError: isLimitReached }}
      />
    ),
    [handleUpdateSubjectCard, error],
  );

  return (
    <ThemedLinearGradient style={StyleSheet.absoluteFillObject}>
      <FlatList
        data={routineState.subjects}
        style={{
          flex: 1,
          backgroundColor: "transparent",
          paddingTop: StatusBar.currentHeight,
        }}
        keyExtractor={(item) => item.subjectCode}
        ListHeaderComponent={
          <RoutinesHeaderComponent
            data={routineData}
            setData={setRoutineData}
            currentQueryContext={currentQueryContext}
            onDynamicRoutineSelect={setSelectedRoutineId}
          />
        }
        renderItem={renderSubjectCard}
        ListFooterComponent={
          routineState.subjects.length > 0 ? (
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
              Please select degree details.
            </ThemedText>
          )
        }
        ListFooterComponentStyle={{ marginBottom: 128 }}
      />
    </ThemedLinearGradient>
  );
};

export default routines;
