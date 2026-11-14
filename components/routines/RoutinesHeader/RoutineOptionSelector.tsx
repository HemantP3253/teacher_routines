import { RoutinesIcon } from "@/assets/icons";
import { CustomModal, DynamicTextInput } from "@/components/common";
import DynamicTagSelect from "@/components/common/DynamicTagSelect";
import { ThemedLinearGradient } from "@/components/themed";
import { useBlurContext } from "@/contexts/BlurContext";
import { useAppStore } from "@/store/useAppStore";
import { useRoutineStore } from "@/store/useRoutineStore";
import { Days } from "@/types/routines";
import { useCallback, useMemo, useState } from "react";
import { KeyboardTypeOptions, View } from "react-native";
import DaySelector from "./DaySelector";

const RoutineOptionSelector = () => {
  const { targetRef } = useBlurContext();
  const routineOptions = useAppStore((state) => state.routineOptions);

  const [selectedDays, setSelectedDays] = useState<Days[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);

  // let routineOptions2: {
  //   id: number;
  //   label: string;
  //   startTime: string;
  //   endTime: string;
  //   breakStartTime?: string | undefined;
  //   breakEndTime?: string | undefined;
  //   periodDuration: number;
  //   activeDays: Days[];
  // }[];

  const selectedRoutineOption = useRoutineStore(
    (state) => state.selectedRoutineOption,
  );
  const setRoutineOption = useRoutineStore((state) => state.setRoutineOption);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const inputFields = useMemo(
    () => [
      {
        title: "Routine name",
        inputFormatType: "lettersAndSpaces" as const,
        isNullable: false,
      },
      {
        title: "Start time",
        inputFormatType: "time" as const,
        showPicker: "time" as const,
        keyboardType: "number-pad" as KeyboardTypeOptions,
        isNullable: false,
      },
      {
        title: "End time",
        inputFormatType: "time" as const,
        showPicker: "time" as const,
        keyboardType: "number-pad" as KeyboardTypeOptions,
        isNullable: false,
      },
      {
        title: "Period duration",
        inputFormatType: "whole-number" as const,
        keyboardType: "number-pad" as KeyboardTypeOptions,
        infoText: 'Enter the duration of a period. Example: "40", "60", "30"',
      },
    ],
    [],
  );

  const extraInputFields = useMemo(
    () => [
      {
        title: "Break start time",
        inputFormatType: "time" as const,
        showPicker: "time" as const,
        keyboardType: "number-pad" as KeyboardTypeOptions,
        isNullable: false,
      },
      {
        title: "Break end time",
        inputFormatType: "time" as const,
        showPicker: "time" as const,
        keyboardType: "number-pad" as KeyboardTypeOptions,
        isNullable: false,
      },
    ],
    [],
  );

  const handleSubmit = useCallback((inputs: string[]) => {
    console.log(inputs);
  }, []);

  return (
    <View>
      <DynamicTagSelect
        Icon={RoutinesIcon}
        data={routineOptions}
        getId={(item) => item.id.toString()}
        getLabel={(item) => item.label}
        initialValue={selectedRoutineOption ?? routineOptions?.[0]}
        defaultAddButton={{
          label: "Add New Routine",
          onPress: () => setModalVisible(true),
        }}
        title="Select Routine"
        onSelect={(index: number) => setRoutineOption(routineOptions[index])}
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
            inputFields={inputFields}
            extraInputs={{
              captionText: "Add break time?",
              inputFields: extraInputFields,
            }}
            onSubmit={handleSubmit}
            CustomComponent={
              <DaySelector
                initialSelection={selectedDays}
                onChange={(days) => setSelectedDays(days)}
              />
            }
          />
        </ThemedLinearGradient>
      </CustomModal>
    </View>
  );
};

export default RoutineOptionSelector;
