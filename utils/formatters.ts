import { pad } from "./stringUtils";

export const formatDateInput = (dateString: string) => {
  const cleaned = dateString.replace(/\D/g, "");
  let formatted = cleaned;
  if (cleaned.length > 4)
    formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  if (cleaned.length > 6)
    formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
  return formatted.slice(0, 10);
};

export const formatTimeInput = (text: string) => {
  let cleaned = text.replace(/\D/g, "");

  if (cleaned.length >= 1) {
    if (!/^[0-2]/.test(cleaned[0])) cleaned = "";
  }

  if (cleaned.length >= 2) {
    const firstDigit = cleaned[0];
    if (firstDigit === "2" && Number(cleaned[1]) > 3) {
      cleaned = firstDigit;
    }
  }

  if (cleaned.length > 2)
    cleaned = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;

  if (cleaned.length === 4) {
    if (Number(cleaned[3]) > 5) cleaned = cleaned.slice(0, 2);
  }

  cleaned = cleaned.slice(0, 5);

  if (cleaned.length === 5) {
    const dayPeriod = Number(cleaned.slice(0, 2)) > 12 ? "PM" : "AM";
    cleaned = `${Number(cleaned.slice(0, 2)) > 12 ? pad(Number(cleaned.slice(0, 2)) - 12) : pad(Number(cleaned.slice(0, 2)))}:${pad(Number(cleaned.slice(3, 5)))} ${dayPeriod}`;
  }

  return cleaned;
};

export const formatNameInput = (name: string) => {
  const cleaned = name.replace(/[^a-zA-Z\s]/g, "");
  const duplicateSpacesRemoved = cleaned.replace(/\s+/g, " ");
  return duplicateSpacesRemoved
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1, word.length).toLowerCase(),
    )
    .join(" ");
};

export const formatUsernameInput = (username: string) => {
  return username.replace(/\W/g, "");
};

export const formatPasswordInput = (password: string) => {
  return password.replace(/[^!@#$%^&*0-9A-Za-z]/g, "");
};

export const formatNumberInput = ({
  text,
  formatType,
}: {
  text: string;
  formatType: "wholeNumber" | "decimalNumber";
}) => {
  if (formatType === "wholeNumber") return text.replace(/[^0-9]/g, "");
  if (formatType === "decimalNumber") {
    let cleaned = text.replace(/[^0-9.]/g, "");

    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    return cleaned;
  }

  return text;
};
