import { LightTheme } from "@/assets/theme/Themes";
import { AcademicLevel, CurriculumSubject, UniversityBranch, UniversityProgram } from "@/types/academic";
import { Tables } from "@/types/database";
import { LinearGradientProps } from "expo-linear-gradient";
import React, { FC, ReactNode, RefObject, SetStateAction, SVGProps } from "react";
import {
  GestureResponderEvent,
  ModalProps,
  PressableProps,
  StatusBarProps,
  StyleProp,
  TextInput,
  TextInputProps,
  TextProps,
  View,
  ViewProps,
  ViewStyle
} from "react-native";
import { SvgProps } from "react-native-svg";
import { UnistylesThemes } from "react-native-unistyles";

type sortType = "ascending" | "descending"

type ThemeColors = UnistylesThemes[keyof UnistylesThemes]['colors'];

type textType = "text" | "textSecondary" | "textDisabled" | "primaryContent" | "secondaryContent" | "accentContent" | "disabledContent" | "warningContent" | "successContent" | "errorContent" | "infoContent";

type formatType = "whole-number" | "name" | "phone" | "decimal-number" | "date" | "time" | "email" | "username"

type genderType = "Male" | "Female" | "Others" | ""

type userType = "student" | "teacher" | "department_admin" | "institute_admin" | "super_admin"

type level = "faculty" | "degreeType" | "degreeName" | "hasBranches" | "branch" | "term" | "subjects"

type days = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"

type SearchUser = Tables<"profile_institutes"> & {
  profile: Tables<"profiles">;
};

type MembershipStatus = "approved" | "rejected" | "pending"

interface ThemedViewProps extends ViewProps {}

interface ThemedLinearGradientProps extends Omit< LinearGradientProps, "colors"> {
  overrideColors?: [ColorValue, ColorValue, ...ColorValue[]];
type?: "background" | "surface" | "surfaceElevated" | "primary" | "secondary" | "accent"
}

interface ThemedPressableProps extends PressableProps extends ViewProps {
  noFill?: boolean;
  inline?: boolean;
}

interface ThemedStatusBarProps extends StatusBarProps {}

interface ThemedTextProps extends TextProps {
  type?: textType
}

interface ThemedTextInputProps extends TextInputProps {
  ref?: React.Ref<TextInput> | undefined;
  secureTextEntry?: boolean;
  error?: boolean;
  title: string;
  customComponent?: React.ReactNode;
  Icon?: FC<SvgProps>;
  errorText?: string;
  dateEntry?;
  dateValue?: Date;
  setDateValue?: any;
  infoText?: string;
  hideErrorText?;
  blendColor?: string;
  timeValues?: {
    time?: Date;
    setTime?: any;
    use24Hours?: boolean;
  }
}

interface SpacerProps extends ViewProps {
  horizontal?: boolean;
  size?: number;
  lineVisible?: boolean;
  lineSize?: number;
  lineColor?: color;
  useFullWidth?: boolean;
  style?: ViewProps<ViewStyle>;
  lineType?: keyof ThemeColors
}

interface TabIconProps {
  focused: boolean;
  Icon: FC<CustomSvgProps>;
  title: string;
  onPress: ((event: GestureResponderEvent) => void);
}

interface IconSet {
  classFill: FC<SvgProps>;
  classNoFill: FC<SvgProps>;
  homeFill: FC<SvgProps>;
  homeNoFill: FC<SvgProps>;
  optionsFill: FC<SvgProps>;
  optionsNoFill: FC<SvgProps>;
}

interface ThemeContextType {
  theme: typeof LightTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

interface ThemedOptionsCardProps {
  Icon?: FC<SvgProps>;
  label: string;
  description?: string;
  switchValue?: boolean;
  switchOnValueChange?: () => void;
  onPress?: ((GestureResponderEvent) => void);
}

interface ThemedClassCardProps {
  class: {
    degreeName: string;
    semester?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    section?: string;
    year?: 1 | 2 | 3 | 4;
    totalYears: 1 | 2 | 3 | 4 | 5;
  }
  durationInMinutes?: number;
  startTime: string;
  subject: string;
}


interface SignUpProps {
  name: string;
  dateOfBirth: string;
  gender: genderType;
  username: string;
  email: string;
  address: string | null;
  password: string;
  confirmPassword: string;
  phone: string;
  hasError: boolean;
}

interface SignUpErrorProps {
  name: string,
  dateOfBirth: string,
  gender: string,
  username: string,
  email: string,
  address: string,
  password: string,
  confirmPassword: string,
  phone: string,
}

interface LogInProps {
  usernameOrEmail: string;
  password: string;
  is_admin: boolean;
  error?: boolean;
}

interface LogInErrorProps {
  usernameOrEmail: string;
  password: string;
}

interface ThemedModalMenuProps<T> extends PressableProps extends ViewProps {
  data: readonly T[];
  sortType?: sortType;
  selectedItem: T | null;
  onItemSelect?: (selectedId: any) => void;

