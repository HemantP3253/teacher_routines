import { CustomModal, DynamicTextInput } from "@/components/common";
import DynamicTagSelect from "@/components/common/DynamicTagSelect";
import { ThemedLinearGradient } from "@/components/themed";
import { useBlurContext } from "@/contexts/BlurContext";
import { useObservable } from "@/hooks/useObservable";
import { observeBatchesByProgramId } from "@/services/routineService";
import { useRoutineStore } from "@/store/useRoutineStore";
import { of } from "@nozbe/watermelondb/utils/rx";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

const BatchAndSectionStep = () => {
  const { targetRef } = useBlurContext();

  const selectedProgram = useRoutineStore((state) => state.selectedProgram);
  const selectedAcademicLevel = useRoutineStore(
    (state) => state.selectedAcademicLevel,
  );
  const selectedBatchAndSection = useRoutineStore(
    (state) => state.selectedBatchAndSection,
  );

  const setBatchAndSection = useRoutineStore(
    (state) => state.setBatchAndSection,
  );

  const [temporaryBatches, setTemporaryBatches] = useState<string[]>([]);

  const savedBatches = useObservable(
    () =>
      selectedProgram?.id
        ? observeBatchesByProgramId(selectedProgram.id)
        : of([]),
    [selectedProgram?.id],
    [],
  );

  const batchAndSections = useMemo(
    () => Array.from(new Set([...savedBatches, ...temporaryBatches])),
    [savedBatches, temporaryBatches],
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleBatchSubmit = useCallback(
    (inputs: string[]) => {
      const batch = inputs[0]?.trim();
      const section = inputs[1]?.trim();

      const formattedValue = section ? `${batch} '${section}'` : batch;

      setTemporaryBatches((prev) =>
        prev.includes(formattedValue) ? prev : [...prev, formattedValue],
      );

      setBatchAndSection(formattedValue);
      setModalVisible(false);
    },
    [setBatchAndSection],
  );

  const batchInputFields = useMemo(
    () => [
      {
        title: "Batch",
        inputFormatType: "whole-number" as const,
        isNullable: false,
        infoText:
          'Enter the batch as the year in BS or AD or in both using parentheses. Example: "2079", "2082", "2023", "2080 (2023)"',
      },
      {
        title: "Section",
        isNullable: true,
        infoText: "Enter the section. Example: 'A', 'B'",
      },
    ],
    [],
  );

  return (
    <View>
      <DynamicTagSelect
        key={`batch-select-${selectedAcademicLevel?.id ?? "none"}-${selectedBatchAndSection}-${batchAndSections.length}`}
        title="Select Batch and Section"
        data={batchAndSections}
        initialValue={selectedBatchAndSection}
        getId={(item) => item?.toString()}
        getLabel={(item) => item?.toString()}
        defaultAddButton={{
          label: "Add New Batch",
          onPress: () => setModalVisible(true),
        }}
        onSelect={(index) => {
          const selectedValue = batchAndSections[index];
          if (selectedValue) {
            setBatchAndSection(selectedValue);
          }
        }}
      />

      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
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
    </View>
  );
};

export default BatchAndSectionStep;
