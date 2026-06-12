import { LightTheme } from "@/assets/theme/Themes";
import { LinearGradientProps } from "expo-linear-gradient";
import React, { FC, ReactNode, SetStateAction, SVGProps } from "react";
import {
  GestureResponderEvent,
  ModalProps,
  PressableProps,
  StatusBarProps,
  StyleProp,
  TextInput,
  TextInputProps,
  TextProps,
  ViewProps,
  ViewStyle
} from "react-native";
import { SvgProps } from "react-native-svg";

type textType = "text" | "textSecondary" | "textDisabled" | "primaryContent" | "secondaryContent" | "accentContent" | "disabledContent" | "warningContent" | "successContent" | "errorContent" | "infoContent";

type genderType = "Male" | "Female" | "Others" | ""

type userType = "User" | "Admin"

type level = "faculty" | "degreeType" | "degreeName" | "hasBranches" | "branch" | "term" | "subjects"

interface ThemedViewProps extends ViewProps {}

interface ThemedLinearGradientProps extends Omit< LinearGradientProps, "colors"> {
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
  horizontal?;
  size?: number;
  lineVisible?;
  lineSize?: number;
  lineColor?: color;
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
  password: string;
  confirmPassword: string;
  phone: string;
  userType?: userType;
  colleges?: string[],
  error: boolean;
}

interface SignUpErrorProps {
  name: string,
  dateOfBirth: string,
  gender: string,
  username: string,
  email: string,
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

interface ThemedModalMenuProps extends PressableProps extends ViewProps {
  data: string[];
  title: string;
  addSearchBar?: boolean;
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
  colleges: string[] | null;
  gender: string;
  phone: string;
  address: string | null;
  avatar_url: string;
  is_admin: boolean;
  approved_by: string[] | null;
  rejected_by: string[] | null;
  created_at?: string;
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
  userData: UserProfileProps;
  showStatus?: boolean;
  hideIcons?: boolean;
  keepExpanded?: boolean;
}

interface CollegeData {
  id: string;
  university: string;
  college_code: string;
  college_name: string;
  address: string;
  authorized_users?: string;
  available_faculties?: string[];
}

interface ThemedRadioButtonMenuProps<T> {
  title?: string;
  data: T[];
  initialSelection?: string;
  onSelect?: (selectedId: any) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string | undefined;
  sortList?: boolean;
}

interface ThemedCheckboxProps<T> {
  title?: string;
  data: T[];
  initialSelection?: string[];
  minSelection?: number;
  onSubmit?: (selected: string[]) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string | undefined;
  addSearchBar?: boolean;
}

interface AssignTeacherModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTeacher: (teacherId: string, teacherName: string) => void;
}

interface RoutineData {
  degreeName: string;
  branch?: string;
  term: string;
  batchAndSection: string;
  dayOfWeek: string;
}

interface QueryContext {
  faculty: string;
  degreeType: string;
  degreeName: string;
  branch: string | undefined;
  term: string;
  level: level;
}

interface RoutinesHeaderProps {
  data: RoutineData;
  setData: React.Dispatch<React.SetStateAction<RoutineData>>;
  currentQueryContext: QueryContext;
  onDynamicRoutineSelect: (id: number) => void;
}

interface TagChipProps {
  label: string;
  selected?: boolean;
  Icon?: FC<SVGProps>;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  fill?: boolean;
  dottedBorder?: boolean;
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
  subjectName: string;
  startTime: string;
  duration: string;
  teacherId: string;
  teacherName: string;
  onTimeChange: (startTime: string, duration: string) => void;
  onTeacherChange: (teacherId: string, teacherName: string) => void;
}