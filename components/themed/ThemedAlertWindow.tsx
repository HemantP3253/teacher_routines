import { useAppTheme } from "@/contexts/ThemeContext";
import { ThemedAlertWindowProps } from "@/interfaces/interfaces";
import React from "react";
import { View } from "react-native";
import { Spacer } from "../common";
import CustomModal from "../common/CustomModal";
import ThemedPressable from "./ThemedPressable";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const ThemedAlertWindow = ({
  title,
  description,
  okButton = true,
  cancelButton = false,
  visible,
  onClose,
  onConfirm,
}: ThemedAlertWindowProps) => {
  const handleOk = () => {
    if (onConfirm) onConfirm();
    return;
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  const { theme } = useAppTheme();
  const colors = theme.colors;

  return (
    <CustomModal
      animationType="fade"
      modalVisible={visible}
      setModalVisible={onClose ?? onConfirm}
    >
      <ThemedView
        style={{
          alignContent: "center",
          width: "100%",
          borderRadius: 16,
        }}
      >
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "800",
            padding: 8,
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
        >
          {title}
        </ThemedText>

        <Spacer lineVisible lineColor={colors.accent} />

        <ThemedText
          style={{
            fontSize: 14,
            padding: 8,
            paddingHorizontal: 16,
            textAlign: "justify",
          }}
        >
          {description}
        </ThemedText>

        <Spacer size={60} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingBottom: 8,
            paddingRight: 8,
          }}
        >
          {cancelButton && (
            <ThemedPressable
              noFill
              onPress={handleCancel}
              style={{
                width: "20%",
                alignItems: "center",
                borderColor: colors.secondary,
              }}
            >
              <ThemedText>Cancel</ThemedText>
            </ThemedPressable>
          )}

          {okButton && (
            <ThemedPressable
              noFill
              onPress={handleOk}
              style={{
                width: "20%",
                alignItems: "center",
                borderColor: colors.primary,
              }}
            >
              <ThemedText>OK</ThemedText>
            </ThemedPressable>
          )}
        </View>
      </ThemedView>
    </CustomModal>
  );
};

export default ThemedAlertWindow;
