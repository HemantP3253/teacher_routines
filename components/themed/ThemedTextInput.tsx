import {
  CalendarButtonIcon,
  ErrorIcon,
  ScheduleIcon,
  SuccessIcon,
} from "@/assets/icons";
import { ThemedTextInputProps } from "@/interfaces/interfaces";
import { dateTimePicker } from "@/utils/pickerUtils";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import ErrorCard from "../common/ErrorCard";
import InfoCard from "../common/InfoCard";
import ThemedView from "./ThemedView";

const ThemedTextInput = ({
  style,
  ref,
  title,
  errorText,
  secureTextEntry,
  dateValue,
  Icon,
  customComponent,
  setDateValue,
  infoText,
  hideErrorText,
  blendColor,
  timeValues,
  ...otherProps
}: ThemedTextInputProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const styles = createStyles(colors);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const error: boolean = errorText
    ? errorText !== "" && errorText !== "Success!"
    : false;
  const success: boolean = errorText ? errorText === "Success!" : false;

  const dynamicColorText = error
    ? colors.error
    : isFocused
      ? colors.primary
      : success
        ? colors.success
        : colors.baseContent;
  const animatedValue = useRef(
    new Animated.Value(otherProps.value ? 1 : 0),
  ).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || otherProps.value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, otherProps.value]);

  const labelContainerStyle = {
    position: "absolute" as const,
    left: Icon ? 35 : 10,
    zIndex: 1,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
  };

  const statusIconStyle = { alignSelf: "center" as const, marginHorizontal: 4 };

  return (
    <View>
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          borderWidth: 1,
          borderColor: error
            ? colors.error
            : isFocused
              ? colors.primary
              : success
                ? colors.success
                : colors.base300,
          backgroundColor: colors.base200,
          borderRadius: 8,
          marginHorizontal: 8,
          marginVertical: 12,
        }}
      >
        <Animated.View style={labelContainerStyle} pointerEvents="none">
          <View style={StyleSheet.absoluteFill}>
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.base200, blendColor ?? colors.base100],
                }),
              }}
            />
            <View style={{ flex: 1, backgroundColor: colors.base200 }} />
          </View>

          <Animated.Text
            style={{
              paddingHorizontal: 4,
              fontSize: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
              }),
              color: dynamicColorText,
            }}
          >
            {title}
          </Animated.Text>
        </Animated.View>

        {Icon && (
          <Icon
            fill={dynamicColorText}
            style={{ alignSelf: "center", marginLeft: 8 }}
          />
        )}

        <TextInput
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          submitBehavior={ref ? "submit" : "blurAndSubmit"}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor={colors.baseContent}
          autoCapitalize={otherProps.autoCapitalize ?? "none"}
          style={[styles.textInput, style]}
          returnKeyType={otherProps.returnKeyType ?? "next"}
          {...otherProps}
        />

        {error && (
          <ErrorIcon
            fill={colors.error}
            height={28}
            width={28}
            style={statusIconStyle}
          />
        )}

        {success && (
          <SuccessIcon
            fill={colors.success}
            height={28}
            width={28}
            style={statusIconStyle}
          />
        )}

        {secureTextEntry && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.selectorIcon}
          >
            <Text
              style={{
                color: dynamicColorText,
              }}
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
          </Pressable>
        )}

        {dateValue && (
          <Pressable
            style={styles.selectorIcon}
            onFocus={() => {}}
            onPress={() => {
              if (dateValue) dateTimePicker("date", dateValue, setDateValue);
            }}
          >
            <CalendarButtonIcon
              height={24}
              width={24}
              fill={dynamicColorText}
            />
          </Pressable>
        )}

        {timeValues?.time && (
          <Pressable
            style={styles.selectorIcon}
            onFocus={() => {}}
            onPress={() => {
              if (timeValues.time)
                dateTimePicker(
                  "time",
                  timeValues?.time,
                  timeValues?.setTime,
                  timeValues?.use24Hours,
                );
            }}
          >
            <ScheduleIcon height={24} width={24} fill={dynamicColorText} />
          </Pressable>
        )}

        {customComponent}
      </ThemedView>
      {!error && infoText && <InfoCard infoText={infoText} />}
      {error && !hideErrorText && errorText && (
        <ErrorCard errorText={errorText} />
      )}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    selectorIcon: {
      justifyContent: "center",
      padding: 12,
      borderColor: colors.base300,
      borderWidth: 1,
      borderRadius: 8,
    },
    textInput: {
      color: colors.baseContent,
      flex: 1,
      padding: 16,
    },
  });

export default ThemedTextInput;
