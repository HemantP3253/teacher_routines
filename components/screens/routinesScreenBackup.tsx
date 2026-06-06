import { ArrowDownIcon } from "@/assets/icons";
import { ErrorCard, InfoCard } from "@/components/common";
import {
  ChooseTimeComponent,
  RoutinesFooterComponent,
  SubjectCard,
} from "@/components/routines";
import {
  ThemedModalMenu,
  ThemedStatusBar,
  ThemedText,
  ThemedView,
} from "@/components/themed";
import { getCurriculumData } from "@/data/degreeDataTU";
import { degreeQuery, SubjectData } from "@/interfaces/interfaces";
import { addSpacesAfterUppercase } from "@/utils/stringUtils";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type degreeCriteria =
  | "Faculty"
  | "DegreeType"
  | "DegreeName"
  | "Branch"
  | "Term"
  | "Batch"
  | "Section";

const criteriaMap: Record<
  degreeCriteria,
  {
    listKey: keyof degreeQuery;
    requiredKey: keyof degreeQuery | null;
    label: string;
  }
> = {
  Faculty: { listKey: "faculty", requiredKey: null, label: "Faculty" },
  DegreeType: {
    listKey: "degreeType",
    requiredKey: "faculty",
    label: "Faculty",
  },
  DegreeName: {
    listKey: "degreeName",
    requiredKey: "degreeType",
    label: "Degree Type",
  },
  Branch: {
    listKey: "branch",
    requiredKey: "degreeName",
    label: "Degree Name",
  },
  Term: { listKey: "term", requiredKey: "degreeName", label: "Degree Name" },
  Batch: { listKey: "batch" as any, requiredKey: "term", label: "Term" },
  Section: {
    listKey: "section" as any,
    requiredKey: "batch" as any,
    label: "Batch",
  },
};

