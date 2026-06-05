import { RoutinesFooterComponent, SubjectCard } from "@/components/routines";
import RoutinesHeaderComponent from "@/components/routines/RoutinesHeaderComponent";
import { ThemedText } from "@/components/themed";
import { useAppTheme } from "@/contexts/ThemeContext";
import { getCurriculumData, searchByDegreeName } from "@/data/degreeDataTU";
import {
  DynamicRoutineDetails,
  level,
  RoutineData,
  SubjectData,
} from "@/interfaces/interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar } from "react-native";

const routines = () => {
  const { theme } = useAppTheme();
  const colors = theme.colors;

  const [routineData, setRoutineData] = useState<RoutineData>({
    degreeName: "",
    term: "",
    branch: "",
    batchAndSection: "",
  });

  const [dynamicRoutineDetails, setDynamicRoutineDetails] =
    useState<DynamicRoutineDetails>();

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
        onTimeChange={(startTime, duration) =>
          handleUpdateSubjectCard(index, {
            startTime: startTime,
            duration: duration,
          })
        }
        onTeacherChange={(teacherId, teacherName) =>
          handleUpdateSubjectCard(index, {
            teacherId: teacherId,
            teacherName: teacherName,
          })
        }
      />
    ),
    [],
  );

  return (
    <FlatList
      data={subjectList}
      style={{
        flex: 1,
        backgroundColor: colors.base100,
        paddingTop: StatusBar.currentHeight,
      }}
      keyExtractor={(item) => item.subjectCode}
      ListHeaderComponent={
        <RoutinesHeaderComponent
          data={routineData}
          setData={setRoutineData}
          currentQueryContext={currentQueryContext}
          onDynamicRoutineSelect={setDynamicRoutineDetails}
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
