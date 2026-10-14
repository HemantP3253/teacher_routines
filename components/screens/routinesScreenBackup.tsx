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
  getProgramContextById,
} from "@/data/curricula/university/TU/tuHelpers";
import { RoutinesHeaderProps } from "@/interfaces/interfaces";
import {
  AcademicLevel,
  UniversityBranch,
  UniversityProgram,
} from "@/types/academic";
import { useState } from "react";
import { Spacer } from "../common";
import DynamicTagSelect from "../common/DynamicTagSelect";
import { ThemedModalMenu, ThemedText, ThemedView } from "../themed";
import ActionableHeaderCard from "./ActionableHeaderCard";

const stepConfig = {
  Program: { key: "program", requiredKey: null },
  Branch: { key: "branch", requiredKey: "Program" },
  Term: { key: "term", requiredKey: "Program" },
  "Batch and Section": { key: "batchAndSection", requiredKey: "Term" },
};

type StepType = keyof typeof stepConfig;

const RoutinesHeaderComponent = ({
  programId,
  branchId,
  academicLevelId,
  batchAndSectionId,
  onProgramChange,
  onBranchChange,
  onAcademicLevelChange,
  onBatchAndSectionChange,
}: RoutinesHeaderProps) => {
  const { programs, branches, academicLevels } = getAllCurriculumEntities();
  const { allAvailableDegrees, settings } = useApp();
  const activeMenuSteps: StepType[] = [
    "Program",
    "Branch",
    "Term",
    "Batch and Section",
  ];

  const selectedProgram = programs.find((program) => program.id === programId);
  const hasBranches = selectedProgram?.hasBranches;
  const selectedBranch = hasBranches
    ? selectedProgram.branches.find((branch) => branch.id === branchId)
    : null;

  const levels = hasBranches ? selectedBranch?.levels : selectedProgram?.levels;
  const selectedAcademicLevel = levels?.find(
    (academicLevel) => academicLevel.id === academicLevelId,
  );

  const getDisplaySummary = () => {
    if (!selectedProgram) return undefined;
    if (!selectedAcademicLevel) return selectedProgram.name;

    const term = selectedAcademicLevel.name.split(" ")[0];
    const branch = hasBranches ? selectedBranch?.name : "";
    const typeLabel = selectedProgram.termType === "semester" ? "Sem" : "Year";

    return `${selectedProgram.id.toUpperCase()} •${branch ? `${" • " + branch}` : ""} ${term} ${typeLabel}`;
  };

  const summaryText = getDisplaySummary();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getIcon = (step: StepType) => {
    if (step === "Program") return DegreeIcon;
    if (step === "Branch") return AltRouteIcon;
    if (step === "Term") return DateRangeIcon;
    if (step === "Batch and Section") return Groups2Icon;
  };

  type CurriculumMenuConfig =
    | {
        step: "Program";
        data: UniversityProgram[];
        item: UniversityProgram | null;
        onSelect: (item: UniversityProgram) => void;
      }
    | {
        step: "Branch";
        data: UniversityBranch[];
        item: UniversityBranch | null;
        onSelect: (item: UniversityBranch) => void;
      }
    | {
        step: "Term";
        data: AcademicLevel[];
        item: AcademicLevel | null;
        onSelect: (item: AcademicLevel) => void;
      };

  type CurriculumMenuProps = {
    config: CurriculumMenuConfig;
    addSearchBar?: boolean;
    alertCondition: {
      visible: boolean;
      alertTitle: string;
      alertDescription: string;
    };
  };

  function CurriculumStepMenu({
    config,
    addSearchBar,
    alertCondition,
  }: CurriculumMenuProps) {
    switch (config.step) {
      case "Program":
        return (
          <ThemedModalMenu<UniversityProgram>
            data={config.data}
            item={config.item}
            setItem={config.onSelect}
            getId={(item) => item.id}
            getLabel={(item) => item.name}
            title="Select Program"
            type="Program"
            onSelect={(selectedId) => onProgramChange(selectedId)}
            iconProperties={{ Icon: DegreeIcon }}
            addSearchBar={addSearchBar}
            alertCondition={alertCondition}
          />
        );

      case "Branch":
        return (
          <ThemedModalMenu<UniversityBranch>
            data={config.data}
            item={config.item}
            setItem={config.onSelect}
            getId={(item) => item.id}
            getLabel={(item) => item.name}
            title="Select Branch"
            type="Branch"
            onSelect={(selectedId) => onBranchChange(selectedId)}
            iconProperties={{ Icon: AltRouteIcon }}
            alertCondition={alertCondition}
          />
        );

      case "Term":
        return (
          <ThemedModalMenu<AcademicLevel>
            data={config.data}
            item={config.item}
            setItem={config.onSelect}
            getId={(item) => item.id}
            getLabel={(item) => item.name}
            title="Select Term"
            type="Term"
            onSelect={(selectedId) => onAcademicLevelChange(selectedId)}
            iconProperties={{ Icon: DateRangeIcon }}
            alertCondition={alertCondition}
          />
        );
    }
  }

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
        summaryText={summaryText}
      >
        {isExpanded && <Spacer style={{ margin: 8 }} lineVisible />}
        {isExpanded && (
          <>
            {activeMenuSteps.map((stepName) => {
              const context = getProgramContextById(selectedProgram?.id);

              if (!context) return null;
              if (stepName === "Branch" && !hasBranches) return null;

              let isMissingPrerequisite: boolean = false;
              let alertTitle: string = "Program";

              if (stepName === "Branch")
                isMissingPrerequisite = !selectedProgram;
              else if (stepName === "Term")
                isMissingPrerequisite = selectedProgram?.hasBranches
                  ? !selectedBranch
                  : !selectedProgram;
              else if (stepName === "Batch and Section")
                isMissingPrerequisite = !selectedAcademicLevel;

              if (stepName === "Term" && hasBranches) alertTitle = "Branch";
              else if (stepName === "Batch and Section") alertTitle = "Term";

              const menuConfig: CurriculumMenuConfig | null = (() => {
                switch (stepName) {
                  case "Program":
                    return {
                      step: "Program",
                      data: programs,
                      item: selectedProgram ?? null,
                      onSelect: (program) => onProgramChange(program.id),
                    };

                  case "Branch":
                    if (!selectedProgram?.hasBranches) return null;

                    return {
                      step: "Branch",
                      data: selectedProgram.branches,
                      item: selectedBranch ?? null,
                      onSelect: (branch) => onBranchChange(branch.id),
                    };

                  case "Term":
                    return {
                      step: "Term",
                      data: levels ?? [],
                      item: selectedAcademicLevel ?? null,
                      onSelect: (level) => onAcademicLevelChange(level.id),
                    };

                  case "Batch and Section":
                    return null;
                }
              })();

              if (!menuConfig) return null;

              return (
                <CurriculumStepMenu
                  key={stepName}
                  config={menuConfig}
                  addSearchBar={stepName === "Program"}
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
        // onSelect={(index: number) => onDynamicRoutineSelect(index)}
      />
    </ThemedView>
  );
};

export default RoutinesHeaderComponent;
