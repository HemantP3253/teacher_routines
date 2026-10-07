import { MembershipStatus, SearchUser } from "@/interfaces/interfaces";
import { supabase } from "@/services/supabase";
import { updateUserStatus } from "@/services/userActionService";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useInstituteInfo } from "./InstituteInfoContext";
import { useUserInfo } from "./UserInfoContext";

type AllUserData = {
  all: SearchUser[];
  pending: SearchUser[];
  approved: SearchUser[];
  rejected: SearchUser[];
};

interface SearchContextType {
  users: AllUserData;
  isLoading: boolean;
  updateMembershipStatus: (
    userId: string,
    status: MembershipStatus,
  ) => Promise<void>;
  refreshSearchData: () => Promise<void>;
}

const UserSearchContext = createContext<SearchContextType | undefined>(
  undefined,
);

export const UserSearchProvider = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useUserInfo();
  const { currentInstitute, currentMembership } = useInstituteInfo();
  const [allUsers, setAllUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const users = useMemo<AllUserData>(
    () => ({
      all: allUsers,
      pending: allUsers.filter((user) => user.status === "pending"),
      approved: allUsers.filter((user) => user.status === "approved"),
      rejected: allUsers.filter((user) => user.status === "rejected"),
    }),
    [allUsers],
  );

  const getUserProfiles = useCallback(async () => {
    if (!currentInstitute || !userInfo) return;
    if (
      currentMembership?.role === "teacher" ||
      currentMembership?.role === "student" ||
      !currentMembership?.role
    )
      return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("profile_institutes")
        .select(`*, profile:profiles!profile_institutes_profile_id_fkey(*)`)
        .eq("institute_id", currentInstitute?.id);

      if (error) throw error;
      setAllUsers(data);
    } catch (error: any) {
      console.error(
        "Error fetching filtered array inside UserSearch Context: ",
        error.message,
      );
      setAllUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentInstitute, currentMembership, userInfo]);

  const updateMembershipStatus = useCallback(
    async (userId: string, status: MembershipStatus) => {
      if (!currentInstitute) return;
      await updateUserStatus(userId, currentInstitute.id, status);

      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.profile_id === userId ? { ...user, status } : user,
        ),
      );
    },
    [currentInstitute],
  );

  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  const contextValue = useMemo(
    () => ({
      users,
      isLoading,
      updateMembershipStatus,
      refreshSearchData: getUserProfiles,
    }),
    [users, isLoading, getUserProfiles, updateMembershipStatus],
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
