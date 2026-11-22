import React from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Spacer } from "../layout";
import { CustomPressable, CustomText, CustomView } from "../primitives";
import CustomModal from "./CustomModal";

interface AlertDialogProps {
  title: string;
  description?: string;
  okButton?: boolean;
  cancelButton?: boolean;
  visible: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onConfirm?: () => void;
}

const AlertDialog = ({
  title,
  description,
  okButton = true,
  cancelButton = false,
  visible,
  onClose,
  onConfirm,
}: AlertDialogProps) => {
  const handleOk = () => {
    if (onConfirm) onConfirm();
    return;
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  const { theme } = useUnistyles();
  const colors = theme.colors;

  return (
    <CustomModal
      animationType="fade"
      modalVisible={visible}
      setModalVisible={onClose ?? onConfirm}
    >
      <CustomView
        style={{
          alignContent: "center",
          width: "100%",
          borderRadius: 16,
        }}
      >
        <CustomText
          style={{
            fontSize: 18,
            fontWeight: "800",
            padding: 8,
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
        >
          {title}
        </CustomText>

        <Spacer line={{ color: colors.accent }} />

        <CustomText
          style={{
            fontSize: 14,
            padding: 8,
            paddingHorizontal: 16,
            textAlign: "justify",
          }}
        >
          {description}
        </CustomText>

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
            <CustomPressable
              noFill
              onPress={handleCancel}
              style={{
                width: "20%",
                alignItems: "center",
                borderColor: colors.secondary,
              }}
            >
              <CustomText>Cancel</CustomText>
            </CustomPressable>
          )}

          {okButton && (
            <CustomPressable
              noFill
              onPress={handleOk}
              style={{
                width: "20%",
                alignItems: "center",
                borderColor: colors.primary,
              }}
            >
              <CustomText>OK</CustomText>
            </CustomPressable>
          )}
        </View>
      </CustomView>
    </CustomModal>
  );
};

export default AlertDialog;
