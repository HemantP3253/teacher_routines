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
  const [error, setError] = useState<{ title: string; description: string }>();

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

  const [subjectList, setSubjectsList] = useState<SubjectData[]>([]);
  const [activeSubjectOrder, setActiveSubjectOrder] = useState<number[]>([]);

  const currentRoutineOption = useMemo(() => {
    return settings.routineTimeOptions[selectedRoutineId];
  }, [settings.routineTimeOptions, selectedRoutineId]);

  const maxSubjects = useMemo(() => {
    return RangeToSubjectTime(
      currentRoutineOption.startTime,
      currentRoutineOption.endTime,
      currentRoutineOption.duration,
      0,
      "number-of-subjects",
    )?.totalSubjects;
  }, [currentRoutineOption]);

  const computeCurrentSubjectTimes = useCallback((itemIndex: number) => {
    // Data to return when requirements aren't met
    const defaultData = { startTime: "", duration: "" };
    if (!currentRoutineOption) return defaultData;

    const calculatedTimeRange = RangeToSubjectTime(
      currentRoutineOption.startTime,
      currentRoutineOption.endTime,
      currentRoutineOption.duration,
      itemIndex,
      "duration",
    );

    if (calculatedTimeRange?.startTime && calculatedTimeRange.duration)
      return {
        startTime: calculatedTimeRange?.startTime ?? "",
        duration: calculatedTimeRange?.duration ?? "0",
      };
    else return defaultData;
  }, []);

  // const onRoutineChange = () => {
  //   for (let i of activeSubjects) {
  //     computeSubjectTimes(i);
  //   }
  // };

  const calculateActiveSubjectTimes = (
    list: SubjectData[],
    currentActiveOrder: number[],
  ) => {
    return list.map((item, index) => {
      const queueIndex = currentActiveOrder.indexOf(index);
      if (queueIndex === -1) return { ...item, startTime: "", duration: "" };

      const times = computeCurrentSubjectTimes(queueIndex);
      return { ...item, ...times };
    });
  };

  // // Effect for active subject syncing
  // useEffect(() => {
  //   setSubjectsList((prevList) => calculateActiveSubjectTimes(prevList));
  // }, []);

  // useEffect for syncing subjects
  useEffect(() => {
    // Subject list not available, set all to empty
    if (!routineData.degreeName || !routineData.term) {
      setSubjectsList([]);
      return;
    }

    // Find subject list in the degree data
    const subjects = getCurriculumData({
      ...currentQueryContext,
      level: "subjects",
    });

    // Set all subjects to starting value (prevent null errors)
    const initialSubjects: SubjectData[] = subjects.map((subjectString) => ({
      subjectCode: subjectString,
      teacherId: "",
      teacherName: "",
      startTime: "",
      duration: "",
    }));

    // Set default values
    setSubjectsList(initialSubjects);
  }, [currentQueryContext, routineData.degreeName, routineData.term]);

  const handleUpdateSubjectCard = useCallback(
    (index: number, updatedFields: Partial<SubjectData>) => {
      if (!updatedFields.hasOwnProperty("teacherId")) {
        setSubjectsList((prevList) => {
          const newList = [...prevList];
          newList[index] = {
            ...newList[index],
            ...updatedFields,
          };

          return newList;
        });
      }

      const isTeacherAssigned = updatedFields.teacherId !== "";

      setActiveSubjectOrder((prevOrder) => {
        let nextOrder = [...prevOrder];
        const isAlreadyTracked = nextOrder.includes(index);

        if (isTeacherAssigned && !isAlreadyTracked) {
          if (activeSubjectOrder.length === maxSubjects) {
            setError({
              title: "Subject selection limit exceeded!",
              description:
                "Please clear one of the subjects before entering another subject. You have selected more subjects than the routine option allows. If this was intentional, please select another routine option or create a new one.",
            });
          }
          nextOrder.push(index);
        } else if (!isTeacherAssigned && !isAlreadyTracked) {
          nextOrder = nextOrder.filter((id) => id !== index);
        }

        setSubjectsList((prevList) => {
          const newList = [...prevList];
          newList[index] = { ...newList[index], ...updatedFields };

          return calculateActiveSubjectTimes(newList, nextOrder);
        });

        return nextOrder;
      });
    },
    [],
  );

  const renderSubjectCard = useCallback(
    ({ item, index }: { item: SubjectData; index: number }) => (
      <SubjectCard
        subjectName={item.subjectCode}
        startTime={item.startTime}
        duration={item.duration}
        teacherId={item.teacherId}
        teacherName={item.teacherName}
        onTeacherChange={(teacherId, teacherName) => {
          handleUpdateSubjectCard(index, {
            teacherId: teacherId,
            teacherName: teacherName,
          });
        }}
        errorInfo={error}
      />
    ),
    [handleUpdateSubjectCard],
  );

  return (
    <ThemedLinearGradient style={StyleSheet.absoluteFillObject}>
      <FlatList
        data={subjectList}
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
