import {
  AddressIcon,
  AgeIcon,
  EditIcon,
  GenderIcon,
  NameIcon,
  OptionsIcon,
  PhoneIcon,
  UsernameIcon,
} from "@/assets/icons";
import {
  ThemedLinearGradient,
  ThemedStatusBar,
  ThemedText,
  ThemedView,
} from "@/components/themed";
import { getUserProfileById } from "@/services/profileService";
import { useAuthStore } from "@/store/useAuthStore";
import { LocalProfilesData } from "@/types/localDbTypes";
import { calculateAgeByDOB } from "@/utils/dateUtils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";

const UserProfileScreen = () => {
  const router = useRouter();
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const isLoading = useAuthStore((state) => state.isLoading);
  const userId = useAuthStore((state) => state.userId);
  const [userInfo, setUserInfo] = useState<LocalProfilesData | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) {
        setUserInfo(null);
        return;
      }

      const profile = await getUserProfileById(userId);

      setUserInfo(profile);
    };

    loadUserProfile();
  }, [userId]);

  if (isLoading)
    return (
      <ThemedLinearGradient
        style={[
          StyleSheet.absoluteFill,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator
          animating
          style={{ flex: 1, backgroundColor: colors.primary }}
          size="large"
        />
      </ThemedLinearGradient>
    );

  if (!userInfo) return <ThemedText>No user info available.</ThemedText>;

  return (
    <ThemedLinearGradient
      style={{ flex: 1, paddingTop: StatusBar.currentHeight }}
    >
      <ThemedStatusBar />
      <OptionsIcon
        style={{ alignSelf: "flex-end", margin: 8 }}
        fill={colors.primary}
        onPress={() => router.navigate("/(misc)/options")}
      />
      <ThemedView
        style={{
          alignItems: "center",
          padding: 8,
          margin: 8,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: colors.accent,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <ThemedView style={{ flex: 1 }} />
          <ThemedView style={{ flex: 1, alignItems: "center" }}>
            {userInfo.avatarUrl ? (
              <Image
                source={{ uri: userInfo.avatarUrl }}
                height={96}
                width={96}
              />
            ) : (
              <UsernameIcon size={96} fill={colors.primary} />
            )}
          </ThemedView>
          <ThemedView style={{ flex: 1, alignItems: "flex-end" }}>
            <EditIcon
              style={{ flexDirection: "row", margin: 4 }}
              height={24}
              width={24}
              fill={colors.primary}
            />
          </ThemedView>
        </View>
        <ThemedText
          type="text"
          style={{ color: colors.secondary, fontWeight: "bold", fontSize: 18 }}
        >
          <ThemedText
            style={{
              color: colors.primary,
              fontWeight: "bold",
              fontStyle: "italic",
              fontSize: 18,
            }}
          >
            @
          </ThemedText>
          {userInfo.username}
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <NameIcon fill={colors.primary} />
        <ThemedText type="text">{userInfo.fullName}</ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <AgeIcon fill={colors.primary} />
        <ThemedText type="text">
          {calculateAgeByDOB(userInfo.dateOfBirth)}
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <GenderIcon fill={colors.primary} />
        <ThemedText type="text">{userInfo.gender}</ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <PhoneIcon fill={colors.primary} />
        <ThemedText type="text">{userInfo.phone}</ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <AddressIcon fill={colors.primary} />
        <ThemedText type="text">
          {userInfo.address ? userInfo.address : "Address not set"}
        </ThemedText>
      </ThemedView>
    </ThemedLinearGradient>
  );
};

// TODO: Refactor and add styles here

export default UserProfileScreen;
