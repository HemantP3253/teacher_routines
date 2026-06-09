import { ErrorIcon, SuccessIcon } from "@/assets/icons";
import { ThemedModalInputProps } from "@/interfaces/interfaces";
import { useState } from "react";
import { FlatList, Pressable, View, ViewStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ErrorCard, Spacer } from "../common";
import CustomModal from "../common/CustomModal";
import ThemedAlertWindow from "./ThemedAlertWindow";
import ThemedPressable from "./ThemedPressable";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const ThemedModalInput = ({
  data,
  item,
  setItem,
  title,
  type,
  noFill,
  Icon,
  errorText,
  alertCondition,
  cancelable = true,
  hideItemType,
  pressableStyle,
  iconProperties,
  ...props
}: ThemedModalInputProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const error: boolean =
    errorText === undefined
      ? false
      : errorText !== "" && errorText !== "Success!";
  const success: boolean =
    errorText === undefined ? false : errorText === "Success!";
  const dynamicColorText = error
    ? colors.error
    : success
      ? colors.success
      : noFill
        ? colors.primary
        : colors.surfaceElevated;

  const statusIconStyle: ViewStyle = {
    alignSelf: "center" as const,
    marginHorizontal: 4,
  };

  return (
    <View>
      <View style={{ padding: 4 }}>
        {iconProperties?.showIconOnly ? (
          <Pressable
            style={{ alignSelf: "center" }}
            onPress={() => setModalVisible(true)}
          >
            {Icon && (
              <Icon
                fillItem={iconProperties.iconFill}
                fill={iconProperties.iconFillColor}
                height={
                  iconProperties.size
                    ? iconProperties.size
                    : (iconProperties.height ?? 24)
                }
                width={
                  iconProperties.size
                    ? iconProperties.size
                    : (iconProperties.width ?? 24)
                }
              />
            )}
          </Pressable>
        ) : (
          <ThemedPressable
            noFill={noFill}
            onPress={() => setModalVisible(true)}
            style={(state) => [
              {
                height: 52,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                borderColor: dynamicColorText,
                backgroundColor: noFill
                  ? undefined
                  : error
                    ? colors.error + 80
                    : `${colors.primary}DA`,
              },
              props.style
                ? typeof props.style === "function"
                  ? props.style(state)
                  : props.style
                : undefined,
            ]}
          >
            {Icon && <Icon style={{ marginLeft: 4 }} fill={dynamicColorText} />}
            <ThemedText
              type={error ? "errorContent" : noFill ? "text" : "primaryContent"}
              style={{ fontSize: 16, paddingHorizontal: 8 }}
            >
              {item === ""
                ? title
                : hideItemType
                  ? `${item}`
                  : `${type}: ${item}`}
            </ThemedText>

            <Spacer horizontal style={{ flex: 1 }} />

            {error && (
              <ErrorIcon
                fill={colors.error}
                height={24}
                width={24}
                style={statusIconStyle}
              />
            )}

            {success && (
              <SuccessIcon
                fill={colors.success}
                height={24}
                width={24}
                style={statusIconStyle}
              />
            )}
          </ThemedPressable>
        )}
        {alertCondition && (
          <ThemedAlertWindow
            title={alertCondition?.alertTitle ?? "Action Required"}
            description={
              alertCondition?.alertDescription ??
              "Please select a required field first."
            }
            visible={modalVisible}
            onConfirm={() => setModalVisible(false)}
            onClose={() => setModalVisible(false)}
          />
        )}
        <CustomModal
          modalVisible={modalVisible}
          animationType="fade"
          setModalVisible={setModalVisible}
        >
          <ThemedView
            style={{
              width: "100%",
              maxHeight: "100%",
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: colors.background,
            }}
          >
            <ThemedText
              type="text"
              style={{
                fontSize: 18,
                padding: 8,
                fontWeight: "800",
                textAlign: "center",
                margin: 4,
              }}
            >
              {title}
            </ThemedText>
            <FlatList
              data={data}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <ThemedView
                  style={{
                    backgroundColor: colors.surfaceElevated,
                    padding: 8,
                  }}
                >
                  <ThemedPressable
                    onPress={() => {
                      setItem(item);
                      setModalVisible(false);
                    }}
                  >
                    <ThemedText
                      type="primaryContent"
                      style={{ textAlign: "center", fontWeight: "600" }}
                    >
                      {item}
                    </ThemedText>
                  </ThemedPressable>
                </ThemedView>
              )}
            />
            {cancelable && (
              <ThemedView
                style={{ backgroundColor: colors.surfaceElevated, padding: 8 }}
              >
                <ThemedPressable
                  noFill
                  style={{
                    alignSelf: "flex-end",
                    width: "32%",
                    alignItems: "center",
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText style={{ fontWeight: "600" }}>Cancel</ThemedText>
                </ThemedPressable>
              </ThemedView>
            )}
          </ThemedView>
        </CustomModal>
      </View>
      {error && <ErrorCard errorText={errorText} />}
    </View>
  );
};

export default ThemedModalInput;
