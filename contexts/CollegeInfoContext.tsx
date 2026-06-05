import { CollegeData } from "@/interfaces/interfaces";
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
import { useUserInfo } from "./UserInfoContext";

interface CollegeContextType {
  cachedInfo: CollegeData[];
  currentCollege: CollegeData | null;
  isLoading: boolean;
  refreshCollegeData: () => Promise<void>;
}

const CollegeInfoContext = createContext<CollegeContextType | undefined>(
  undefined,
);

export const CollegeInfoProvider = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useUserInfo() || { userInfo: null };
  const [cachedInfo, setCachedInfo] = useState<CollegeData[]>([]);
  const [currentCollege, setCurrentCollege] = useState<CollegeData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCurrentAdminCollege = useCallback(async () => {
    if (!userInfo?.id || !userInfo?.is_admin) return;

    try {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .eq("authorized_users", userInfo.id)
        .single();

      if (error) throw error;

      setCurrentCollege(data);
    } catch (error: any) {
      console.error(
        "Error while fetching current admin college: ",
        error.message,
      );
    }
  }, [userInfo?.id, userInfo?.is_admin]);

  const getAllColleges = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("colleges")
        .select("id, university, college_code, college_name, address");

      if (error) throw error;

      setCachedInfo(data || []);
    } catch (error: any) {
      console.error(
        "Error fetching filtered array inside UserSearch Context: ",
        error.message,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllColleges();

    if (userInfo?.is_admin) {
      getCurrentAdminCollege();
    } else {
      setCurrentCollege(null);
    }
  }, [
    userInfo?.id,
    userInfo?.is_admin,
    getAllColleges,
    getCurrentAdminCollege,
  ]);

  const contextValue = useMemo(
    () => ({
      cachedInfo,
      currentCollege,
      isLoading,
      refreshCollegeData: getAllColleges,
    }),
    [cachedInfo, currentCollege, isLoading, getAllColleges],
  );

  return (
    <CollegeInfoContext.Provider value={contextValue}>
      {children}
    </CollegeInfoContext.Provider>
  );
};

export const useCollegeInfo = () => {
  const context = useContext(CollegeInfoContext);
  if (!context)
    throw new Error("useUserSearch must be used within a UserSearchProvider");

  return context;
};
