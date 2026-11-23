import { ErrorIcon, SuccessIcon } from "@/assets/icons";
import { AlertCondition, IconProperties, MenuProps } from "@/types/common";
import { sortByLabel } from "@/utils/sortUtils";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Spacer } from "../../layout";
import { AlertDialog, CustomModal } from "../../overlays";
import { CustomPressable, CustomText, CustomView } from "../../primitives";
import { StatusCard } from "../../status";
import CustomTextInput from "../CustomTextInput";

interface ModalMenuProps<T> extends MenuProps<T>, PressableProps {
  selectedItem: T | null;
  onItemSelect?: (selectedId: string) => void;
  type?: string;

  noFill?: boolean;
  addSearchBar?: boolean;
  errorText?: string;

  alertCondition?: AlertCondition;

  pressableStyle?: StyleProp<ViewStyle>;

  buttonProperties?: {
    cancelable?: boolean;
    clearable?: boolean;
  };
  iconProperties?: IconProperties;
}

const ModalMenu = <T,>({
  data,
  sortType,
  selectedItem,
  onItemSelect,
  title,
  type,
  getId,
  getLabel,
  getSublabel,
  noFill,
  errorText,
  alertCondition,
  buttonProperties = { cancelable: true },
  pressableStyle,
  iconProperties,
  addSearchBar = false,
  ...props
}: ModalMenuProps<T>) => {
  const [modalVisible, setModalVisible] = useState<{
    alert: boolean;
    mainModal: boolean;
  }>({ alert: false, mainModal: false });
  const [searchText, setSearchText] = useState<string>("");

  const { theme } = useUnistyles();
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
            : colors.surfaceElevated,
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

  const sortedData = useMemo(
    () => sortByLabel(data, getLabel, sortType),
    [data, getLabel, sortType],
  );

  const filteredResults = useMemo(() => {
    return sortedData.filter((value) =>
      getLabel(value)
        .toString()
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    );
  }, [sortedData, searchText, getLabel]);

  const renderItem = useCallback(
    ({ item }: { item: T }) => {
      const id = getId(item);

      return (
        <CustomView
          style={{
            backgroundColor: colors.surfaceElevated,
            padding: 8,
          }}
        >
          <CustomPressable
            onPress={() => {
              onItemSelect?.(id);
              setModalVisible((prev) => ({
                ...prev,
                mainModal: false,
              }));
            }}
            style={{
              paddingVertical: 8,
              width: "100%",
              alignItems: "stretch",
              justifyContent: "center",
            }}
          >
            <CustomText
              type="primaryContent"
              style={{
                textAlign: "center",
                fontWeight: "600",
                flexShrink: 1,
              }}
            >
              {getLabel(item)}
            </CustomText>

            {getSublabel && (
              <CustomText type="text">{getSublabel(item)}</CustomText>
            )}
          </CustomPressable>
        </CustomView>
      );
    },
    [onItemSelect, getLabel, getSublabel, colors.surfaceElevated, getId],
  );

  return (
    <View>
      <View style={{ padding: 4 }}>
        {iconProperties?.showIconOnly ? (
          <Pressable
            style={[{ alignSelf: "center" }, pressableStyle]}
            onPress={openModal}
          >
            {iconProperties.Icon && (
              <iconProperties.Icon
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
          <CustomPressable
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
              pressableStyle,
            ]}
          >
            {iconProperties?.Icon && (
              <iconProperties.Icon
                style={{ marginLeft: 4 }}
                fill={dynamicColorText}
              />
            )}
            <CustomText
              type={error ? "errorContent" : noFill ? "text" : "primaryContent"}
              style={{ fontSize: 16, paddingHorizontal: 8 }}
            >
              {selectedItem == null
                ? title
                : type
                  ? `${type}: ${getLabel(selectedItem)}`
                  : `${getLabel(selectedItem)}`}
            </CustomText>

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
          </CustomPressable>
        )}
        {alertCondition && (
          <AlertDialog
            title={alertCondition?.title ?? "Action Required"}
            description={
              alertCondition?.description ??
              "Please select a required field first."
            }
            visible={modalVisible.alert}
            onConfirm={() =>
              setModalVisible((prev) => ({ ...prev, alert: false }))
            }
            onClose={() =>
              setModalVisible((prev) => ({ ...prev, alert: false }))
            }
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
          <CustomView
            style={{
              width: "100%",
              maxHeight: "100%",
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: colors.background,
            }}
          >
            <CustomText
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
            </CustomText>
            <FlatList
              data={filteredResults}
              keyExtractor={(item) => getId(item)}
              ListHeaderComponent={() =>
                addSearchBar && (
                  <CustomTextInput
                    title="Type to Search"
                    value={searchText}
                    onChangeText={setSearchText}
                    blendColor={colors.surfaceElevated}
                  />
                )
              }
              ListHeaderComponentStyle={{
                backgroundColor: colors.surfaceElevated,
              }}
              renderItem={renderItem}
              ListEmptyComponent={
                <CustomText
                  style={{
                    backgroundColor: colors.surfaceElevated,
                    padding: 12,
                    fontWeight: "700",
                    opacity: 0.9,
                  }}
                >
                  {filteredResults.length === 0 && addSearchBar
                    ? `No results found for "${searchText}"`
                    : "No items available"}
                </CustomText>
              }
            />
            {buttonProperties.clearable && (
              <CustomView
                style={{ backgroundColor: colors.surfaceElevated, padding: 8 }}
              >
                <CustomPressable
                  noFill
                  style={{
                    alignSelf: "flex-end",
                    width: "32%",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    onItemSelect?.("");
                    setModalVisible((prev) => ({ ...prev, mainModal: false }));
                  }}
                >
                  <CustomText style={{ fontWeight: "600" }}>Clear</CustomText>
                </CustomPressable>
              </CustomView>
            )}
            {buttonProperties.cancelable && (
              <CustomView
                style={{ backgroundColor: colors.surfaceElevated, padding: 8 }}
              >
                <CustomPressable
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
                  <CustomText style={{ fontWeight: "600" }}>Cancel</CustomText>
                </CustomPressable>
              </CustomView>
            )}
          </CustomView>
        </CustomModal>
      </View>
      {error && <StatusCard variant="error" message={errorText} />}
    </View>
  );
};

export default ModalMenu;
