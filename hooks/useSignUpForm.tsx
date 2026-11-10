import { fetchAllInstitutes } from "@/services/instituteService";
import { supabase } from "@/services/supabase";
import { SignUpErrorProps, SignUpProps } from "@/types/common";
import { LocalInstituteData } from "@/types/localDbTypes";
import {
  formatDateInput,
  formatNameInput,
  formatNumberInput,
  formatPasswordInput,
  formatUsernameInput,
} from "@/utils/formatters";
import { isSignUpFormValid } from "@/utils/validationUtils";
import { useEffect, useState } from "react";

export const useSignUpForm = () => {
  const [signUpData, setSignUpData] = useState<SignUpProps>({
    name: "",
    dateOfBirth: "",
    username: "",
    gender: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [signUpError, setSignUpError] = useState<SignUpErrorProps>({});

  const [institutes, setInstitutes] = useState<LocalInstituteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const data = await fetchAllInstitutes();

        setInstitutes(data);
      } catch (error: any) {
        console.error("[useSignUpForm] Failed to load colleges. Error", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleInputChange = (field: keyof SignUpProps, value: string) => {
    let formattedValue = value;

    if (field === "name") formattedValue = formatNameInput(value);
    if (field === "phone")
      formattedValue = formatNumberInput({
        text: value,
        formatType: "wholeNumber",
      });
    if (field === "username") formattedValue = formatUsernameInput(value);
    if (field === "password" || field === "confirmPassword")
      formattedValue = formatPasswordInput(value);
    if (field === "dateOfBirth") formattedValue = formatDateInput(value);

    setSignUpData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
    setSignUpError((prev) => ({ ...prev, [field]: "" })); // Clear error when user types
  };

  const checkError = (error: keyof SignUpErrorProps) => {
    return signUpError[error] !== "" && signUpError[error] !== "Success!";
  };

  const submitSignUpForm = async () => {
    console.log(signUpData);

    if (!isSignUpFormValid(signUpData, setSignUpData, setSignUpError)) {
      console.log(
        "Form validation failed. Please correct the errors and try again.",
      );
      return;
    }
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
      });

      if (authError) {
        console.error("Sign up error (in signUp.tsx): ", authError.message);
        throw authError;
      }

      const userId = data.user?.id;

      if (!userId) {
        console.error("Signup succeeded but no user ID was returned.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        username: signUpData.username,
        full_name: signUpData.name,
        date_of_birth: signUpData.dateOfBirth,
        gender: signUpData.gender,
        phone: signUpData.phone,
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
  };

  return {
    signUpData,
    setSignUpData,
    signUpError,
    handleInputChange,
    checkError,
    modalVisible,
    setModalVisible,
    institutes,
    loading,
    submitSignUpForm,
  };
};
