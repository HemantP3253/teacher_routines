import { FC } from "react";
import { ColorValue } from "react-native";
import { SvgProps } from "react-native-svg";
import { UnistylesThemes } from "react-native-unistyles";
import { Tables } from "./database";

export type Days =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type FormatType =
  | "whole-number"
  | "name"
  | "phone"
  | "decimal-number"
  | "date"
  | "time"
  | "email"
  | "username";

export type GenderType = "Male" | "Female" | "Others" | "";

export type MembershipStatus = "approved" | "rejected" | "pending";

export type InstituteData = Tables<"institutes">;

export type InstituteMember = Tables<"profile_institutes"> & {
  profile: Tables<"profiles">;
};

export type ProfileInstitutesData = Tables<"profile_institutes">;

export type SortType = "ascending" | "descending";

export type ThemeColors = UnistylesThemes[keyof UnistylesThemes]["colors"];

export type UserType =
  | "student"
  | "teacher"
  | "department_admin"
  | "institute_admin";

export interface AlertCondition {
  visible: boolean;
  title: string;
  description?: string;
}

export interface CustomSvgProps extends SvgProps {
  fillItem?: boolean;
  size?: number;
}

export interface IconProperties {
  Icon?: FC<CustomSvgProps>;
  iconFill?: boolean;
  showIconOnly?: boolean;
  iconFillColor?: ColorValue;
  height?: number;
  width?: number;
  size?: number;
  onPress?: () => void;
}

export interface MenuProps<T> {
  title: string;
  data: readonly T[];

  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSublabel?: (item: T) => string | undefined;

  sortType?: SortType;
}

export interface InputField {
  title: string;
  blendColor: string;
  inputFormatType?: FormatType;
  precision?: number;
  isSensitiveText?: boolean;
  showPicker?: "date" | "time" | "dateAndTime";
  isNullable?: boolean;
}
