import { IconProperties } from "@/types/common";
import { Pressable, PressableProps, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Spacer } from "../../layout";
import { CustomText } from "../../primitives";

type Description =
  | { target?: string; description?: never }
  | { target?: never; description: string };

interface ModalMenuPressableProps extends PressableProps {
  title: string;
  iconProperties: IconProperties;
  selectedItem?: string | null;
  onPress: () => void;
}

const ModalMenuPressable = ({
  title,
  target,
  selectedItem,
  iconProperties,
  onPress,
  description,
  ...props
}: ModalMenuPressableProps & Description) => {
  const { colors } = useUnistyles().theme;
  const Icon = iconProperties.Icon;
  const noSelectionDescription =
    description ??
    (target ? `No ${target.toLowerCase()} selected` : "No item selected");

  return (
    <Pressable
      style={{
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: "center",
        gap: 8,
        flexDirection: "row",
        padding: 4,
        flexWrap: "wrap",
        borderRadius: 12,
      }}
      {...props}
    >
      {Icon && <Icon size={24} fill={colors.primary} />}
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        <CustomText type="text" style={{ flexWrap: "wrap", fontSize: 16 }}>
          {title}
        </CustomText>
        <Spacer line={{ type: "primaryContainer" }} horizontal useFullWidth />
        <CustomText
          style={{
            flexWrap: "wrap",
            fontSize: 13,
            fontWeight: "700",
            opacity: 0.7,
          }}
        >
          {selectedItem || noSelectionDescription}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default ModalMenuPressable;
