import { CustomSvgProps } from "@/types/common";
import { FC } from "react";
import { Pressable, PressableProps, Switch } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { CustomText, CustomView } from "../primitives";

interface ThemedOptionsCardProps extends PressableProps {
  Icon?: FC<CustomSvgProps>;
  label: string;
  description?: string;
  switchValue?: boolean;
  switchOnValueChange?: () => void;
}

const ThemedOptionsCard = ({
  Icon,
  description,
  switchOnValueChange,
  switchValue,
  onPress,
  label,
  ...props
}: ThemedOptionsCardProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  return (
    <Pressable
      onPress={onPress ? onPress : switchOnValueChange}
      style={{ flexDirection: "row", alignItems: "center", minHeight: 32 }}
      {...props}
    >
      {Icon && (
        <CustomView style={{ marginLeft: 8 }}>
          <Icon height={24} width={24} fill={colors.primary} />
        </CustomView>
      )}
      <CustomView style={{ flex: 1, marginLeft: 8 }}>
        <CustomText type="text" style={{ fontSize: 16, fontWeight: "600" }}>
          {label}
        </CustomText>
        {description && (
          <CustomText type="text" style={{ fontSize: 14 }}>
            {description}
          </CustomText>
        )}
      </CustomView>
      {switchOnValueChange && (
        <Switch
          value={switchValue}
          onValueChange={switchOnValueChange}
          trackColor={{ false: colors.surfaceElevated, true: colors.primary }}
          thumbColor={colors.accent}
          style={{ alignItems: "center", marginHorizontal: 8 }}
        />
      )}
    </Pressable>
  );
};

export default ThemedOptionsCard;
