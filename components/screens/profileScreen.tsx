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
import { ThemedStatusBar, ThemedText, ThemedView } from "@/components/themed";
import { useAppTheme } from "@/contexts/ThemeContext";
import { UserProfileProps } from "@/interfaces/interfaces";
import { getCurrentUserId, getUserProfileById } from "@/services/authService";
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

const UserProfileScreen = () => {
  const [userInfo, setUserInfo] = useState<UserProfileProps>({
    id: "",
    username: "",
    full_name: "",
    date_of_birth: "",
    colleges: [],
    gender: "",
    phone: "",
    avatar_url: "",
    is_admin: false,
    approved_by: [],
    address: "",
    rejected_by: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { theme } = useAppTheme();
  const colors = theme.colors;
  const router = useRouter();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) {
          console.error("No authenticated user session");
          setIsLoading(false);
          return;
        }

        const profileData = await getUserProfileById(userId);

        if (profileData) {
          setUserInfo({
            id: userId,
            username: profileData.username,
            full_name: profileData.full_name,
            date_of_birth: profileData.date_of_birth,
            colleges: profileData.colleges,
            gender: profileData.gender,
            address: profileData.address,
            phone: profileData.phone,
            avatar_url: profileData.avatar_url,
            is_admin: !!profileData.is_admin,
            approved_by: profileData.approved_by,
            rejected_by: profileData.rejected_by,
          });
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error("Error while getting profiles: ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (isLoading)
    return (
      <ThemedView style={StyleSheet.absoluteFill}>
        <ActivityIndicator
          animating
          style={{ flex: 1, backgroundColor: "#000000" }}
          size="large"
        />
      </ThemedView>
    );

  return (
    <ThemedView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
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
            {userInfo.avatar_url ? (
              <Image
                source={{ uri: userInfo.avatar_url }}
                height={96}
                width={96}
              />
            ) : (
              <UsernameIcon height={96} width={96} fill={colors.primary} />
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
          type="baseContent"
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
            {userInfo.username ? "@" : ""}
          </ThemedText>
          {userInfo.username ? userInfo.username : "Username not set"}
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
        <ThemedText type="baseContent">
          {userInfo.full_name ? userInfo.full_name : "Name not set"}
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
        <AgeIcon fill={colors.primary} />
        <ThemedText type="baseContent">
          {userInfo.date_of_birth
            ? calculateAgeByDOB(userInfo.date_of_birth)
            : "Date of birth not set"}
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
        <ThemedText type="baseContent">
          {userInfo.gender ? userInfo.gender : "Gender not set"}
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
        <PhoneIcon fill={colors.primary} />
        <ThemedText type="baseContent">
          {userInfo.phone ? "+977 " + userInfo.phone : "Phone not set"}
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
        <AddressIcon fill={colors.primary} />
        <ThemedText type="baseContent">
          {userInfo.address ? userInfo.address : "Address not set"}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default UserProfileScreen;
