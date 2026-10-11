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
import {
  getAllCurriculumEntities,
  getNextCurriculumEntities,
  getProgramContextById,
} from "@/data/curricula/university/TU/tuHelpers";
import { RoutinesHeaderProps } from "@/interfaces/interfaces";
import {
  AcademicLevel,
  UniversityBranch,
  UniversityProgram,
} from "@/types/academic";
import { useState } from "react";
import DynamicTagSelect from "../common/DynamicTagSelect";
import { ThemedModalMenu, ThemedText, ThemedView } from "../themed";
import ActionableHeaderCard from "./ActionableHeaderCard";

type menuSteps = "Program" | "Branch" | "Term" | "Batch and Section";

const RoutinesHeaderComponent = ({
  selectedProgram,
  selectedBranch,
  selectedAcademicLevel,
  selectedBatchAndSectionId,
  onProgramChange,
  onBranchChange,
  onAcademicLevelChange,
  onBatchAndSectionChange,
  onDynamicRoutineSelect,
}: RoutinesHeaderProps) => {
  const { programs } = getAllCurriculumEntities();
  const { settings } = useApp();
  const activeMenuSteps: menuSteps[] = [
    "Program",
    "Branch",
    "Term",
    "Batch and Section",
  ];

  const selectedContext = selectedProgram
    ? getProgramContextById(selectedProgram?.id)
    : undefined;

  const hasBranches = selectedProgram?.hasBranches;

  const getDisplaySummary = () => {
    if (!selectedProgram) return undefined;
    if ((hasBranches && !selectedBranch) || !selectedAcademicLevel)
      return selectedProgram.shortCode;

    const term = selectedAcademicLevel.name.split(" ")[0];
    const branchText = hasBranches ? selectedBranch?.name + " • " : "";
    const typeLabel = selectedProgram.termType === "semester" ? "Sem" : "Year";

    return `${selectedProgram.shortCode} • ${branchText}${term} ${typeLabel}`;
  };

  const summaryText = getDisplaySummary();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const CurrentStepMenu = ({ currentStep }: { currentStep: menuSteps }) => {
    switch (currentStep) {
      case "Program":
        return (
          <ThemedModalMenu<UniversityProgram>
            title={"Select Program"}
            data={programs}
            selectedItem={selectedProgram ?? null}
            onItemSelect={onProgramChange}
            getId={(item) => item.id}
            getLabel={(item) => `${item.name} (${item.shortCode})`}
            iconProperties={{ Icon: DegreeIcon }}
          />
        );
      case "Branch":
        return hasBranches ? (
          <ThemedModalMenu<UniversityBranch>
            title={"Select Branch"}
            data={
              getNextCurriculumEntities(
                selectedContext?.unit.id ?? "",
                selectedContext?.level.id ?? "",
                selectedProgram?.id,
              ) ?? []
            }
            selectedItem={selectedBranch ?? null}
            onItemSelect={onBranchChange}
            getId={(item) => item.id}
            getLabel={(item) => item.name}
            iconProperties={{ Icon: AltRouteIcon }}
            alertCondition={{
              visible: !selectedProgram,
              alertTitle: "Program not selected",
              alertDescription: "Please select a program first!",
            }}
          />
        ) : undefined;
      case "Term":
        const alertType = hasBranches ? "Branch" : "Program";
        return (
          <ThemedModalMenu<AcademicLevel>
            title={"Select Academic Level"}
            data={
              getNextCurriculumEntities(
                selectedContext?.unit.id ?? "",
                selectedContext?.level.id ?? "",
                selectedProgram?.id ?? "",
                selectedBranch?.id ?? "",
              ) ?? []
            }
            selectedItem={selectedAcademicLevel ?? null}
            onItemSelect={onAcademicLevelChange}
            getId={(item) => item.id}
            getLabel={(item) => item.name}
            iconProperties={{ Icon: DateRangeIcon }}
            alertCondition={{
              visible: hasBranches ? !selectedBranch : !selectedProgram,
              alertTitle: `${alertType} not selected.`,
              alertDescription: `Please select a ${alertType.toLowerCase()} first!`,
            }}
          />
        );
      case "Batch and Section":
        return (
          <ThemedModalMenu
            title={"Select Batch and Section"}
            data={[]}
            selectedItem={null}
            onItemSelect={onBatchAndSectionChange}
            getId={(item) => item}
            getLabel={(item) => `${item}`}
            iconProperties={{ Icon: Groups2Icon }}
            alertCondition={{
              visible: !selectedAcademicLevel,
              alertTitle: "Academic level not selected",
              alertDescription: "Please select an academic level first!",
            }}
          />
        );
    }
  };

  return (
    <ThemedView style={{ backgroundColor: "transparent" }}>
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
        title="Select Program Details"
        IconBeforeText={DegreeIcon}
        iconProperties={{
          Icon: isExpanded ? ArrowUpIcon : ArrowDownIcon,
          height: 32,
          width: 32,
          onPress: () => setIsExpanded(!isExpanded),
        }}
        isDataLoading={false}
        summaryText={isExpanded ? undefined : summaryText}
        showBottomBorder={isExpanded}
      >
        {isExpanded && (
          <>
            {activeMenuSteps.map((stepName) => (
              <CurrentStepMenu key={stepName} currentStep={stepName} />
            ))}
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
