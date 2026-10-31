import { AddIcon, ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { ActionableHeaderCard } from "@/components/routines";
import { IconProperties, MenuProps } from "@/types/common";
import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import TagChip from "./TagChip";

interface DynamicTagSelectProps<T> extends MenuProps<T> {
  showAddButton?: boolean;
  showDropDown?: boolean;
  Icon?: IconProperties["Icon"];
  onSelect?: (index: number) => void;
  addButtonProperties?: {
    onPress: () => void;
  };
}

const DynamicTagSelect = <T,>({
  data,
  showAddButton = false,
  title,
  showDropDown = true,
  Icon,
  getId,
  getLabel,
  onSelect,
  addButtonProperties,
}: DynamicTagSelectProps<T>) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const [isExpanded, setIsExpanded] = useState<boolean>(
    showDropDown ? false : true,
  );
  const [selectedTag, setSelectedTag] = useState<T | undefined>(data[0]);

  return (
    <ActionableHeaderCard
      title={title}
      IconBeforeText={Icon}
      iconProperties={{
        Icon: isExpanded ? ArrowUpIcon : ArrowDownIcon,
        height: 32,
        width: 32,
        onPress: () => setIsExpanded(!isExpanded),
      }}
      isDataLoading={false}
      showBottomBorder={isExpanded}
      summaryText={
        !isExpanded && selectedTag ? getLabel(selectedTag) : undefined
      }
    >
      {isExpanded && (
        <>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 4,
              margin: 2,
              padding: 2,
              borderColor: colors.primary,
            }}
          >
            {data.map((item, index) => {
              const label = getLabel(item);
              const id = getId(item);

              return (
                <TagChip
                  key={id}
                  label={label}
                  onPress={() => {
                    onSelect?.(index);
                    setSelectedTag(item);
                  }}
                  selected={selectedTag === item}
                />
              );
            })}

            {showAddButton && (
              <TagChip
                Icon={AddIcon}
                dottedBorder
                label={"Add New Item"}
                selected={false}
                fill={false}
                onPress={addButtonProperties?.onPress}
              />
            )}
          </View>
        </>
      )}
    </ActionableHeaderCard>
  );
};

export default DynamicTagSelect;
