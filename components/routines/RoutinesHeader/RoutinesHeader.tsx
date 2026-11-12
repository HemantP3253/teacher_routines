import {
    AltRouteIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    DateRangeIcon,
    DegreeIcon,
    RoutinesIcon,
} from "@/assets/icons";
import { useBlurContext } from "@/contexts/BlurContext";
import {
    getAllCurriculumEntities,
    getNextCurriculumEntities,
    getProgramContextById,
} from "@/data/curricula/university/TU/tuHelpers";
import { useObservable } from "@/hooks/useObservable";
import { observeBatchesByProgramId } from "@/services/routineService";
import { useAppStore } from "@/store/useAppStore";
import {
    AcademicLevel,
    UniversityBranch,
    UniversityProgram,
} from "@/types/academic";
import { of } from "@nozbe/watermelondb/utils/rx";
import { useCallback, useMemo, useState } from "react";
import { CustomModal } from "../../common";
import ActionableHeaderCard from "../../common/ActionableHeaderCard";
import DynamicTagSelect from "../../common/DynamicTagSelect/index";
import DynamicTextInput from "../../common/DynamicTextInput";
import {
    ThemedLinearGradient,
    ThemedModalMenu,
    ThemedText,
    ThemedView,
} from "../../themed";

type menuSteps = "Program" | "Branch" | "Term" | "Batch and Section";

interface RoutinesHeaderProps {
  selectedProgram: UniversityProgram | undefined;
  selectedBranch: UniversityBranch | undefined;
  selectedAcademicLevel: AcademicLevel | undefined;
  selectedBatchAndSection: string | undefined;

  onProgramChange: (program: UniversityProgram) => void;
  onBranchChange: (branch: UniversityBranch) => void;
  onAcademicLevelChange: (academicLevel: AcademicLevel) => void;
  onBatchAndSectionChange: (batchAndSection: string) => void;
  onDynamicRoutineSelect: (index: number) => void;
}

interface StepMenuProps {
  currentStep: menuSteps;
  selectedProgram: UniversityProgram | undefined;
  selectedBranch: UniversityBranch | undefined;
  selectedAcademicLevel: AcademicLevel | undefined;
  selectedBatchAndSection: string | undefined;
  programs: UniversityProgram[];
  hasBranches: boolean | undefined;
  selectedContext: any;
  batchAndSections: string[];
  onProgramChange: (program: UniversityProgram) => void;
  onBranchChange: (branch: UniversityBranch) => void;
  onAcademicLevelChange: (academicLevel: AcademicLevel) => void;
  onBatchAndSectionChange: (batchAndSection: string) => void;
  setBatchModalVisible: (visible: boolean) => void;
}

const CurrentStepMenu = ({
  currentStep,
  selectedProgram,
  selectedBranch,
  selectedAcademicLevel,
  selectedBatchAndSection,
  programs,
  hasBranches,
  selectedContext,
  batchAndSections,
  onProgramChange,
  onBranchChange,
  onAcademicLevelChange,
  onBatchAndSectionChange,
  setBatchModalVisible,
}: StepMenuProps) => {
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
              selectedProgram?.id ?? "",
            ) ?? []
          }
          selectedItem={selectedBranch ?? null}
          onItemSelect={onBranchChange}
          getId={(item) => item.id}
          getLabel={(item) => item.name}
          iconProperties={{ Icon: AltRouteIcon }}
          alertCondition={{
            visible: !selectedProgram,
            title: "Program not selected",
            description: "Please select a program first!",
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
            title: `${alertType} not selected.`,
            description: `Please select a ${alertType.toLowerCase()} first!`,
          }}
        />
      );
    case "Batch and Section":
      return (
        <DynamicTagSelect
          key={`batch-select-${selectedProgram?.id ?? "none"}-${selectedBranch?.id ?? "none"}-${selectedBatchAndSection ?? "none"}-${batchAndSections.length}`}
          title="Select Batch and Section"
          data={batchAndSections}
          initialValue={selectedBatchAndSection}
          getId={(item) => item.toString()}
          getLabel={(item) => item.toString()}
          defaultAddButton={{
            label: "Add New Batch",
            onPress: () => setBatchModalVisible(true),
          }}
          onSelect={(index) => {
            const selectedValue = batchAndSections[index];
            if (selectedValue) {
              onBatchAndSectionChange(selectedValue);
            }
          }}
        />
      );
  }
};

