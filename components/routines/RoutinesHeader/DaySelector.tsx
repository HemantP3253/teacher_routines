import TagChip from "@/components/common/DynamicTagSelect/TagChip";
import { ThemedText } from "@/components/themed";
import { Days } from "@/types/routines";
import { useState } from "react";
import { View } from "react-native";

interface DaySelectorProps {
  initialSelection?: Days[];
  onChange: (days: Days[]) => void;
}

const ALL_DAYS: Days[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DaySelector = ({ initialSelection, onChange }: DaySelectorProps) => {
  const [selectedDaysMap, setSelectedDaysMap] = useState<Record<Days, boolean>>(
    () => {
      const map: Record<Days, boolean> = {
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: false,
        Sunday: false,
      };

      initialSelection?.forEach((day) => {
        if (day in map) {
          map[day] = true;
        }
      });

      return map;
    },
  );
  const handleToggleDay = (day: Days) => {
    setSelectedDaysMap((prev) => {
      const updated = { ...prev, [day]: !prev[day] };

      const activeDays = ALL_DAYS.filter((d) => updated[d]);
      onChange(activeDays);

      return updated;
    });
  };

  return (
    <View>
      <ThemedText>Select Days</ThemedText>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {ALL_DAYS.map((item) => {
          const isSelected = selectedDaysMap[item];
          return (
            <TagChip
              key={item}
              label={item}
              selected={isSelected}
              onPress={() => handleToggleDay(item)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default DaySelector;
