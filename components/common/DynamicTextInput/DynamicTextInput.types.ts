import { KeyboardTypeOptions } from "react-native";

export type FormatType =
  | "whole-number"
  | "name"
  | "phone"
  | "decimal-number"
  | "date"
  | "time"
  | "dateAndTime"
  | "email"
  | "username"
  | "lettersAndSpaces"
  | "letters";

type InputType =
  | {
      inputFormatType: "date";
      showPicker: "date";
    }
  | {
      inputFormatType: "time";
      showPicker: "time";
    }
  | {
      inputFormatType: "dateAndTime";
      showPicker: "dateAndTime";
    }
  | {
      inputFormatType?: Exclude<FormatType, "date" | "time" | "dateAndTime">;
      showPicker?: never;
    };

export type InputField = InputType & {
  title: string;
  blendColor?: string;
  keyboardType?: KeyboardTypeOptions;
  precision?: number;
  isSensitiveText?: boolean;
  isNullable?: boolean;
  infoText?: string;
  formatter?: (input: string) => any;
};
