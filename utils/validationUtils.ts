import {
  LogInErrorProps,
  LogInProps,
  SignUpErrorProps,
  SignUpProps,
} from "@/interfaces/interfaces";

export const isSignUpFormValid = (
  signUpData: SignUpProps,
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpProps>>,
  setSignUpError: React.Dispatch<React.SetStateAction<SignUpErrorProps>>,
) => {
  // Object to collect all errors
  const newErrors: SignUpErrorProps = {
    name: checkNameValidity(signUpData.name),
    gender: checkGenderValidity(signUpData.gender),
    dateOfBirth: checkDateOfBirthValidity(signUpData.dateOfBirth),
    email: checkEmailValidity(signUpData.email),
    password: checkPasswordValidity(signUpData.password),
    confirmPassword: checkConfirmPasswordValidity(
      signUpData.confirmPassword,
      signUpData.password,
    ),
    username: checkUsernameValidity(signUpData.username),
    phone: checkPhoneValidity(signUpData.phone),
  };

  const hasError = Object.values(newErrors).some((msg) => msg !== "Success!");

  setSignUpError(newErrors);
  setSignUpData((prev: any) => ({ ...prev, error: hasError }));

  return !hasError;
};

export const checkLogInFormValidity = (
  logInData: LogInProps,
  setLoginError: React.Dispatch<React.SetStateAction<LogInErrorProps>>,
  setLogInData: React.Dispatch<React.SetStateAction<LogInProps>>,
) => {
  const newErrors: LogInErrorProps = {
    usernameOrEmail: logInData.usernameOrEmail.includes("@")
      ? checkEmailValidity(logInData.usernameOrEmail)
      : checkUsernameValidity(logInData.usernameOrEmail),
    password: checkPasswordValidity(logInData.password),
  };

  const hasError = Object.values(newErrors).some((msg) => msg !== "Success!");

  if (hasError) {
    setLoginError({
      usernameOrEmail: "Invalid username or password",
      password: "Invalid username or password",
    });
  } else {
    setLoginError({
      usernameOrEmail: "",
      password: "",
    });
  }
  setLogInData((prev: any) => ({ ...prev, error: hasError }));

  return !hasError;
};

const checkGenderValidity = (gender: "Male" | "Female" | "Others" | "") => {
  if (gender === "") {
    return "Gender is required";
  }
  return "Success!";
};

const checkNameValidity = (name: string) => {
  const nameRegexPattern = /^[a-z\s]+$/i;
  if (!name) return "Name is required"; // Line changed for testing from (name === "")
  if (!nameRegexPattern.test(name))
    return "Name can only contain spaces and letters";
  if (name.length <= 5) return "Name must be more than 5 characters";
  return "Success!";
};

const checkUsernameValidity = (username: string) => {
  const nameRegexPattern = /^[a-z\d_']+$/i;
  if (username === "") return "Username is required";
  if (!nameRegexPattern.test(username))
    return "Username can only contain letters, underscores and numbers";
  if (username.length <= 5) return "Username must be more than 5 characters";
  return "Success!";
};

const checkEmailValidity = (email: string) => {
  const regexPattern = /.+@.+\.(?=com)/;
  if (email === "") return "Email is required";
  if (email.includes(" ") || !regexPattern.test(email)) return "Invalid email";
  return "Success!";
};

const checkDateOfBirthValidity = (date: string) => {
  const nowDate = new Date();
  if (date === "") return "Please choose your date of birth";
  if (Number(nowDate.getFullYear()) - Number(date.slice(0, 4)) <= 13)
    return "You must be at least 13 years old to use this app";
  return "Success!";
};

const checkPasswordValidity = (password: string) => {
  const regexPattern = [/[!@#$%^&*]/g, /[0-9]/g, /[A-Z]/g, /\s/];
  let errors = "";
  if (password === "") return "Please enter a password";
  if (!regexPattern[0].test(password))
    errors += "Password must have at least one special character (!@#$%^&*)";
  if (password.length <= 8)
    errors = errors.concat(
      `${errors === "" ? "" : "\n"}Password must be at least 8 characters long`,
    );
  if (!regexPattern[1].test(password))
    errors = errors.concat(
      `${errors === "" ? "" : "\n"}Password must have at least one number (0-9)`,
    );
  if (!regexPattern[2].test(password))
    errors = errors.concat(
      `${errors === "" ? "" : "\n"}Password must have at least one uppercase letter (A-Z)`,
    );
  if (regexPattern[3].test(password))
    errors = errors.concat(
      `${errors === "" ? "" : "\n"}Password must not contain spaces`,
    );

  return errors === "" ? "Success!" : errors;
};

const checkConfirmPasswordValidity = (
  confirmPassword: string,
  password: string,
) => {
  if (confirmPassword === "") return "Please enter confirm password";
  if (confirmPassword !== password)
    return "Confirm password must be same as password";
  return "Success!";
};

const checkPhoneValidity = (phone: string) => {
  const numberRegex = /^\d+$/;
  const validPrefixes = ["98", "97", "96", "95"];
  const prefix = phone.substring(0, 2);
  if (phone === "") return "Please enter a phone number";
  if (!numberRegex.test(phone)) return "Phone number must only contain numbers";
  if (!phone.startsWith("9")) return "Invalid phone number";
  if (phone.length !== 10) return "Phone number must be 10 digits";
  if (!validPrefixes.includes(prefix)) return "Invalid phone number";
  return "Success!";
};
