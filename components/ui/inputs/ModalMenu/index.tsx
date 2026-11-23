import { MenuProps } from "@/types/common";
import { sortByLabel } from "@/utils/sortUtils";
import { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { CustomModal } from "../../overlays";
import { CustomModalProps } from "../../overlays/CustomModal";
import { CustomPressable, CustomText, CustomView } from "../../primitives";
import CustomTextInput from "../CustomTextInput";

interface ModalMenuProps<T> extends MenuProps<T>, CustomModalProps {
  onItemSelect?: (selectedItem: T | null) => void;
  addSearchBar?: boolean;
  buttonProperties?: {
    cancelable?: boolean;
    clearable?: boolean;
  };
}

const ModalMenu = <T,>({
  modalVisible,
  setModalVisible,
  data,
  sortType,
  onItemSelect,
  title,
  getId,
  getLabel,
  getSublabel,
  buttonProperties = { cancelable: true },
  addSearchBar = false,
  ...props
}: ModalMenuProps<T>) => {
  const [searchText, setSearchText] = useState<string>("");

  const { theme } = useUnistyles();
  const colors = theme.colors;

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
    ({ item }: { item: T }) => (
      <CustomView
        style={{
          backgroundColor: colors.surfaceElevated,
          padding: 8,
        }}
      >
        <CustomPressable
          onPress={() => {
            onItemSelect?.(item);
            setModalVisible(false);
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
    ),
    [
      onItemSelect,
      getLabel,
      getSublabel,
      colors.surfaceElevated,
      setModalVisible,
    ],
  );

  return (
    <View>
      <CustomModal
        modalVisible={modalVisible}
        animationType="fade"
        setModalVisible={(isVisible) => {
          if (!isVisible) setModalVisible(false);
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
                  onItemSelect?.(null);
                  setModalVisible(false);
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
                onPress={() => setModalVisible(false)}
              >
                <CustomText style={{ fontWeight: "600" }}>Cancel</CustomText>
              </CustomPressable>
            </CustomView>
          )}
        </CustomView>
      </CustomModal>
    </View>
  );
};

export default ModalMenu;
