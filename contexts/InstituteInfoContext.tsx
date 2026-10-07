import {
  fetchAllInstitutes,
  getCurrentUserInstitutes,
} from "@/services/instituteService";
import { getUserInstituteMembership } from "@/services/profileInstituteService";
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
import { useUserInfo } from "./UserInfoContext";

type InstituteData = Tables<"institutes">;
type ProfileInstitutesData = Tables<"profile_institutes">;

interface InstituteContextType {
  cachedInfo: InstituteData[];
  currentInstitute: InstituteData | null;
  currentMembership: ProfileInstitutesData | null;
  isLoading: boolean;
  refreshInstituteData: () => Promise<void>;
}

const InstituteInfoContext = createContext<InstituteContextType | undefined>(
  undefined,
);

export const InstituteInfoProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { userInfo } = useUserInfo();

  const [cachedInfo, setCachedInfo] = useState<InstituteData[]>([]);
  const [currentInstitute, setCurrentInstitute] =
    useState<InstituteData | null>(null);
  const [currentMembership, setCurrentMembership] =
    useState<ProfileInstitutesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchInstituteData = useCallback(async () => {
    const [allInstitutes, userInstitutes] = await Promise.all([
      fetchAllInstitutes(),
      getCurrentUserInstitutes(),
    ]);

    setCachedInfo(allInstitutes);
    setCurrentInstitute(userInstitutes[0] ?? null);

    return userInstitutes[0] ?? null;
  }, []);

  const fetchCurrentMembership = useCallback(
    async (institute: InstituteData | null) => {
      if (!institute || !userInfo?.id) {
        setCurrentMembership(null);
        return;
      }

      const membership = await getUserInstituteMembership(
        institute.id,
        userInfo.id,
      );

      setCurrentMembership(membership);
    },
    [userInfo?.id],
  );

  const loadInstituteData = useCallback(async () => {
    setIsLoading(true);

    try {
      const institute = await fetchInstituteData();
      await fetchCurrentMembership(institute);
    } catch (error) {
      console.error(
        "[InstituteInfoContext] Failed to load institute data: ",
        error,
      );

      setCurrentMembership(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchInstituteData, fetchCurrentMembership]);

  useEffect(() => {
    if (!userInfo?.id) {
      setCurrentInstitute(null);
      setCurrentMembership(null);
      setIsLoading(false);
      return;
    }

    loadInstituteData();
  }, [userInfo?.id, loadInstituteData]);

  const refreshInstituteData = useCallback(async () => {
    await loadInstituteData();
  }, [loadInstituteData]);

  const contextValue = useMemo(
    () => ({
      cachedInfo,
      currentInstitute,
      currentMembership,
      isLoading,
      refreshInstituteData,
    }),
    [
      cachedInfo,
      currentInstitute,
      currentMembership,
      isLoading,
      refreshInstituteData,
    ],
  );

  return (
    <InstituteInfoContext.Provider value={contextValue}>
      {children}
    </InstituteInfoContext.Provider>
  );
};

export const useInstituteInfo = () => {
  const context = useContext(InstituteInfoContext);
  if (!context)
    throw new Error(
      "useInstituteInfo must be used within an InstituteInfoProvider",
    );

  return context;
};