  title: string;
  type?: string;

  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSublabel?: (item: T) => string;
  noFill?: boolean;
  addSearchBar?: boolean;
  errorText?: string;

  alertCondition?: {
    visible: boolean;
    alertTitle: string;
    alertDescription?: string;
  };

  cancelable?: boolean;
  addSearchBar?: boolean;
  pressableStyle?: StyleProp<ViewStyle>;

  iconProperties?: {
    Icon?: FC<CustomSvgProps>;
    iconFill?;
    showIconOnly?;
    iconFillColor?: color;
    height?: number;
    width?: number;
    size?: number;
  }
}

interface ThemedModalInputProps extends PressableProps extends ViewProps {
  data: string[];
  title: string;
  error?: boolean;
  setItem: React.Dispatch<React.SetStateAction<any>>;
  type?: string;
  setModalVisibility?: React.Dispatch<React.SetStateAction<boolean>>;
  item?: string;
  cancelable?;
  noFill?;
  Icon?: FC<CustomSvgProps>;
  errorText?: string;
  alertCondition?: {
    visible: boolean;
    alertTitle: string;
    alertDescription?: string;
  };
  iconProperties?: {
    iconFill?;
    showIconOnly?;
    iconFillColor?: color;
    height?: number;
    width?: number;
    size?: number;
  }
  hideItemType?;
  pressableStyle?: StyleProp<ViewStyle>
}

interface CustomSvgProps extends SvgProps {
  fillItem?: boolean;
}

interface degreeQuery {
  level: level;
  faculty?: string;
  degreeType?: string;
  degreeName?: string;
  branch?: string;
  term?: string;
  subjects?: string;
}

interface SubjectMap {
  [subjectCode: string]: string;
}

interface TermData {
  [termNumber: number]: SubjectMap;
}

interface DegreeDetails {
  hasBranches: boolean;
  type: "Semester" | "Year";
  data?: TermData;
  branches?: {
    [branchName: string]: TermData;
  }
  common?: TermData;
}

interface DegreeTypeGroup {
  [degreeName: string]: DegreeDetails;
  shortCode?: string;
}

interface FacultyGroup {
  [degreeType: string]: DegreeTypeGroup;
}

interface Curriculum {
  [facultyName: string]: FacultyGroup;
}

interface CustomModalProps extends ModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children?: ReactNode;
  blurBackground?: boolean;
  blurTarget?: RefObject<View | null>
}

interface ThemedAlertWindowProps {
  title: string;
  description?: string;
  okButton?: boolean;
  cancelButton?: boolean;
  visible: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onConfirm?: () => void;
}

interface SubjectData {
  subjectCode: string;
  teacherId: string;
  teacherName: string;
  startTime: string;
  duration: string;
}

interface AssignTimeModalProps {
  visible: boolean;
  title: string;
  onClose?: () => void;
  onSubmit?: (time: string, duration: string) => void
}

interface UserProfileProps {
  id: string;
  username: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null,
}

interface ChooseTimeComponentProps {
  timeValues: {
    startTime: string;
    endTime: string;
    maxDuration: string;
  }
  setTimeValues: React.Dispatch<SetStateAction<{startTime: string, endTime: string, maxDuration: string}>>
  date: Date;
  setDate: React.Dispatch<SetStateAction<Date>>;
  onClose?: () => void;
  onSubmit?: (startTime: string, endTime: string, maxDuration: string) => void;
  backgroundColor?: string;
}

interface ActionableHeaderCardProps {
  title: string;
  IconBeforeText?: FC<SvgProps>;
  iconProperties: {
    Icon: FC<SvgProps>;
    onPress: () => void;
    height?: number;
    width?: number;
  }
  searchButtonProperties?: {
    onPress: () => void;
  }
  showBottomBorder?: boolean;
  isDataLoading?: boolean;
  children?: ReactNode;
  summaryText?: string;
}

