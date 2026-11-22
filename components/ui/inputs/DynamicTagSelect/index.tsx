import { AddIcon, ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { IconProperties, MenuProps } from "@/types/common";
import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ActionableHeaderCard } from "../../cards";
import TagChip from "./TagChip";

interface DynamicTagSelectProps<T> extends MenuProps<T> {
  showDropDown?: boolean;
  initialValue: T | null;
  Icon?: IconProperties["Icon"];
  onSelect?: (index: number) => void;
  defaultAddButton?: {
    label?: string;
    onPress: () => void;
  };
}

const DynamicTagSelect = <T,>({
  data,
  title,
  initialValue,
  showDropDown = true,
  Icon,
  getId,
  getLabel,
  onSelect,
  defaultAddButton,
}: DynamicTagSelectProps<T>) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const [isExpanded, setIsExpanded] = useState<boolean>(
    showDropDown ? false : true,
  );
  const [selectedTag, setSelectedTag] = useState<T | undefined>(
    initialValue ?? undefined,
  );

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
                  selected={selectedTag ? getId(selectedTag) === id : false}
                />
              );
            })}

            {defaultAddButton && (
              <TagChip
                Icon={AddIcon}
                dottedBorder
                label={defaultAddButton?.label ?? "Add New Item"}
                selected={false}
                fill={false}
                onPress={defaultAddButton?.onPress}
              />
            )}
          </View>
        </>
      )}
    </ActionableHeaderCard>
  );
};

export default DynamicTagSelect;
