import { RoutinesFooterComponent, SubjectCard } from "@/components/routines";
import RoutinesHeaderComponent from "@/components/routines/RoutinesHeaderComponent";
import { ThemedText } from "@/components/themed";
import { useApp } from "@/contexts/AppContext";
import { getCurriculumData, searchByDegreeName } from "@/data/degreeDataTU";
import { level, RoutineData, SubjectData } from "@/interfaces/interfaces";
import { RangeToSubjectTime } from "@/utils/dateUtils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const routines = () => {
  const { theme } = useUnistyles();
  const { settings } = useApp();
  const colors = theme.colors;

  const [routineData, setRoutineData] = useState<RoutineData>({
    degreeName: "",
    term: "",
    branch: "",
    batchAndSection: "",
    dayOfWeek: "",
  });

  const [selectedRoutineId, setSelectedRoutineId] = useState<number>(0);

  const degreeMetadata = useMemo(() => {
    return searchByDegreeName(routineData.degreeName);
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
  }, [routineData, degreeMetadata]);

  const [subjectList, setSubjectsList] = useState<SubjectData[]>([]);
  const [activeSubjects, setActiveSubjects] = useState<
    { id: number; teacherId: string }[]
  >([]);

  useEffect(() => {
    if (!routineData.degreeName || !routineData.term) {
      setSubjectsList([]);
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

    setSubjectsList(initialSubjects);
  }, [currentQueryContext, routineData.degreeName, routineData.term]);

  const handleUpdateSubjectCard = (
    index: number,
    updatedFields: Partial<SubjectData>,
  ) => {
    setSubjectsList((prevList) => {
      const newList = [...prevList];
      newList[index] = {
        ...newList[index],
        ...updatedFields,
      };
      return newList;
    });
  };

  const renderSubjectCard = useCallback(
    ({ item, index }: { item: SubjectData; index: number }) => (
      <SubjectCard
        subjectName={item.subjectCode}
        startTime={item.startTime}
        duration={item.duration}
        teacherId={item.teacherId}
        teacherName={item.teacherName}
        onTimeChange={(startTime, duration) =>
          handleUpdateSubjectCard(index, {
            startTime: startTime,
            duration: duration,
          })
        }
        onTeacherChange={(teacherId, teacherName) => {
          const routineOption = settings.routineTimeOptions[selectedRoutineId];

          let timeFields: Partial<SubjectData> = {};

          if (routineOption) {
            const calculatedTimeRange = RangeToSubjectTime(
              routineOption.startTime,
              routineOption.endTime,
              routineOption.duration,
              index,
            );

            if (
              Array.isArray(calculatedTimeRange) &&
              calculatedTimeRange.length >= 2
            ) {
              timeFields = {
                startTime: calculatedTimeRange[0],
                duration: calculatedTimeRange[1],
              };
            }
          }

          handleUpdateSubjectCard(index, {
            teacherId: teacherId,
            teacherName: teacherName,
            ...timeFields,
          });
        }}
      />
    ),
    [settings.routineTimeOptions, selectedRoutineId, handleUpdateSubjectCard],
  );

  return (
    <FlatList
      data={subjectList}
      style={{
        flex: 1,
        backgroundColor: colors.background,
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
              color: colors.infoContent,
            }}
          >
            Please select degree details.
          </ThemedText>
        )
      }
      ListFooterComponentStyle={{ marginBottom: 118 }}
    />
  );
};

export default routines;