const RoutinesHeaderComponent = ({
  selectedProgram,
  selectedBranch,
  selectedAcademicLevel,
  selectedBatchAndSection,
  onProgramChange,
  onBranchChange,
  onAcademicLevelChange,
  onBatchAndSectionChange,
  onDynamicRoutineSelect,
}: RoutinesHeaderProps) => {
  const { blurMethod, targetRef } = useBlurContext();
  const { programs } = getAllCurriculumEntities();
  const routineOptions = useAppStore((state) => state.routineOptions);
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

  // const summaryText = getDisplaySummary();/

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const savedBatches = useObservable(
    () =>
      selectedProgram?.id
        ? observeBatchesByProgramId(selectedProgram.id)
        : of([]),
    [selectedProgram?.id],
    [],
  );
  const [temporaryBatches, setTemporaryBatches] = useState<string[]>([]);

  const batchAndSections = useMemo(
    () => Array.from(new Set([...savedBatches, ...temporaryBatches])),
    [savedBatches, temporaryBatches],
  );
  const [batchModalVisible, setBatchModalVisible] = useState<boolean>(false);

  const batchInputFields = useMemo(
    () => [
      {
        title: "Batch",
        inputFormatType: "whole-number" as const,
        isNullable: false,
        infoText:
          'Enter the batch as the year in BS or AD or in both using parantheses. Example: "2079", "2082", "2023", "2080 (2023)"',
      },
      {
        title: "Section",
        isNullable: true,
        infoText: "Enter the section. Example: 'A', 'B'",
      },
    ],
    [],
  );

  const handleBatchSubmit = useCallback(
    (inputs: string[]) => {
      const batch = inputs[0]?.trim();
      const section = inputs[1]?.trim();

      const formattedValue = section ? `${batch} '${section}'` : batch;

      setTemporaryBatches((prev) =>
        prev.includes(formattedValue) ? prev : [...prev, formattedValue],
      );

      onBatchAndSectionChange(formattedValue);
      setBatchModalVisible(false);
    },
    [onBatchAndSectionChange],
  );

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
              <CurrentStepMenu
                key={stepName}
                currentStep={stepName}
                selectedProgram={selectedProgram}
                selectedBranch={selectedBranch}
                selectedAcademicLevel={selectedAcademicLevel}
                selectedBatchAndSection={selectedBatchAndSection}
                programs={programs}
                hasBranches={hasBranches}
                selectedContext={selectedContext}
                batchAndSections={batchAndSections}
                onProgramChange={onProgramChange}
                onBranchChange={onBranchChange}
                onAcademicLevelChange={onAcademicLevelChange}
                onBatchAndSectionChange={onBatchAndSectionChange}
                setBatchModalVisible={setBatchModalVisible}
              />
            ))}
          </>
        )}
      </ActionableHeaderCard>
      <DynamicTagSelect
        Icon={RoutinesIcon}
        data={routineOptions}
        getId={(item) => item.id.toString()}
        getLabel={(item) => item.label}
        defaultAddButton={{
          label: "Add New Routine",
          onPress: () => {
            /* TODO */
          },
        }}
        title="Select Routine"
        onSelect={(index: number) => onDynamicRoutineSelect(index)}
      />
      <CustomModal
        modalVisible={batchModalVisible}
        setModalVisible={setBatchModalVisible}
        blurTarget={targetRef}
      >
        <ThemedLinearGradient
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <DynamicTextInput
            title="Add new Batch"
            key={"batch"}
            inputFields={batchInputFields}
            onSubmit={handleBatchSubmit}
          />
        </ThemedLinearGradient>
      </CustomModal>
    </ThemedView>
  );
};

export default RoutinesHeaderComponent;
