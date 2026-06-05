import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { Spacer } from "@/components/common";
import {
  ThemedPressable,
  ThemedStatusBar,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "@/components/themed";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useLogInForm } from "@/hooks/useLogInForm";
import { supabase } from "@/services/supabase";
import { checkLogInFormValidity } from "@/utils/validationUtils";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
} from "react-native";

const landing = () => {
  const router = useRouter();
  const {
    logInData,
    setLogInData,
    setLogInError,
    logInError,
    handleInputChange,
  } = useLogInForm();
  const passwordRef = useRef<TextInput>(null);
  const { colors } = useAppTheme().theme;

  return (
    <ThemedView style={styles.rootContainer}>
      <ScrollView style={{ flex: 1 }}>
        <ThemedStatusBar />
        <Spacer size={8} />

        <ThemedText type="baseContent" style={styles.headingText}>
          {logInData.userType} Login
        </ThemedText>

        <Spacer size={8} />

        <ThemedText type="baseContent" style={styles.labelText}>
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
          onPress={async () => {
            if (!checkLogInFormValidity(logInData, setLogInError, setLogInData))
              return;
            const { error } = await supabase.auth.signInWithPassword({
              email: logInData.usernameOrEmail,
              password: logInData.password,
            });

            if (error) {
              setLogInError({
                usernameOrEmail: error.message,
                password: error.message,
              });
            }

            if (!error) {
              logInData.userType === "User"
                ? router.navigate("/(user)/home")
                : router.navigate("/(admin)/home"); // Change to router.replace("/(tabs)/home")
            }
          }}
        >
          <ThemedText type="primaryContent" style={styles.pressableText}>
            Log In
          </ThemedText>
        </ThemedPressable>

        <Spacer size={12} />
        <ThemedPressable
          onPress={() => {
            setLogInData((prev) => ({
              ...prev,
              userType: logInData.userType === "Admin" ? "User" : "Admin",
            }));
          }}
        >
          <ThemedText type="primaryContent" style={styles.pressableText}>
            {logInData.userType === "Admin" ? "User" : "Admin"} Log In
          </ThemedText>
        </ThemedPressable>

        <Spacer size={20} lineVisible />

        <ThemedText type="baseContent" style={styles.headingText}>
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
