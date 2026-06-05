import { CustomModalProps } from "@/interfaces/interfaces";
import { BlurView } from "expo-blur";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";

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
            experimentalBlurMethod="dimezisBlurView"
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
