import { useInstituteInfo } from "@/contexts/InstituteInfoContext";
import { UserType } from "@/types/common";
import { ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: UserType[];
  children: ReactNode;
}

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { currentMembership } = useInstituteInfo();
  const role = currentMembership?.role as UserType | undefined;

  if (!role || !allowedRoles.includes(role)) return null;

  return children;
};
