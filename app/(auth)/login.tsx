import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { Spacer } from "@/components/common";
import {
  ThemedPressable,
  ThemedStatusBar,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "@/components/themed";
import { useLogInForm } from "@/hooks/useLogInForm";
import { supabase } from "@/services/supabase";
import { checkLogInFormValidity } from "@/utils/validationUtils";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";

const landing = () => {
  const {
    logInData,
    setLogInData,
    setLogInError,
    logInError,
    handleInputChange,
  } = useLogInForm();
  const { colors } = useUnistyles().theme;
  const passwordRef = useRef<TextInput>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <ThemedView style={styles.rootContainer}>
      <ScrollView style={{ flex: 1 }}>
        <ThemedStatusBar />
        <Spacer size={8} />

        <ThemedText type="text" style={styles.headingText}>
          Login
        </ThemedText>

        <Spacer size={8} />

        <ThemedText type="text" style={styles.labelText}>
          Login Details
        </ThemedText>

        <ThemedTextInput
          value={logInData.usernameOrEmail}
          errorText={logInError.usernameOrEmail}
          hideErrorText
          Icon={EmailIcon}
          title="Username or Email"
          onChangeText={(input) => {
            handleInputChange("usernameOrEmail", input);
          }}
          onSubmitEditing={() => passwordRef.current?.focus()}
          submitBehavior="submit"
        />
        <ThemedTextInput
          ref={passwordRef}
          value={logInData.password}
          errorText={logInError.password}
          Icon={PasswordIcon}
          title="Password"
          onChangeText={(input) => handleInputChange("password", input)}
          returnKeyType="done"
          secureTextEntry={true}
          onSubmitEditing={() => Keyboard.dismiss()}
        />

        <Spacer size={8} />

        <ThemedPressable
          disabled={isSubmitting}
          onPress={async () => {
            if (!checkLogInFormValidity(logInData, setLogInError, setLogInData))
              return;

            setIsSubmitting(true);

            try {
              const { data, error } = await supabase.auth.signInWithPassword({
                email: logInData.usernameOrEmail,
                password: logInData.password,
              });

              if (error) {
                setLogInError({
                  usernameOrEmail: error.message,
                  password: error.message,
                });
                setIsSubmitting(false); // Only reset if there's an error
              }
              // DO NOT reset isSubmitting if success; let the navigation handle it
            } catch (e) {
              setIsSubmitting(false);
            }
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator size={"small"} color={colors.primaryContent} />
          ) : (
            <ThemedText type="primaryContent" style={styles.pressableText}>
              Log In
            </ThemedText>
          )}
        </ThemedPressable>

        <Spacer size={20} lineVisible />

        <ThemedText type="text" style={styles.headingText}>
          New here?{" "}
          <ThemedText
            style={[styles.headingText, { color: colors.primary }]}
            onPress={() => router.navigate("/(auth)/signUp")}
          >
            Sign Up
          </ThemedText>
        </ThemedText>

        <Spacer size={12} />

        <ThemedView style={{ flexDirection: "row" }}>
          <ThemedPressable
            onPress={() => {
              /* TODO */
            }}
            style={{ flex: 1 }}
          >
            <ThemedText type="primaryContent" style={styles.pressableText}>
              Forgot Password?
            </ThemedText>
          </ThemedPressable>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    height: "100%",
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  labelText: {
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: "600",
  },
  pressableText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    paddingLeft: 8,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default landing;
