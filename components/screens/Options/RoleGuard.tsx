import { useAuthStore } from "@/store/useAuthStore";
import { UserType } from "@/types/common";
import { ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: UserType[];
  children: ReactNode;
}

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const role = useAuthStore((state) => state.userRole);

  if (!role || !allowedRoles.includes(role)) return null;

  return children;
};
