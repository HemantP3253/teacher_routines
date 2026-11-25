import { AltRouteIcon, DateRangeIcon, DegreeIcon } from "@/assets/icons";
import { ModalMenu, ModalMenuPressable } from "@/components/ui";
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
import { MenuSteps } from "@/types/routines";
import { useState } from "react";

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
  const title = `Select ${currentStep}`;

  const programContext = getProgramContextById(selectedProgram?.id);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  switch (currentStep) {
    case "Program":
      return (
        <>
          <ModalMenuPressable
            title={title}
            target={currentStep}
            iconProperties={{ Icon: DegreeIcon }}
            selectedItem={selectedProgram?.name ?? null}
            onPress={() => setModalVisible(true)}
            style={{ marginHorizontal: 8 }}
          />
          <ModalMenu<UniversityProgram>
            selectedItem={selectedProgram}
            addSearchBar
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            title={title}
            data={programs}
            onItemSelect={setProgram}
            getId={(item) => item.id}
            getLabel={(item) => `${item.name} (${item.shortCode})`}
            sortType="ascending"
          />
        </>
      );
    case "Branch":
      return hasBranches ? (
        <>
          <ModalMenuPressable
            title={title}
            target={currentStep}
            iconProperties={{ Icon: AltRouteIcon }}
            selectedItem={selectedBranch?.name ?? null}
            onPress={() => setModalVisible(true)}
            style={{ marginHorizontal: 8 }}
          />
          <ModalMenu<UniversityBranch>
            selectedItem={selectedBranch}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            title={title}
            data={getNextCurriculumEntities(
              programContext?.unit.id ?? "",
              programContext?.level.id ?? "",
              selectedProgram?.id ?? "",
            )}
            onItemSelect={setBranch}
            getId={(item) => item.id}
            getLabel={(item) => item.name}
            sortType="ascending"
          />
        </>
      ) : null;
    case "Academic Level":
      return (
        <>
          <ModalMenuPressable
            title={title}
            target={currentStep}
            iconProperties={{ Icon: DateRangeIcon }}
            selectedItem={selectedAcademicLevel?.name ?? null}
            onPress={() => setModalVisible(true)}
            style={{ marginHorizontal: 8 }}
          />
          <ModalMenu<AcademicLevel>
            selectedItem={selectedAcademicLevel}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            title={title}
            data={getNextCurriculumEntities(
              programContext?.unit.id ?? "",
              programContext?.level.id ?? "",
              selectedProgram?.id ?? "",
              selectedBranch?.id ?? "",
            )}
            onItemSelect={setAcademicLevel}
            getId={(item) => item.id}
            getLabel={(item) => item.name}
            sortType="ascending"
          />
        </>
      );
  }
};

export default CurrentStepMenu;
