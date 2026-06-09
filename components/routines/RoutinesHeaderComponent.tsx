import {
  AltRouteIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DateRangeIcon,
  DegreeIcon,
  Groups2Icon,
  RoutinesIcon,
} from "@/assets/icons";
import { useApp } from "@/contexts/AppContext";
import { getCurriculumData } from "@/data/degreeDataTU";
import { level, RoutinesHeaderProps } from "@/interfaces/interfaces";
import { useMemo, useState } from "react";
import { useUnistyles } from "react-native-unistyles";
import { Spacer } from "../common";
import DynamicTagSelect from "../common/DynamicTagSelect";
import { ThemedModalMenu, ThemedText, ThemedView } from "../themed";
import ActionableHeaderCard from "./ActionableHeaderCard";

const stepConfig = {
  "Degree Name": { key: "degreeName", requiredKey: null },
  Branch: { key: "branch", requiredKey: "Degree Name" },
  Term: { key: "term", requiredKey: "Degree Name" },
  "Batch and Section": { key: "batchAndSection", requiredKey: "Term" },
};

type StepType = keyof typeof stepConfig;

const RoutinesHeaderComponent = ({
  data,
  setData,
  currentQueryContext,
  onDynamicRoutineSelect,
}: RoutinesHeaderProps) => {
  const { theme } = useUnistyles();
  const { allAvailableDegrees, settings } = useApp();
  const colors = theme.colors;
  const activeMenuSteps: StepType[] = [
    "Degree Name",
    "Branch",
    "Term",
    "Batch and Section",
  ];

  const handleSelectValue = (step: StepType, value: string) => {
    setData((prev) => {
      const updated = { ...prev };

      if (step === "Degree Name") {
        updated.degreeName = value;
        updated.branch = "";
        updated.term = "";
        updated.batchAndSection = "";
      } else if (step === "Branch") {
        updated.branch = value;
        updated.term = "";
        updated.batchAndSection = "";
      } else if (step === "Term") {
        updated.term = value;
        updated.batchAndSection = "";
      } else if (step === "Batch and Section") updated.batchAndSection = value;

      return updated;
    });
  };

  const getSelectedValue = (step: StepType): string => {
    if (step === "Degree Name") return data.degreeName;
    if (step === "Branch") return data.branch || "";
    if (step === "Term") return data.term;
    return data.batchAndSection;
  };

  const allDegreeNames = settings.shownDegrees ?? allAvailableDegrees;

  const displaySummaryString = useMemo(() => {
    if (!data.degreeName) return "";
    if (!data.term) return data.degreeName;

    const termSegments = data.term.split(" ");
    const termNumber = termSegments[0] || "";
    const isSemester = data.term.toLowerCase().includes("semester");
    const typeLabel = isSemester ? "Sem" : "Year";

    return `${data.degreeName} • ${termNumber} ${typeLabel}`;
  }, [data.degreeName, data.term]);

  const hasBranches = useMemo(() => {
    if (!data.degreeName || data.degreeName === "") return false;
    return (
      getCurriculumData({ ...currentQueryContext, level: "branch" }).length !==
      0
    );
  }, [currentQueryContext, data.degreeName]);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getIcon = (step: StepType) => {
    if (step === "Degree Name") return DegreeIcon;
    if (step === "Branch") return AltRouteIcon;
    if (step === "Term") return DateRangeIcon;
    if (step === "Batch and Section") return Groups2Icon;
  };

  return (
    <ThemedView>
      <ThemedText
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          padding: 8,
        }}
      >
        Admin Dashboard
      </ThemedText>
      <ActionableHeaderCard
        title="Select Degree Details"
        IconBeforeText={DegreeIcon}
        iconProperties={{
          Icon: isExpanded ? ArrowUpIcon : ArrowDownIcon,
          height: 32,
          width: 32,
          onPress: () => setIsExpanded(!isExpanded),
        }}
        isDataLoading={false}
        summaryText={
          data.degreeName && data.term && !isExpanded
            ? displaySummaryString
            : undefined
        }
      >
        {isExpanded && <Spacer style={{ margin: 8 }} lineVisible />}
        {isExpanded && (
          <>
            {activeMenuSteps.map((stepName) => {
              const config = stepConfig[stepName];

              if (stepName === "Branch" && !hasBranches) return null;

              const pickerData =
                stepName === "Degree Name"
                  ? allDegreeNames
                  : getCurriculumData({
                      ...currentQueryContext,
                      level: config.key as level,
                    });

              let isMissingPrerequisite: boolean = false;
              let alertTitle: string = "Degree Name";

              if (stepName === "Branch")
                isMissingPrerequisite = !data.degreeName;
              else if (stepName === "Term")
                isMissingPrerequisite =
                  !data.degreeName || (hasBranches && !data.branch);
              else if (stepName === "Batch and Section")
                isMissingPrerequisite = !data.term;

              if (stepName === "Term" && hasBranches) alertTitle = "Branch";
              else if (stepName === "Batch and Section") alertTitle = "Term";

              return (
                <ThemedModalMenu
                  addSearchBar={stepName === "Degree Name"}
                  key={stepName}
                  data={pickerData}
                  pressableStyle={{ backgroundColor: colors.surfaceElevated }}
                  title={`Select ${stepName}`}
                  type={stepName}
                  Icon={getIcon(stepName)}
                  noFill={!getSelectedValue(stepName)}
                  item={getSelectedValue(stepName)}
                  setItem={(item) => handleSelectValue(stepName, item)}
                  alertCondition={{
                    visible: isMissingPrerequisite,
                    alertTitle: `Select ${alertTitle}`,
                    alertDescription: `Please select "${alertTitle}" before selecting "${stepName}".`,
                  }}
                />
              );
            })}
          </>
        )}
      </ActionableHeaderCard>
      <DynamicTagSelect
        Icon={RoutinesIcon}
        data={settings.routineTimeOptions}
        getLabel={(item) => item.label}
        showAddButton
        title="Select Routine"
        onSelect={(index: number) => onDynamicRoutineSelect(index)}
      />
    </ThemedView>
  );
};

export default RoutinesHeaderComponent;
