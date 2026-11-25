import { MenuProps } from "@/types/common";
import { sortByLabel } from "@/utils/sortUtils";
import { useCallback, useMemo, useState } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { CustomModal } from "../../overlays";
import { CustomModalProps } from "../../overlays/CustomModal";
import {
  AppLinearGradient,
  CustomPressable,
  CustomText,
} from "../../primitives";
import CustomTextInput from "../CustomTextInput";

interface ModalMenuProps<T> extends MenuProps<T>, CustomModalProps {
  selectedItem?: T | null;
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
  selectedItem,
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

  const selectedId = selectedItem ? getId(selectedItem) : null;

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
      const isSelected = id === selectedId;

      return (
        <CustomPressable
          inline
          onPress={() => {
            setModalVisible(false);
            requestAnimationFrame(() => {
              onItemSelect?.(item);
            });
          }}
          style={styles.menuItemContainer}
        >
          <AppLinearGradient
            type={"surfaceElevated"}
            style={[isSelected && styles.selectedItem, styles.menuItemGradient]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
          >
            <CustomText type="text" style={styles.menuItemLabel}>
              {getLabel(item)}
            </CustomText>

            {getSublabel && (
              <CustomText type="text">{getSublabel(item)}</CustomText>
            )}
          </AppLinearGradient>
        </CustomPressable>
      );
    },
    [getId, selectedId, onItemSelect, getLabel, getSublabel, setModalVisible],
  );

  return (
    <CustomModal
      modalVisible={modalVisible}
      animationType="fade"
      setModalVisible={(isVisible) => {
        if (!isVisible) setModalVisible(false);
      }}
    >
      <AppLinearGradient type="background" style={styles.rootContainer}>
        <AppLinearGradient type="surface">
          <CustomText type="text" style={styles.titleText}>
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
          contentContainerStyle={styles.menuList}
          renderItem={renderOption ?? renderItem}
          ListEmptyComponent={
            <CustomText style={styles.emptyListText}>
              {filteredResults.length === 0 && addSearchBar && searchText
                ? `No results found for "${searchText}"`
                : "No items available"}
            </CustomText>
          }
        />
        <View style={styles.footerButtonContainer}>
          {buttonProperties.clearable && (
            <CustomPressable
              noFill
              style={styles.footerButton}
              onPress={() => {
                onItemSelect?.(null);
                setModalVisible(false);
              }}
            >
              <CustomText style={{ fontWeight: "600" }}>Clear</CustomText>
            </CustomPressable>
          )}
          {buttonProperties.cancelable && (
            <CustomPressable
              noFill
              style={[styles.footerButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <CustomText style={{ fontWeight: "600" }}>Cancel</CustomText>
            </CustomPressable>
          )}
        </View>
      </AppLinearGradient>
    </CustomModal>
  );
};

const styles = StyleSheet.create(({ colors, spacing, radius }) => ({
  rootContainer: {
    width: "100%",
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedItem: { borderWidth: 1, borderColor: colors.primary },
  menuItemContainer: {
    width: "100%",
    alignItems: "stretch",
    justifyContent: "center",
  },
  menuItemGradient: {
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  menuItemLabel: {
    fontWeight: "600",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  titleText: {
    fontSize: 18,
    padding: spacing.sm,
    fontWeight: "800",
    textAlign: "center",
  },
  menuList: {
    gap: spacing.sm,
    padding: spacing.sm,
  },
  emptyListText: {
    padding: 12,
    fontWeight: "700",
    opacity: 0.9,
  },
  footerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "18%",
    paddingHorizontal: spacing.xs,
  },
  cancelButton: { borderColor: colors.border },
  footerButton: {
    flex: 1,
    alignItems: "center",
    height: "50%",
  },
}));

export default ModalMenu;