const routines = () => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const [degreeData, setDegreeData] = useState<degreeQuery>({
    faculty: "",
    degreeType: "",
    degreeName: "",
    term: "",
    level: "faculty",
  });

  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);
  const [additionalDegreeData, setAdditionalDegreeData] = useState<{
    batch: string;
    section?: string;
  }>({ batch: "" });
  const [dynamicTimes, setDynamicTimes] = useState<{
    startTime: string;
    endTime: string;
    maxDuration: string;
  }>({ startTime: "", endTime: "", maxDuration: "" });

  const hasBranches = useMemo(() => {
    return getCurriculumData({ ...degreeData, level: "branch" }).length !== 0;
  }, [degreeData]);

  const currentSubjectsList = useMemo(() => {
    return getCurriculumData({ ...degreeData, level: "subjects" }) || [];
  }, [degreeData]);

  const menuSteps = [
    "Faculty",
    "DegreeType",
    "DegreeName",
    hasBranches ? "Branch" : null,
    "Term",
    "Batch",
    "Section",
  ].filter(Boolean) as degreeCriteria[];

  const [refresh, setRefresh] = useState<{
    tick: number;
    type: "faculty" | "degreeType" | "degreeName" | "branch" | "term" | "batch";
  }>({
    tick: 0,
    type: "faculty",
  });

  const [date, setDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    setRefresh((prev) => ({ tick: prev.tick + 1, type: "term" }));

    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    if (refresh.tick > 0) {
      setDegreeData((prev) => {
        switch (refresh.type) {
          case "faculty":
            return {
              ...prev,
              degreeType: "",
              degreeName: "",
              branch: undefined,
              term: "",
            };
          case "degreeType":
            return { ...prev, degreeName: "", branch: undefined, term: "" };
          case "degreeName":
            return { ...prev, branch: undefined, term: "" };
          case "branch":
            return { ...prev, term: "" };
          default:
            return prev;
        }
      });
    }
  }, [refresh.tick]);

  useEffect(() => {
    if (currentSubjectsList.length > 0)
      setSubjectData((prev) => {
        if (prev.length === currentSubjectsList.length) return prev;

        return currentSubjectsList.map((_, index) => {
          const splitCode =
            currentSubjectsList[index]?.split(":")[0]?.trim() || "";
          return (
            prev[index] || {
              subjectCode: splitCode,
              teacherId: "",
              teacherName: "",
              duration: "",
              startTime: "",
            }
          );
        });
      });
  }, [degreeData]);

  return (
    <ThemedView style={styles.rootContainer}>
      <ThemedStatusBar />

      <FlatList
        data={getCurriculumData({
          ...degreeData,
          level: "subjects",
        })}
        keyExtractor={(item) => item.toString()}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        renderItem={({ item, index }) => (
          <SubjectCard
            subjectName={item}
            initialData={subjectData[index]}
            setData={(data: SubjectData) => {
              setSubjectData((prevArray) => {
                const newArray = [...prevArray];
                newArray[index] = { ...newArray[index], ...data };
                return newArray;
              });
            }}
          />
        )}
        ListEmptyComponent={() =>
          degreeData.subjects?.length === 0 && (
            <ErrorCard
              containerStyle={{ margin: 8 }}
              errorText={"No data found"}
            />
          )
        }
        ListFooterComponent={() =>
          getCurriculumData({ ...degreeData, level: "subjects" }).length !==
            0 && <RoutinesFooterComponent />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponentStyle={{
          marginBottom: 64,
          padding: 4,
        }}
        ListHeaderComponent={() => (
          <ThemedView>
            <ThemedText style={[styles.headingText, { color: colors.primary }]}>
              Routines Dashboard
            </ThemedText>
            {degreeData?.subjects && (
              <InfoCard
                containerStyle={{ margin: 8 }}
                infoText={
                  "Assign the start times, teachers, and duration for each subject."
                }
              />
            )}
            <ThemedView>
              {menuSteps.map((type) => {
                const config = criteriaMap[type];
                const dataKey = config.listKey;

                let prereqKey = config.requiredKey;
                let alertLabel = config.label;
                let itemLabel = addSpacesAfterUppercase(type);

                if (type === "Term" && hasBranches) {
                  prereqKey = "branch";
                  alertLabel = "Branch";
                }

                const isMissingPrerequisite = prereqKey
                  ? !degreeData[prereqKey]
                  : false;

                return (
                  <ThemedModalMenu
                    key={type}
                    item={
                      type === "Batch"
                        ? additionalDegreeData.batch
                        : type === "Section"
                          ? additionalDegreeData.section
                          : (degreeData[dataKey] as string)
                    }
                    data={getCurriculumData({
                      ...degreeData,
                      level: type === "Batch" ? "faculty" : (dataKey as any),
                    })}
                    title={`Select ${itemLabel}`}
                    type={itemLabel}
                    noFill={
                      type === "Batch"
                        ? !additionalDegreeData.batch
                        : type === "Section"
                          ? !additionalDegreeData.section
                          : !degreeData[dataKey]
                    }
                    setItem={(text) => {
                      if (type === "Batch")
                        setAdditionalDegreeData((prev) => ({
                          ...prev,
                          batch: text,
                        }));
                      if (type === "Section")
                        setAdditionalDegreeData((prev) => ({
                          ...prev,
                          section: text,
                        }));
                      else
                        setDegreeData((prev) => ({
                          ...prev,
                          level: dataKey as any,
                          [dataKey as any]: text,
                        }));

                      setRefresh((prev) => ({
                        tick: prev.tick + 1,
                        type: dataKey as any,
                      }));
                    }}
                    alertCondition={{
                      visible: isMissingPrerequisite,
                      alertTitle: `${alertLabel.trim()} not selected`,
                      alertDescription: `Please select ${alertLabel.toLowerCase()} first!`,
                    }}
                  />
                );
              })}

              {getCurriculumData({ ...degreeData, level: "subjects" })
                .length !== 0 && (
                <View>
                  <InfoCard
                    containerStyle={{ margin: 8 }}
                    infoText={
                      "Assign the start times, teachers, and duration for each subject."
                    }
                  />
                  <ThemedView
                    style={{
                      borderWidth: 1,
                      borderColor: colors.accent,
                      borderRadius: 8,
                      margin: 8,
                      padding: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <ThemedText
                        style={{
                          fontSize: 16,
                          padding: 4,
                          color: colors.primary,
                        }}
                      >
                        Choose constant time for all subjects:
                      </ThemedText>

                      <ArrowDownIcon
                        onPress={() => setShowDropDown(!showDropDown)}
                        fill={colors.primary}
                        transform={[
                          { rotate: showDropDown ? "180deg" : "0deg" },
                        ]}
                        height={32}
                        width={32}
                      />
                    </View>
                    {showDropDown && (
                      <ChooseTimeComponent
                        timeValues={{
                          startTime: dynamicTimes.startTime,
                          endTime: dynamicTimes.endTime,
                          maxDuration: dynamicTimes.maxDuration,
                        }}
                        backgroundColor={colors.base100}
                        setTimeValues={setDynamicTimes}
                        date={date}
                        setDate={setDate}
                      />
                    )}
                  </ThemedView>
                </View>
              )}
            </ThemedView>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: StatusBar.currentHeight,
    height: "100%",
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  labelText: {
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: "600",
  },
  pressableText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default routines;
