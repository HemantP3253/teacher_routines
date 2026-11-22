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
import { getProfileById } from "@/services/profileService";
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
import { AppLinearGradient, AppStatusBar, CustomText, CustomView } from "../ui";

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

      const profile = await getProfileById(userId);

      setUserInfo(profile);
    };

    loadUserProfile();
  }, [userId]);

  if (isLoading)
    return (
      <AppLinearGradient
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
      </AppLinearGradient>
    );

  if (!userInfo) return <CustomText>No user info available.</CustomText>;

  return (
    <AppLinearGradient style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <AppStatusBar />
      <OptionsIcon
        style={{ alignSelf: "flex-end", margin: 8 }}
        fill={colors.primary}
        onPress={() => router.navigate("/(misc)/options")}
      />
      <CustomView
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
          <CustomView style={{ flex: 1 }} />
          <CustomView style={{ flex: 1, alignItems: "center" }}>
            {userInfo.avatarUrl ? (
              <Image
                source={{ uri: userInfo.avatarUrl }}
                height={96}
                width={96}
              />
            ) : (
              <UsernameIcon size={96} fill={colors.primary} />
            )}
          </CustomView>
          <CustomView style={{ flex: 1, alignItems: "flex-end" }}>
            <EditIcon
              style={{ flexDirection: "row", margin: 4 }}
              height={24}
              width={24}
              fill={colors.primary}
            />
          </CustomView>
        </View>
        <CustomText
          type="text"
          style={{ color: colors.secondary, fontWeight: "bold", fontSize: 18 }}
        >
          <CustomText
            style={{
              color: colors.primary,
              fontWeight: "bold",
              fontStyle: "italic",
              fontSize: 18,
            }}
          >
            @
          </CustomText>
          {userInfo.username}
        </CustomText>
      </CustomView>
      <CustomView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <NameIcon fill={colors.primary} />
        <CustomText type="text">{userInfo.fullName}</CustomText>
      </CustomView>
      <CustomView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <AgeIcon fill={colors.primary} />
        <CustomText type="text">
          {calculateAgeByDOB(userInfo.dateOfBirth)}
        </CustomText>
      </CustomView>
      <CustomView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <GenderIcon fill={colors.primary} />
        <CustomText type="text">{userInfo.gender}</CustomText>
      </CustomView>
      <CustomView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <PhoneIcon fill={colors.primary} />
        <CustomText type="text">{userInfo.phone}</CustomText>
      </CustomView>
      <CustomView
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          paddingLeft: 8,
        }}
      >
        <AddressIcon fill={colors.primary} />
        <CustomText type="text">
          {userInfo.address ? userInfo.address : "Address not set"}
        </CustomText>
      </CustomView>
    </AppLinearGradient>
  );
};

// TODO: Refactor and add styles here

export default UserProfileScreen;
