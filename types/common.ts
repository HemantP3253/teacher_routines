import { FC } from "react";
import { ColorValue } from "react-native";
import { SvgProps } from "react-native-svg";
import { UnistylesThemes } from "react-native-unistyles";
import { AcademicLevel, UniversityBranch, UniversityProgram } from "./academic";
import { Tables } from "./database";

export type ActiveSubjectInfo = {
  index: number;
  subjectId: string;
  teacherId: string;
};

export type Days =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type GenderType = "Male" | "Female" | "Others";

export type LogInErrorProps = Partial<Record<keyof LogInProps, string>>;

export type ProfileStatus = "approved" | "pending" | "rejected";

export type SignUpErrorProps = Partial<Record<keyof SignUpProps, string>>;

export type SortType = "ascending" | "descending";

export type ThemeColors = UnistylesThemes[keyof UnistylesThemes]["colors"];

export type ThemePreference = "Use System Theme" | "Light Mode" | "Dark Mode";

export type RoutinesData = Tables<"routines">;

export type UserType =
  | "student"
  | "teacher"
  | "department_admin"
  | "institute_admin";

// TODO: Check if this type is used anywhere except ThemedModalMenu, if not move this type to ThemedModalMenu.tsx
export interface AlertCondition {
  visible: boolean;
  title: string;
  description?: string;
}

export interface CustomSvgProps extends SvgProps {
  fillItem?: boolean;
  size?: number;
}

type IconDimensions =
  | {
      height?: number;
      width?: number;
      size?: never;
    }
  | {
      height?: never;
      width?: never;
      size: number;
    };

export type IconProperties = IconDimensions &
  CustomSvgProps & {
    Icon?: FC<CustomSvgProps>;
    iconFill?: boolean;
    //TODO: Check if showIconOnly property is used anywhere, if not remove it
    showIconOnly?: boolean;
    iconFillColor?: ColorValue;
    onPress?: () => void;
  };

export interface LogInProps {
  usernameOrEmail: string;
  password: string;
}

export interface MenuProps<T> {
  title: string;
  data: readonly T[];

  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSublabel?: (item: T) => string | undefined;

  sortType?: SortType;
}

export interface RoutineFilterData {
  program: UniversityProgram | undefined;
  branch: UniversityBranch | undefined;
  academicLevel: AcademicLevel | undefined;
  batchAndSection: string | undefined;
}

export interface SignUpProps {
  name: string;
  dateOfBirth: string;
  gender: GenderType | "";
  username: string;
  email: string;
  address?: string | null;
  password: string;
  confirmPassword: string;
  phone: string;
}
