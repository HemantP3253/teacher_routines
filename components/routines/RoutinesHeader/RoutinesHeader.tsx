import {
  ArrowDownIcon,
  ArrowUpIcon,
  DegreeIcon,
  RoutinesIcon,
} from "@/assets/icons";
import { useAppStore } from "@/store/useAppStore";
import { useRoutineStore } from "@/store/useRoutineStore";
import { MenuSteps } from "@/types/routines";
import { useMemo, useState } from "react";
import ActionableHeaderCard from "../../common/ActionableHeaderCard";
import DynamicTagSelect from "../../common/DynamicTagSelect/index";
import { ThemedText, ThemedView } from "../../themed";
import CurrentStepMenu from "./StepMenu";

const RoutinesHeader = () => {
  const routineOptions = useAppStore((state) => state.routineOptions);
  const selectedProgram = useRoutineStore((state) => state.selectedProgram);
  const selectedBranch = useRoutineStore((state) => state.selectedBranch);
  const selectedAcademicLevel = useRoutineStore(
    (state) => state.selectedAcademicLevel,
  );
  const selectedBatchAndSection = useRoutineStore(
    (state) => state.selectedBatchAndSection,
  );
  const selectedRoutineOption = useRoutineStore(
    (state) => state.selectedRoutineOption,
  );
  const setRoutineOption = useRoutineStore((state) => state.setRoutineOption);

  const activeMenuSteps: MenuSteps[] = [
    "Program",
    "Branch",
    "Term",
    "Batch and Section",
  ];

  const hasBranches = selectedProgram?.hasBranches;

  const summaryText = useMemo(() => {
    if (!selectedProgram) return undefined;
    if (hasBranches && !selectedBranch) return selectedProgram.shortCode;
    if (!selectedAcademicLevel) return selectedProgram.shortCode;

    const term = selectedAcademicLevel.name.split(" ")[0];
    const branchText = hasBranches ? selectedBranch?.name + " • " : "";
    const batch = selectedBatchAndSection
      ? " • " + selectedBatchAndSection
      : "";
    const typeLabel = selectedProgram.termType === "semester" ? "Sem" : "Year";

    return `${selectedProgram.shortCode} ${branchText}${term} ${typeLabel}${batch}`;
  }, [
    hasBranches,
    selectedAcademicLevel,
    selectedBranch,
    selectedProgram,
    selectedBatchAndSection,
  ]);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
        data={routineOptions}
        getId={(item) => item.id.toString()}
        getLabel={(item) => item.label}
        initialValue={selectedRoutineOption ?? routineOptions?.[0]}
        defaultAddButton={{
          label: "Add New Routine",
          onPress: () => {
            /* TODO */
          },
        }}
        title="Select Routine"
        onSelect={(index: number) => setRoutineOption(routineOptions[index])}
      />
    </ThemedView>
  );
};

export default RoutinesHeader;
