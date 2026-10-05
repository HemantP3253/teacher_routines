import { getCurrentUserId, getUserProfileById } from "@/services/authService";
import { supabase } from "@/services/supabase";
import { Tables } from "@/types/database";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type UserData = Tables<"profiles">;

interface UserContextType {
  userInfo: UserData | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserInfoContext = createContext<UserContextType | undefined>(undefined);

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [cachedUserInfo, setCachedUserInfo] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentProfile = useCallback(async () => {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      setCachedUserInfo(null);
      return null;
    }

    const profile = await getUserProfileById(currentUserId);
    setCachedUserInfo(profile);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      try {
        if (session?.user) {
          await fetchCurrentProfile();
        } else {
          setCachedUserInfo(null);
        }
      } catch (error) {
        console.error(
          "[UserInfoContext] Failed to update user profile:",
          error,
        );
        if (isMounted) setCachedUserInfo(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchCurrentProfile]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);

    try {
      await fetchCurrentProfile();
    } catch (error) {
      console.error("[UserInfoContext] Failed to refresh user: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentProfile]);

  const contextValue = useMemo(
    () => ({
      userInfo: cachedUserInfo,
      isLoading,
      refreshUser,
    }),
    [cachedUserInfo, isLoading, refreshUser],
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
