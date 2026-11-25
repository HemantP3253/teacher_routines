import { ArrowDownIcon, ArrowUpIcon, DegreeIcon } from "@/assets/icons";
import { ActionableHeaderCard, CustomText, CustomView } from "@/components/ui";
import { useRoutineStore } from "@/store/useRoutineStore";
import { MenuSteps } from "@/types/routines";
import { useMemo, useState } from "react";
import BatchAndSectionStep from "./BatchAndSectionStep";
import RoutineOptionSelector from "./RoutineOptionSelector";
import CurrentStepMenu from "./StepMenu";

const activeMenuSteps: MenuSteps[] = ["Program", "Branch", "Academic Level"];

const RoutinesHeader = () => {
  const selectedProgram = useRoutineStore((state) => state.selectedProgram);
  const selectedBranch = useRoutineStore((state) => state.selectedBranch);
  const selectedAcademicLevel = useRoutineStore(
    (state) => state.selectedAcademicLevel,
  );

  const hasBranches = selectedProgram?.hasBranches;

  const summaryText = useMemo(() => {
    if (!selectedProgram) return undefined;
    if (hasBranches && !selectedBranch) return selectedProgram.shortCode;
    if (!selectedAcademicLevel) return selectedProgram.shortCode;

    const term = selectedAcademicLevel.name.split(" ")[0];
    const branchText = hasBranches ? selectedBranch?.name + " • " : "";
    const typeLabel = selectedProgram.termType === "semester" ? "Sem" : "Year";

    return `${selectedProgram.shortCode} ${branchText}${term} ${typeLabel}`;
  }, [hasBranches, selectedAcademicLevel, selectedBranch, selectedProgram]);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <CustomView style={{ backgroundColor: "transparent" }}>
      <CustomText
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          padding: 8,
        }}
      >
        Admin Dashboard
      </CustomText>
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
        childrenContainerStyle={{ gap: 4 }}
      >
        {isExpanded && (
          <>
            {activeMenuSteps.map((stepName) => (
              <CurrentStepMenu key={stepName} currentStep={stepName} />
            ))}
          </>
        )}
      </ActionableHeaderCard>
      <BatchAndSectionStep key={selectedProgram?.id ?? "none"} />
      <RoutineOptionSelector />
    </CustomView>
  );
};

export default RoutinesHeader;
