import { UserProfileProps } from "@/interfaces/interfaces";
import { supabase } from "@/services/supabase";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface UserContextType {
  userInfo: UserProfileProps | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserInfoContext = createContext<UserContextType | undefined>(undefined);

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [cachedUserInfo, setCachedUserInfo] = useState<UserProfileProps | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCurrentUserProfile = useCallback(async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setCachedUserInfo(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) throw error;

      setCachedUserInfo(data || null);
    } catch (error: any) {
      console.error("Error while getting current user: ", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUserProfile();

    if (!cachedUserInfo?.id) return;

    const channelInstanceId = `user-row-sync-${cachedUserInfo.id}`;

    const profileSubscription = supabase
      .channel(channelInstanceId)
      .on(
        "postgres_changes",
        {
          event: "UPDATE" as const,
          schema: "public",
          table: "profiles",
          filter: `id=eq.${cachedUserInfo.id}`,
        },
        (payload) => {
          const updatedRecord = payload.new as UserProfileProps;
          if (updatedRecord) setCachedUserInfo(updatedRecord);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [getCurrentUserProfile, cachedUserInfo?.id]);

  const contextValue = useMemo(
    () => ({
      userInfo: cachedUserInfo,
      isLoading,
      refreshUser: getCurrentUserProfile,
    }),
    [cachedUserInfo, isLoading, getCurrentUserProfile],
  );

  return (
    <UserInfoContext.Provider value={contextValue}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (!context)
    throw new Error("useUserInfo must be used within a UserInfoProvider");

  return context;
};
