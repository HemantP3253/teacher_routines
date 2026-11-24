import { MenuProps } from "@/types/common";
import { sortByLabel } from "@/utils/sortUtils";
import { useCallback, useMemo, useState } from "react";
import { FlatList, ListRenderItem, Pressable, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { CustomModal } from "../../overlays";
import { CustomModalProps } from "../../overlays/CustomModal";
import {
  AppLinearGradient,
  CustomPressable,
  CustomText,
} from "../../primitives";
import CustomTextInput from "../CustomTextInput";

interface ModalMenuProps<T> extends MenuProps<T>, CustomModalProps {
  onItemSelect?: (selectedItem: T | null) => void;
  addSearchBar?: boolean;
  buttonProperties?: {
    cancelable?: boolean;
    clearable?: boolean;
  };
  renderOption?: ListRenderItem<T>;
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
  renderOption,
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
      <Pressable
        onPress={() => {
          onItemSelect?.(item);
          setModalVisible(false);
        }}
        style={{
          width: "100%",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <AppLinearGradient
          type="surfaceElevated"
          style={{
            borderRadius: 8,
            padding: 8,
          }}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <CustomText
            type="text"
            style={{
              fontWeight: "600",
              flexWrap: "wrap",
              flexShrink: 1,
            }}
          >
            {getLabel(item)}
          </CustomText>

          {getSublabel && (
            <CustomText type="text">{getSublabel(item)}</CustomText>
          )}
        </AppLinearGradient>
      </Pressable>
    ),
    [onItemSelect, getLabel, getSublabel, setModalVisible],
  );

  return (
    <CustomModal
      modalVisible={modalVisible}
      animationType="fade"
      setModalVisible={(isVisible) => {
        if (!isVisible) setModalVisible(false);
      }}
    >
      <AppLinearGradient
        type="background"
        style={{
          width: "100%",
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <AppLinearGradient type="surface">
          <CustomText
            type="text"
            style={{
              fontSize: 18,
              padding: 8,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            {title}
          </CustomText>
        </AppLinearGradient>
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => getId(item)}
          ListHeaderComponent={() =>
            addSearchBar &&
            data.length !== 0 && (
              <CustomTextInput
                title="Type to Search"
                value={searchText}
                onChangeText={setSearchText}
                blendColor={colors.surfaceElevated}
              />
            )
          }
          contentContainerStyle={{
            gap: 8,
            padding: 8,
          }}
          renderItem={renderOption ?? renderItem}
          ListEmptyComponent={
            <CustomText
              style={{
                padding: 12,
                fontWeight: "700",
                opacity: 0.9,
              }}
            >
              {filteredResults.length === 0 && addSearchBar && searchText
                ? `No results found for "${searchText}"`
                : "No items available"}
            </CustomText>
          }
        />
        {buttonProperties.clearable && (
          <View style={{ padding: 8 }}>
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
          </View>
        )}
        {buttonProperties.cancelable && (
          <View style={{ padding: 8 }}>
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
          </View>
        )}
      </AppLinearGradient>
    </CustomModal>
  );
};

export default ModalMenu;
