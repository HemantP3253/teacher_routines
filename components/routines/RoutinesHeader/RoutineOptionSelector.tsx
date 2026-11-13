import { RoutinesIcon } from "@/assets/icons";
import DynamicTagSelect from "@/components/common/DynamicTagSelect";
import { useAppStore } from "@/store/useAppStore";
import { useRoutineStore } from "@/store/useRoutineStore";

const RoutineOptionSelector = () => {
  const routineOptions = useAppStore((state) => state.routineOptions);

  const selectedRoutineOption = useRoutineStore(
    (state) => state.selectedRoutineOption,
  );
  const setRoutineOption = useRoutineStore((state) => state.setRoutineOption);

  return (
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
  );
};

export default RoutineOptionSelector;
