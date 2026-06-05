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
    setIsLoading(true); // Force start
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCachedUserInfo(null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setCachedUserInfo(data);
    } catch (err) {
      setCachedUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUserProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        getCurrentUserProfile();
      }
      if (event === "SIGNED_OUT") {
        setCachedUserInfo(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [getCurrentUserProfile]);

  useEffect(() => {
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
          if (JSON.stringify(payload.new) !== JSON.stringify(cachedUserInfo)) {
            setCachedUserInfo(payload.new as UserProfileProps);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [cachedUserInfo?.id]);

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
