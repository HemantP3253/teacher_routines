import { LogInErrorProps, LogInProps } from "@/types/common";
import { formatPasswordInput } from "@/utils/formatters";
import { useState } from "react";

export const useLogInForm = () => {
  const [logInData, setLogInData] = useState<LogInProps>({
    usernameOrEmail: "",
    password: "",
  });

  const [logInError, setLogInError] = useState<LogInErrorProps>({
    usernameOrEmail: "",
    password: "",
  });

  const handleInputChange = (field: keyof LogInProps, value: string) => {
    let formattedValue = value;

    if (field === "password") formattedValue = formatPasswordInput(value);

    setLogInData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));

    setLogInError((prev) => ({
      ...prev,
      [field === "usernameOrEmail" ? "usernameOrEmail" : "password"]: "",
    }));
  };

  const checkError = () => {
    return Object.values(logInError).some(
      (msg) => msg !== "" && msg !== "Success!",
    );
  };

  return {
    logInData,
    setLogInData,
    logInError,
    setLogInError,
    handleInputChange,
    checkError,
  };
};
