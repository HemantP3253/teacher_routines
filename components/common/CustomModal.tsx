import { BlurView } from "expo-blur";
import { ReactNode, RefObject } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  ModalProps,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

interface CustomModalProps extends ModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children?: ReactNode;
  blurTarget?: RefObject<View | null>;
}

const CustomModal = ({
  modalVisible,
  setModalVisible,
  children,
  animationType = "fade",
  ...props
}: CustomModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType={animationType}
      onRequestClose={() => setModalVisible(false)}
      {...props}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable
          style={[StyleSheet.absoluteFill]}
          onPress={() => setModalVisible(false)}
        >
          <BlurView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            tint="systemThickMaterialDark"
            intensity={10}
            blurTarget={props.blurTarget}
            blurMethod="dimezisBlurView"
          >
            <Pressable
              style={{ width: "100%", maxWidth: 400 }}
              onPress={(e) => e.stopPropagation()}
            >
              {children}
            </Pressable>
          </BlurView>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomModal;