interface UserActionCardProps {
  user: SearchUser;
  showStatus?: boolean;
  hideIcons?: boolean;
  keepExpanded?: boolean;
  onPress?: () => void;
  onStatusChange?: (
    status: "approved" | "rejected" | "pending",
  ) => void;
}

interface InstituteData {
  id: string;
  name: string;
  type: string;
  code: string;
  address: string | null;
  affiliated_university: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ThemedRadioButtonMenuProps<T> {
  title?: string;
  data: T[];
  selectedItem?: T;
  onItemSelect?: (selectedId: any) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string | undefined;
  sortType?: sortType;
  alwaysShowSubLabel?: boolean;
}

interface ThemedCheckboxProps {
  label: string,
  alwaysShowSubLabel?: boolean,
  subLabel?: string,
  style?: StyleProp<ViewStyle>,
  onPress?: () => void,
  isChecked?: boolean,
}

interface ThemedCheckboxMenuProps<T> {
  title?: string;
  data: T[];
  initialSelection?: T[];
  minSelection?: number;
  onSubmit?: (selected: T[]) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string | undefined;
  addSearchBar?: boolean;
  sortType?: sortType;
}

interface AssignTeacherModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTeacher: (teacherId: string, teacherName: string) => void;
}

interface RoutineDataStructure {
  id: string;
  institute_id: string;
  unit_id: string;
  teacher_id: string;
  stream_id?: string;
  program_id?: string;
  grade_id?: string;
  term_id?: string;
  batch?: string;
  section?: string;
  subject_id: string;
  start_time: string;
  end_time: string;
  days: days[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface ProfileInstitutesStructure {
  profile_id: string;
  institute_id: string;
  role: string;
  status: string;
  allowed_units: string[];
  reviewed_by: string;
  reviewed_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface QueryContext {
  faculty: string;
  degreeType: string;
  degreeName: string;
  branch: string | undefined;
  term: string;
  level: level;
}

interface RoutineData {
  program: UniversityProgram | undefined;
  branch?: UniversityBranch | undefined;
  academicLevel: AcademicLevel | undefined;
  batchAndSectionId?: string | undefined;
}

interface RoutinesHeaderProps {
  selectedProgram: UniversityProgram | undefined;
  selectedBranch: UniversityBranch | undefined;
  selectedAcademicLevel: AcademicLevel| undefined;
  selectedBatchAndSectionId: string | undefined;

  onProgramChange: (program: UniversityProgram) => void;
  onBranchChange: (branch: UniversityBranch) => void;
  onAcademicLevelChange: (academicLevel: AcademicLevel) => void;
  onBatchAndSectionChange: (batchAndSectionId: string) => void;
  onDynamicRoutineSelect: (index: number) => void;
}

interface TagChipProps {
  label: string;
  selected?: boolean;
  Icon?: FC<SVGProps>;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  fill?: boolean;
  dottedBorder?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

interface DynamicTagSelectProps<T> {
  data: T[];
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string | undefined;
  showAddButton?: boolean;
  showDropDown?: boolean;
  title: string;
  Icon?: FC<SvgProps>;
  onSelect?: Function;
  addButtonProperties?: {
    onPress: () => void;
  }
}

interface DynamicRoutineDetails {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  duration: string;
  activeDays: string;
}

interface SubjectCardProps {
  subject: CurriculumSubject;
  durationInfo?: {
    startTime: string;
    duration: string;
  }
  teacherInfo?: {
    teacherId: string;
    teacherName: string;
  }
  onTeacherChange: (teacherId: string, teacherName: string) => void;
  errorInfo?: {
    title: string;
    description: string;
    showError?: boolean;
  }
}

type DynamicInputType = {
  title: string;
  blendColor: string;
  inputFormatType?: formatType;
  precision?: number;
  isSensitiveText?: boolean;
  showPicker?: "date" | "time" | "dateAndTime";
  isNullable?: boolean;
}

interface DynamicTextInputProps {
  inputFields: DynamicInputType[];
  extraInputs?: {
    inputFields: DynamicInputType[],
    captionText: string;
  };
  optionalInputFields?: DynamicInputType[];
  onSubmit?: (inputs: string[]) => void;
  defaultValues?: string[];
}