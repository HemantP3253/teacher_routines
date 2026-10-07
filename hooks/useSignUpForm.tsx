import {
  InstituteData,
  SignUpErrorProps,
  SignUpProps,
} from "@/interfaces/interfaces";
import { fetchAllInstitutes } from "@/services/instituteService";
import {
  formatDateInput,
  formatNameInput,
  formatNumberInput,
  formatPasswordInput,
  formatUsernameInput,
} from "@/utils/formatters";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

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
    hasError: false,
  });

  const [signUpError, setSignUpError] = useState<SignUpErrorProps>({
    name: "",
    dateOfBirth: "",
    gender: "",
    username: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [institutes, setInstitutes] = useState<InstituteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const data = await fetchAllInstitutes();

        setInstitutes(data);
      } catch (err) {
        Alert.alert("Error", "Failed to load colleges. Please try again.");
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

  return {
    signUpData,
    setSignUpData,
    signUpError,
    setSignUpError,
    handleInputChange,
    checkError,
    modalVisible,
    setModalVisible,
    institutes,
    loading,
  };
};
