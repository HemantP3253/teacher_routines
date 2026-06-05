import { UserProfileProps } from "@/interfaces/interfaces";
import { getUserProfileById } from "@/services/authService";
import { getCurrentAdminCollege } from "@/services/collegeService";
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

interface SearchContextType {
  cachedUsers: UserProfileProps[];
  isLoading: boolean;
  refreshUsers: () => Promise<void>;
}

const UserSearchContext = createContext<SearchContextType | undefined>(
  undefined,
);

export const UserSearchProvider = ({ children }: { children: ReactNode }) => {
  const [cachedUsers, setCachedUsers] = useState<UserProfileProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [collegeCode, setCollegeCode] = useState<string>("");

  const getUserProfiles = useCallback(async () => {
    if (cachedUsers.length === 0) setIsLoading(true);

    const collegeInfo = await getCurrentAdminCollege();
    setCollegeCode(collegeInfo[0].college_code);

    if (!collegeCode) return;

    const currentUserId = (await supabase.auth.getUser()).data.user?.id;

    if (!currentUserId) return;

    const currentUser = await getUserProfileById(currentUserId);
    if (!currentUser) return;
    if (!currentUser.is_admin) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_admin", false)
        .contains("colleges", [collegeCode])
        .order("full_name", { ascending: true });

      if (error) throw error;
      setCachedUsers(data || []);
    } catch (error: any) {
      console.error(
        "Error fetching filtered array inside UserSearch Context: ",
        error.message,
      );
    } finally {
      setIsLoading(false);
    }
  }, [collegeCode, cachedUsers.length]);

  useEffect(() => {
    getUserProfiles();

    const channelInstanceId = `admin-queue-${Math.random().toString(36).substring(7)}`;

    const profileSubscription = supabase
      .channel(channelInstanceId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          setCachedUsers((prevUsers) => {
            if (payload.eventType === "DELETE") {
              return prevUsers.filter((user) => user.id !== payload.old.id);
            }

            const record = payload.new as UserProfileProps;
            const collegeArray = record?.colleges as string[] | undefined;
            const includesCollegeCode =
              collegeArray?.includes(collegeCode) && !record.is_admin;

            if (payload.eventType === "INSERT") {
              if (!includesCollegeCode) return prevUsers;

              return [...prevUsers, record].sort((a, b) =>
                (a.full_name || "").localeCompare(b.full_name || ""),
              );
            }

            if (payload.eventType === "UPDATE") {
              const existsInCache = prevUsers.some(
                (user) => user.id === record.id,
              );

              if (includesCollegeCode) {
                if (existsInCache)
                  return prevUsers.map((user) =>
                    user.id === record.id ? record : user,
                  );
                else
                  return [...prevUsers, record].sort((a, b) =>
                    (a.full_name || "").localeCompare(b.full_name || ""),
                  );
              } else {
                if (existsInCache) {
                  return prevUsers.filter((user) => user.id !== record.id);
                }
              }
            }

            return prevUsers;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [getUserProfiles]);

  const contextValue = useMemo(
    () => ({
      cachedUsers,
      isLoading,
      refreshUsers: getUserProfiles,
    }),
    [cachedUsers, isLoading, getUserProfiles],
  );

  return (
    <UserSearchContext.Provider value={contextValue}>
      {children}
    </UserSearchContext.Provider>
  );
};

export const useUserSearch = () => {
  const context = useContext(UserSearchContext);
  if (!context)
    throw new Error("useUserSearch must be used within a UserSearchProvider");

  return context;
};
