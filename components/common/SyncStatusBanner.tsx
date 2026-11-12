import { InfoIcon } from "@/assets/icons";
import SyncIcon from "@/assets/icons/SyncIcon";
import { useAppSyncStore } from "@/store/useAppSyncStore";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ThemedText } from "../themed";
import CustomModal from "./CustomModal";

const SyncStatusBanner = () => {
  const { top } = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const isSyncing = useAppSyncStore((state) => state.isSyncing);
  // const isSyncing = true;
  const isOnline = useAppSyncStore((state) => state.isOnline);
  const isAppActive = useAppSyncStore((state) => state.isAppActive);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isSyncing) {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 2500,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    } else {
      cancelAnimation(rotation);
    }
  }, [isSyncing, rotation]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }),
    [],
  );

  const syncText =
    isOnline && isAppActive
      ? "Syncing changes... Please wait."
      : "You're offline. Changes will be synced later.";
  const backgroundColor = !isOnline ? colors.error : colors.info;

  if (isOnline && !isSyncing) return null;

  return (
    <View
      style={[
        styles.rootContainer,
        { top: top, backgroundColor: backgroundColor },
      ]}
    >
      {syncText === "Syncing changes... Please wait." && (
        <Animated.View style={animatedStyle}>
          <SyncIcon fill={colors.infoContent} />
        </Animated.View>
      )}
      <ThemedText type="infoContent" style={styles.syncMessage}>
        {syncText}
      </ThemedText>
      <InfoIcon
        onPress={(event) => {
          event.stopPropagation();
          setModalVisible(true);
        }}
        fill={colors.infoContent}
      />
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{ flex: 1 }}
      >
        <View
          style={{
            backgroundColor: colors.info,
          }}
        >
          <ThemedText type="text" style={{ color: "white" }}>
            Please wait while we sync your data. This may take a while.
          </ThemedText>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create(({ colors, spacing, radius }) => ({
  rootContainer: {
    backgroundColor: colors.info,
    position: "absolute",
    zIndex: 9999,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    flex: 1,
    borderRadius: radius.md,
    margin: spacing.sm,
    padding: spacing.sm,
  },
  syncMessage: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
}));

export default SyncStatusBanner;
