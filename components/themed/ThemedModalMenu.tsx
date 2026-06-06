import { ErrorIcon, SuccessIcon } from "@/assets/icons";
import { useAppTheme } from "@/contexts/ThemeContext";
import { ThemedModalMenuProps } from "@/interfaces/interfaces";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, Pressable, View, ViewStyle } from "react-native";
import { ErrorCard, Spacer } from "../common";
import CustomModal from "../common/CustomModal";
import ThemedAlertWindow from "./ThemedAlertWindow";
import ThemedPressable from "./ThemedPressable";
import ThemedText from "./ThemedText";
import ThemedTextInput from "./ThemedTextInput";
import ThemedView from "./ThemedView";

const ThemedModalMenu = ({
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
  addSearchBar = false,
  ...props
}: ThemedModalMenuProps) => {
  const MODAL_HEIGHT = Dimensions.get("window").height * 0.6;
  const [modalVisible, setModalVisible] = useState<{
    alert: boolean;
    mainModal: boolean;
  }>({ alert: false, mainModal: false });
  const [searchText, setSearchText] = useState<string>("");

  const { theme } = useAppTheme();
  const colors = theme.colors;

  const { error, success, dynamicColorText } = useMemo(() => {
    const success = errorText === "Success!";
    const error: boolean =
      errorText !== undefined && errorText !== "" && errorText !== "Success!";
    return {
      success,
      error,
      dynamicColorText: error
        ? colors.error
        : success
          ? colors.success
          : noFill
            ? colors.primary
            : colors.base300,
    };
  }, [errorText, colors, noFill]);

  const statusIconStyle: ViewStyle = {
    alignSelf: "center" as const,
    marginHorizontal: 4,
  };

  const openModal = useCallback(() => {
    if (alertCondition?.visible) {
      setModalVisible((prev) => ({ ...prev, alert: true }));
    } else {
      setModalVisible((prev) => ({ ...prev, mainModal: true }));
    }
  }, [alertCondition?.visible]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.toString().localeCompare(b.toString()));
  }, [data]);

  const filteredResults = useMemo(() => {
    return sortedData.filter((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [sortedData, searchText]);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <ThemedView style={{ backgroundColor: colors.base300, padding: 8 }}>
        <ThemedPressable
          onPress={() => {
            setItem(item);
            setModalVisible((prev) => ({
              ...prev,
              mainModal: false,
            }));
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
    ),
    [setItem],
  );

  return (
    <View>
      <View style={{ padding: 4 }}>
        {iconProperties?.showIconOnly ? (
          <Pressable
            style={[{ alignSelf: "center" }, pressableStyle]}
            onPress={openModal}
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
            onPress={openModal}
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
              type={
                error
                  ? "errorContent"
                  : noFill
                    ? "baseContent"
                    : "primaryContent"
              }
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
            visible={modalVisible.alert}
            onConfirm={() => {
              setModalVisible((prev) => ({ ...prev, alert: false }));
            }}
            onClose={() => {
              setModalVisible((prev) => ({ ...prev, alert: false }));
            }}
          />
        )}
        <CustomModal
          modalVisible={modalVisible.mainModal}
          animationType="fade"
          setModalVisible={(isVisible) => {
            if (!isVisible)
              setModalVisible((prev) => ({ ...prev, mainModal: false }));
          }}
        >
          <ThemedView
            style={{
              width: "100%",
              maxHeight: "100%",
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: colors.base100,
            }}
          >
            <ThemedText
              type="baseContent"
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
              data={filteredResults}
              keyExtractor={(item) => item.toString()}
              ListHeaderComponent={() =>
                addSearchBar && (
                  <ThemedTextInput
                    title="Type to Search"
                    value={searchText}
                    onChangeText={setSearchText}
                    blendColor={colors.base300}
                  />
                )
              }
              ListHeaderComponentStyle={{ backgroundColor: colors.base300 }}
              renderItem={renderItem}
              ListEmptyComponent={
                <ThemedText
                  style={{
                    backgroundColor: colors.base300,
                    padding: 12,
                    fontWeight: "700",
                    opacity: 0.9,
                  }}
                >
                  {filteredResults.length === 0 && addSearchBar
                    ? `No results found for "${searchText}"`
                    : "No items available"}
                </ThemedText>
              }
            />
            {cancelable && (
              <ThemedView
                style={{ backgroundColor: colors.base300, padding: 8 }}
              >
                <ThemedPressable
                  noFill
                  style={{
                    alignSelf: "flex-end",
                    width: "32%",
                    alignItems: "center",
                  }}
                  onPress={() =>
                    setModalVisible((prev) => ({ ...prev, mainModal: false }))
                  }
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

export default ThemedModalMenu;
