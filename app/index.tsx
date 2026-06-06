import { useUserInfo } from "@/contexts/UserInfoContext";
import { Redirect } from "expo-router";

export default function EntryPoint() {
  const { userInfo, isLoading } = useUserInfo();

  if (isLoading) return null;

  if (!userInfo) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Redirect href={userInfo.is_admin ? "/(admin)/home" : "/(user)/home"} />
  );
}
