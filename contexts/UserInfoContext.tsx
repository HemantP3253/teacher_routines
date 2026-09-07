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

  const fetchProfile = useCallback(async (userId: string) => {
    console.log("🔍 [UserInfoContext] Fetching DB profile for user:", userId);

    // Timeout safety net: force DB query to fail after 3s if Supabase hangs
    const dbPromise = supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    const timeoutPromise = new Promise<{
      data: null;
      error: Error;
      status: number;
    }>((_, reject) =>
      setTimeout(() => reject(new Error("DB Profile Fetch Timed Out")), 3000),
    );

    try {
      const response = await Promise.race([dbPromise, timeoutPromise]);

      console.log(
        "📊 [UserInfoContext] DB Response Status:",
        response.status,
        "Data:",
        response.data,
        "Error:",
        response.error,
      );

      if (response.error) throw response.error;
      setCachedUserInfo(response.data);
    } catch (err) {
      console.error("❌ [UserInfoContext] Profile fetch error:", err);
      setCachedUserInfo(null);
    } finally {
      console.log("✅ [UserInfoContext] Profile fetch finished");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    console.log("🔍 [UserInfoContext] Subscribing to auth state change...");

    // Unified listener handling both initial session & subsequent auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "⚡ [UserInfoContext] Auth Event Fired:",
        event,
        "Session exists:",
        !!session,
      );

      try {
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setCachedUserInfo(null);
        }
      } catch (err) {
        console.error("❌ [UserInfoContext] Auth listener error:", err);
        if (isMounted) setCachedUserInfo(null);
      } finally {
        if (isMounted) {
          console.log("✅ [UserInfoContext] Setting isLoading = false");
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await fetchProfile(user.id);
      } else {
        setCachedUserInfo(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

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
