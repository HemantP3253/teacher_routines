import {
  CalendarInfoIcon,
  EmailIcon,
  GenderIcon,
  NameIcon,
  PasswordIcon,
  PhoneIcon,
  UsernameIcon,
} from "@/assets/icons";
import { CustomModal, Spacer } from "@/components/common";
import {
  ThemedModalMenu,
  ThemedPressable,
  ThemedStatusBar,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "@/components/themed";
import { ThemedCheckbox } from "@/components/themed/";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { supabase } from "@/services/supabase";
import { useAppDatePicker } from "@/utils/pickerUtils";
import { pad } from "@/utils/stringUtils";
import { isSignUpFormValid } from "@/utils/validationUtils";
import React, { useMemo, useRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { AdToBs, CalendarPicker } from "react-native-nepali-picker";
import { useUnistyles } from "react-native-unistyles";

// Sign up page code
const signUp = () => {
  const genderData = ["Male", "Female", "Others"];
  const {
    signUpData,
    setSignUpData,
    signUpError,
    setSignUpError,
    handleInputChange,
    modalVisible,
    setModalVisible,
    colleges,
  } = useSignUpForm();
  const inputRefs = useRef<Record<string, TextInput | null>>({});

  const { theme, rt } = useUnistyles();
  console.log(theme.colors.text);
  const colors = theme.colors;

  const now = new Date();
  const selectedDate = useMemo(
    () =>
      signUpData.dateOfBirth
        ? new Date(signUpData.dateOfBirth)
        : new Date(now.getFullYear() - 13, now.getMonth(), now.getDate()),

    [signUpData.dateOfBirth],
  );

  const datePicker = useAppDatePicker({
    selectedDate,
    onDateChange: (date) => {
      handleInputChange(
        "dateOfBirth",
        [
          date.getFullYear(),
          pad(date.getMonth() + 1),
          pad(date.getDate()),
        ].join("-"),
      );
    },
  });

  const focusNextField = (id: string) => {
    inputRefs.current[id]?.focus();
  };

  return (
    <ThemedView style={styles.rootContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 24,
            paddingHorizontal: 4,
          }}
        >
          <ThemedStatusBar />
          <Spacer size={8} />

          <ThemedText type="text" style={styles.headingText}>
            Register New User
          </ThemedText>

          <Spacer size={8} />

          <ThemedText type="text" style={styles.labelText}>
            Personal Details
          </ThemedText>
          <ThemedTextInput
            ref={(element) => {
              inputRefs.current["fullName"] = element;
            }}
            Icon={NameIcon}
            onSubmitEditing={() => focusNextField("dateOfBirth")}
            value={signUpData.name}
            errorText={signUpError.name}
            title="Full Name"
            onChangeText={(name) => {
              handleInputChange("name", name);
            }}
            autoCapitalize="words"
          />

          <ThemedTextInput
            ref={(element) => {
              inputRefs.current["dateOfBirth"] = element;
            }}
            Icon={CalendarInfoIcon}
            title="Date of Birth"
            value={signUpData.dateOfBirth}
            onChangeText={(dateOfBirth) => {
              handleInputChange("dateOfBirth", dateOfBirth);
            }}
            errorText={signUpError.dateOfBirth}
            infoText="You must be 13 years or older to use this app"
            customComponent={
              <ThemedPressable
                noFill
                style={{
                  height: 50,
                  paddingHorizontal: 12,
                  justifyContent: "center",
                }}
                onPress={() => datePicker.openPicker()}
              >
                <CalendarInfoIcon
                  fill={colors.primary}
                  width={24}
                  height={24}
                />
              </ThemedPressable>
            }
          />

          <CalendarPicker
            visible={datePicker.visible}
            date={datePicker.getInitialBsValue()}
            onDateSelect={datePicker.handleNepaliDateSelect}
            onClose={datePicker.closePicker}
            language="en"
            brandColor={colors.primary}
            maxDate={AdToBs(
              [now.getFullYear() - 13, now.getMonth() + 1, now.getDate()].join(
                "-",
              ),
            )}
            theme={rt.themeName == "light" ? "light" : "dark"}
          />

          <Spacer size={8} />

          <ThemedModalMenu
            title={
              signUpData.gender === "" ? "Select Gender" : signUpData.gender
            }
            errorText={signUpError.gender}
            setItem={(gender) => setSignUpData((prev) => ({ ...prev, gender }))}
            data={genderData}
            type="Gender"
            Icon={GenderIcon}
            noFill
            onPressOut={() => {
              setSignUpError((prev) => ({ ...prev, gender: "" }));
            }}
            item={signUpData.gender}
          />

          <Spacer size={8} />

          <ThemedText type="text" style={styles.labelText}>
            Account details
          </ThemedText>
          <ThemedTextInput
            ref={(element) => {
              inputRefs.current["username"] = element;
            }}
            Icon={UsernameIcon}
            errorText={signUpError.username}
            onSubmitEditing={() => focusNextField("email")}
            value={signUpData.username}
            onChangeText={(username) => handleInputChange("username", username)}
            title="Username"
            maxLength={25}
          />

          <ThemedTextInput
            ref={(element) => {
              inputRefs.current["email"] = element;
            }}
            errorText={signUpError.email}
            Icon={EmailIcon}
            onSubmitEditing={() => focusNextField("password")}
            value={signUpData.email}
            onChangeText={(email) => handleInputChange("email", email)}
            title="Email"
            maxLength={254}
          />

          <ThemedTextInput
            ref={(element) => {
              inputRefs.current["password"] = element;
            }}
            errorText={signUpError.password}
            Icon={PasswordIcon}
            onSubmitEditing={() => focusNextField("confirmPassword")}
            value={signUpData.password}
            onChangeText={(password) => handleInputChange("password", password)}
            secureTextEntry={true}
            title="Password"
            maxLength={128}
            infoText={`Password must have at least one uppercase letter\nPassword must have at least one symbol character\nPassword must have at least one number\nPassword must not contain spaces`}
          />

          <ThemedTextInput
            ref={(element) => {
              inputRefs.current["confirmPassword"] = element;
            }}
            errorText={signUpError.confirmPassword}
            Icon={PasswordIcon}
            onSubmitEditing={() => focusNextField("phone")}
            value={signUpData.confirmPassword}
            onChangeText={(confirmPassword) =>
              handleInputChange("confirmPassword", confirmPassword)
            }
            secureTextEntry={true}
            title="Confirm password"
            maxLength={128}
          />

          <ThemedTextInput
            ref={(element) => {
              inputRefs.current["phone"] = element;
            }}
            errorText={signUpError.phone}
            Icon={PhoneIcon}
            onSubmitEditing={() => Keyboard.dismiss()}
            value={signUpData.phone}
            onChangeText={(phone) => {
              handleInputChange("phone", phone);
            }}
            maxLength={10}
            keyboardType="numeric"
            returnKeyType="done"
            title="Phone"
          />

          <ThemedPressable
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <ThemedText>Colleges</ThemedText>
          </ThemedPressable>

          <CustomModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <View style={{ width: "100%" }}>
              <ThemedCheckbox
                data={colleges}
                getId={(item) => item.id}
                getLabel={(item) => item.college_name}
                getSubLabel={(item) =>
                  `Code: ${item.college_code}\nUniversity: ${item.university}\nAddress: ${item.address}`
                }
                onSubmit={(selectedIds) => {
                  setSignUpData((prev) => ({ ...prev, colleges: selectedIds }));
                  setModalVisible(false);
                }}
              />
            </View>
          </CustomModal>
          <Spacer size={8} />

          <ThemedPressable
            onPress={async () => {
              if (!isSignUpFormValid(signUpData, setSignUpData, setSignUpError))
                return;

              try {
                const { data: authData, error: authError } =
                  await supabase.auth.signUp({
                    email: signUpData.email,
                    password: signUpData.password,
                  });

                if (authError) {
                  // Modify Later
                  console.error(
                    "Sign up error (in signUp.tsx): ",
                    authError.message,
                  );
                  return;
                }

                const registeredUser = authData?.user;

                if (!registeredUser) {
                  console.error("Auth completed but no user data returned.");
                }

                const { error: profileError } = await supabase
                  .from("profiles")
                  .insert({
                    id: registeredUser?.id,
                    username: signUpData.username,
                    full_name: signUpData.name,
                    date_of_birth: signUpData.dateOfBirth,
                    colleges: signUpData.colleges,
                    gender: signUpData.gender,
                    phone: signUpData.phone,
                    is_admin: false,
                  });

                if (profileError) {
                  console.error(
                    "Profile DB Entry Error (in signUp.tsx): ",
                    profileError.message,
                  );
                  return;
                }
              } catch (error: any) {
                console.error("Signup Error (in signUp.tsx): ", error.message);
              }
            }}
          >
            <ThemedText type="primaryContent" style={styles.pressableText}>
              Sign Up
            </ThemedText>
          </ThemedPressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
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
});

export default signUp;
