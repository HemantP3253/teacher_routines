import { EmailIcon, PasswordIcon } from "@/assets/icons";
import {
  AppStatusBar,
  CustomPressable,
  CustomText,
  CustomTextInput,
  CustomView,
  Spacer,
} from "@/components/ui";
import { useLogInForm } from "@/hooks/useLogInForm";
import { handleLogin } from "@/services/authService";
import { checkLogInFormValidity } from "@/utils/validationUtils";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";

const Login = () => {
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
    <CustomView style={styles.rootContainer}>
      <ScrollView style={{ flex: 1 }}>
        <AppStatusBar />
        <Spacer size={8} />

        <CustomText type="text" style={styles.headingText}>
          Login
        </CustomText>

        <Spacer size={8} />

        <CustomText type="text" style={styles.labelText}>
          Login Details
        </CustomText>

        <CustomTextInput
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
        <CustomTextInput
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

        <CustomPressable
          disabled={isSubmitting}
          onPress={async () => {
            if (!checkLogInFormValidity(logInData, setLogInError, setLogInData))
              return;

            setIsSubmitting(true);
            const { message } = await handleLogin(logInData, "password");
            setIsSubmitting(false);
            if (message)
              setLogInError({
                usernameOrEmail: message,
                password: message,
              });
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator size={"small"} color={colors.primaryContent} />
          ) : (
            <CustomText type="primaryContent" style={styles.pressableText}>
              Log In
            </CustomText>
          )}
        </CustomPressable>

        <Spacer size={20} line={{ type: "divider" }} />

        <CustomText type="text" style={styles.headingText}>
          New here?{" "}
          <CustomText
            style={[styles.headingText, { color: colors.primary }]}
            onPress={() => router.navigate("/(auth)/signUp")}
          >
            Sign Up
          </CustomText>
        </CustomText>

        <Spacer size={12} />

        <CustomView style={{ flexDirection: "row" }}>
          <CustomPressable
            onPress={() => {
              // TODO: Add forgot password logic here
              // Something like this: await supabase.auth.resetPasswordForEmail()
            }}
            style={{ flex: 1 }}
          >
            <CustomText type="primaryContent" style={styles.pressableText}>
              Forgot Password?
            </CustomText>
          </CustomPressable>
        </CustomView>
      </ScrollView>
    </CustomView>
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

export default Login;
