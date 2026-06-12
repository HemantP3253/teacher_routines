import { AddIcon, ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { ActionableHeaderCard } from "@/components/routines";
import { DynamicTagSelectProps } from "@/interfaces/interfaces";
import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import TagChip from "./TagChip";

const DynamicTagSelect = <T,>({
  data,
  showAddButton = false,
  title,
  showDropDown = true,
  Icon,
  getLabel,
  onSelect,
}: DynamicTagSelectProps<T>) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const [isExpanded, setIsExpanded] = useState<boolean>(
    showDropDown ? false : true,
  );
  const [selectedTag, setSelectedTag] = useState<number>(0);

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
      summaryText={!isExpanded ? getLabel(data[selectedTag]) : undefined}
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
              return (
                <TagChip
                  key={index}
                  label={label}
                  onPress={() => {
                    onSelect?.(index);
                    setSelectedTag(index);
                  }}
                  selected={selectedTag === index}
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
              />
            )}
          </View>
        </>
      )}
    </ActionableHeaderCard>
  );
};

export default DynamicTagSelect;
