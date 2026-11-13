import { AltRouteIcon, DateRangeIcon, DegreeIcon } from "@/assets/icons";
import { ThemedModalMenu } from "@/components/themed";
import {
  getNextCurriculumEntities,
  getProgramContextById,
} from "@/data/curricula/university/TU/tuHelpers";
import { useAppStore } from "@/store/useAppStore";
import { useRoutineStore } from "@/store/useRoutineStore";
import {
  AcademicLevel,
  UniversityBranch,
  UniversityProgram,
} from "@/types/academic";
import BatchAndSectionStep from "./BatchAndSectionStep";
import { MenuSteps } from "./RoutinesHeader";

interface StepMenuProps {
  currentStep: MenuSteps;
}

const CurrentStepMenu = ({ currentStep }: StepMenuProps) => {
  const programs = useAppStore((state) => state.availablePrograms);
  const selectedProgram = useRoutineStore((state) => state.selectedProgram);
  const selectedBranch = useRoutineStore((state) => state.selectedBranch);
  const selectedAcademicLevel = useRoutineStore(
    (state) => state.selectedAcademicLevel,
  );

  const setProgram = useRoutineStore((state) => state.setProgram);
  const setBranch = useRoutineStore((state) => state.setBranch);
  const setAcademicLevel = useRoutineStore((state) => state.setAcademicLevel);

  const hasBranches: boolean = selectedProgram?.hasBranches ?? false;

  const programContext = getProgramContextById(selectedProgram?.id);

  switch (currentStep) {
    case "Program":
      return (
        <ThemedModalMenu<UniversityProgram>
          title={"Select Program"}
          data={programs}
          selectedItem={selectedProgram ?? null}
          onItemSelect={setProgram}
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
              programContext?.unit.id ?? "",
              programContext?.level.id ?? "",
              selectedProgram?.id ?? "",
            ) ?? []
          }
          selectedItem={selectedBranch ?? null}
          onItemSelect={setBranch}
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
              programContext?.unit.id ?? "",
              programContext?.level.id ?? "",
              selectedProgram?.id ?? "",
              selectedBranch?.id ?? "",
            ) ?? []
          }
          selectedItem={selectedAcademicLevel ?? null}
          onItemSelect={setAcademicLevel}
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
      return <BatchAndSectionStep key={selectedProgram?.id ?? "none"} />;
  }
};

export default CurrentStepMenu;
