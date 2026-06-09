import { ErrorIcon, SuccessIcon } from "@/assets/icons";
import { ThemedTextInputProps } from "@/interfaces/interfaces";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Icon,
  customComponent,
  infoText,
  hideErrorText,
  blendColor,
  ...otherProps
}: ThemedTextInputProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const styles = useMemo(() => createStyles(colors), [colors]);

  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const hasError = !!errorText && errorText !== "" && errorText !== "Success!";

  const hasSuccess = errorText === "Success!";

  const borderColor = hasError
    ? colors.error
    : focused
      ? colors.primary
      : hasSuccess
        ? colors.success
        : colors.surfaceElevated;

  const textColor = hasError
    ? colors.error
    : focused
      ? colors.primary
      : hasSuccess
        ? colors.success
        : colors.text;

  const animatedValue = useRef(
    new Animated.Value(otherProps.value ? 1 : 0),
  ).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: focused || !!otherProps.value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused, otherProps.value]);

  return (
    <View>
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor,
          backgroundColor: colors.surface,
          borderRadius: 8,
          marginHorizontal: 8,
          marginVertical: 12,
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: Icon ? 35 : 10,
            zIndex: 2,
            top: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [14, -10],
            }),
          }}
        >
          <View style={StyleSheet.absoluteFill}>
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    colors.surface,
                    blendColor ?? colors.background,
                  ],
                }),
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
              }}
            />
          </View>

          <Animated.Text
            style={{
              paddingHorizontal: 4,
              fontSize: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
              }),
              color: textColor,
            }}
          >
            {title}
          </Animated.Text>
        </Animated.View>

        {Icon && (
          <Icon
            fill={textColor}
            style={{
              alignSelf: "center",
              marginLeft: 8,
            }}
          />
        )}

        <TextInput
          {...otherProps}
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.text}
          autoCapitalize={otherProps.autoCapitalize ?? "none"}
          secureTextEntry={secureTextEntry && !passwordVisible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {hasError && (
          <ErrorIcon
            width={28}
            height={28}
            fill={colors.error}
            style={styles.statusIcon}
          />
        )}

        {hasSuccess && (
          <SuccessIcon
            width={28}
            height={28}
            fill={colors.success}
            style={styles.statusIcon}
          />
        )}

        {secureTextEntry && (
          <Pressable
            style={styles.trailing}
            onPress={() => setPasswordVisible((v) => !v)}
          >
            <Text style={{ color: textColor }}>
              {passwordVisible ? "Hide" : "Show"}
            </Text>
          </Pressable>
        )}

        {customComponent}
      </ThemedView>

      {!hasError && infoText && <InfoCard infoText={infoText} />}

      {hasError && !hideErrorText && <ErrorCard errorText={errorText!} />}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    input: {
      flex: 1,
      padding: 16,
      color: colors.text,
    },
    trailing: {
      justifyContent: "center",
      padding: 12,
    },
    statusIcon: {
      alignSelf: "center",
      marginHorizontal: 4,
    },
  });

export default ThemedTextInput;
