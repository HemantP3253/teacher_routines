import { ErrorIcon, SuccessIcon } from "@/assets/icons";
import { IconProperties } from "@/types/common";
import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ErrorCard from "../common/ErrorCard";
import InfoCard from "../common/InfoCard";
import ThemedView from "./ThemedView";

interface ThemedTextInputProps extends TextInputProps {
  title: string;
  dateEntry?: boolean;
  dateValue?: Date;
  setDateValue?: any;
  ref?: React.Ref<TextInput> | undefined;
  secureTextEntry?: boolean;
  error?: boolean;
  customComponent?: React.ReactNode;
  Icon?: IconProperties["Icon"];
  errorText?: string;
  infoText?: string;
  hideErrorText?: boolean;
  blendColor?: string;
  timeValues?: {
    time?: Date;
    setTime?: any;
    use24Hours?: boolean;
  };
}

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

  const isFloating = focused || !!otherProps.value;
  const progress = useDerivedValue(() =>
    withTiming(isFloating ? 1 : 0, { duration: 200 }),
  );

  const animatedLabelContainerStyle = useAnimatedStyle(() => {
    return {
      top: interpolate(progress.value, [0, 1], [14, -10]),
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const startColor = colors.surface;
    const endColor = blendColor ?? colors.background;

    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [startColor, endColor],
      ),
      transform: [
        {
          scaleY: interpolate(progress.value, [0, 1], [1, 1.3]),
        },
        { translateY: interpolate(progress.value, [0, 1], [0, -1.5]) },
      ],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(progress.value, [0, 1], [16, 14]),
    };
  });

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
          style={[
            {
              position: "absolute",
              left: Icon ? 35 : 10,
              zIndex: 2,
            },
            animatedLabelContainerStyle,
          ]}
        >
          <Animated.View
            style={[StyleSheet.absoluteFillObject, animatedBackgroundStyle]}
          />

          <Animated.Text
            style={[
              {
                paddingHorizontal: 4,
                color: textColor,
              },
              animatedLabelStyle,
            ]}
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
