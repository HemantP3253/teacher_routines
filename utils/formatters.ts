import { pad } from "./stringUtils";

/**
 * Dynamically formats an input string into a `YYYY-MM-DD` date mask.
 *
 * Removes non-numeric characters and automatically inserts hyphens as the user types.
 *
 * @param dateString - The raw string input from the text field.
 * @returns The formatted date string capped at 10 characters (`YYYY-MM-DD`)
 *
 * @example
 * formatDateInput("202209") // Returns "2022-09"
 * formatDateInput("20260915") // Returns "2026-09-15"
 */
export const formatDateInput = (dateString: string) => {
  // Strip invalid characters (all characters except numbers)
  const cleaned = dateString.replace(/\D/g, "");
  let formatted = cleaned;

  // Add hyphen after YYYY (year) input
  if (cleaned.length > 4)
    formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;

  // Add hyphen after YYYY-MM-DD (month) input for date
  if (cleaned.length > 6)
    formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
  return formatted.slice(0, 10);
};

/**
 * Formats user input string dynamically as "YYYY-MM-DD HH:mm"
 * Automatically inserts "-", " ", and ":" as the user types.
 *
 * @param input - The raw string input from the text field
 * @returns The formatted date and time string capped at 16 characters (YYYY-MM-DD HH:mm)
 *
 * @example
 * formatDateTimeInput("20260910") // Returns "2026-09-10 "
 * formatDateTimeInput("202609090855") // Returns "2026-09-09 08:55"
 */
export const formatDateTimeInput = (input: string): string => {
  if (!input) return "";

  // Remove all non-numeric characters to get clean raw digits
  const digits = input.replace(/\D/g, "");

  // Limit input to max 12 digits (YYYYMMDDHHmm)
  const truncated = digits.slice(0, 12);
  const length = truncated.length;

  if (length === 0) return "";

  let formatted = "";

  // Year (YYYY)
  if (length <= 4) {
    return truncated;
  }
  formatted += `${truncated.slice(0, 4)}-`;

  // Month (MM)
  if (length <= 6) {
    return formatted + truncated.slice(4);
  }
  formatted += `${truncated.slice(4, 6)}-`;

  // Day (DD)
  if (length <= 8) {
    return formatted + truncated.slice(6);
  }
  formatted += `${truncated.slice(6, 8)} `;

  // Hours (HH)
  if (length <= 10) {
    return formatted + truncated.slice(8);
  }
  formatted += `${truncated.slice(8, 10)}:`;

  // Minutes (mm)
  formatted += truncated.slice(10, 12);

  return formatted;
};

/**
 * Formats user string dynamically as `HH:mm`.
 * Automatically inserts ":" as the user types.
 *
 * @param input - The raw string input from the text field
 * @returns The formatted time string capped at 8 characters (HH:mm AM/PM) and turns the input
 * into 12-hour time.
 *
 * @example
 * formatTimeInput("1503") // Returns 03:03 PM
 * formatTimeInput("1025") // Returns 10:25 AM
 */
export const formatTimeInput = (input: string) => {
  let cleaned = input.replace(/\D/g, "");

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

/**
 * Formats user's name by capitalizing first letters of every word.
 * Removes all other characters except alphabets and spaces.
 *
 * @param name - The raw input string for the name of a user
 * @returns The name separated by spaces, and the first letter of every word is capitalized.
 *
 * @example
 * formatNameInput("Hema4nt Pathak") // Returns "Hemant Pathak"
 * formatNameInput("Samriddhi 123Jnawali") // Returns "Samriddhi Jnawali"
 */
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

/**
 * Formats username by only keeping alphabets, and numbers.
 * Removes all other characters except alphabets, and numbers.
 *
 * @param username - The raw input string for the username
 * @returns The username stripped of any ambiguous characters.
 *
 * @example
 * formatUsernameInput("Hema4nt Pathak124") // Returns "Hema4ntPathak124"
 * formatUsernameInput("Samriddhi Jnawali@9214") // Returns "SamriddhiJnawali9214"
 */
export const formatUsernameInput = (username: string) => {
  return username.replace(/\W/g, "");
};

/**
 * Formats password by only keeping alphabets, numbers, and symbols.
 * Removes ambiguous special characters and spaces from the user input.
 *
 * @param password - The raw input string for the password
 * @returns The password stripped of any ambiguous characters and spaces.
 *
 * @example
 * formatPasswordInput("Hema4nt Pathak124#@") // Returns "Hema4ntPathak124#@"
 * formatPasswordInput("Samriddhi Jnawali@921$4") // Returns "SamriddhiJnawali@921$4"
 */
export const formatPasswordInput = (password: string) => {
  return password.replace(/[^!@#$%^&*0-9A-Za-z]/g, "");
};

/**
 * Formats string by only keeping them as numbers (whole or decimals).
 * Removes characters except numbers, and periods (.) from the user input.
 *
 * @param text - The raw input string to turn into a number string.
 * @param formatType - The type of formatting to be used for the number string
 * @param precision - Only used with decimal numbers, used for determining the numbers after the period ".". Default is 2.
 * @returns The string stripped of only numbers, and formatted to the chosen type.
 *
 * @example
 * formatNumberInput({text: "98465asd6231@3", formatType: "wholeNumber"}) // Returns "9846562313"
 * formatNumberInput({text: "165.@asd56as39", formatType: "decimalNumber", precision: 3}) // Returns "165.563"
 */
export const formatNumberInput = ({
  text,
  formatType,
  precision = 2,
}: {
  text: string;
  formatType: "wholeNumber" | "decimalNumber";
  precision?: number;
}): string => {
  if (!text) return "";

  if (formatType === "wholeNumber") {
    const digitsOnly = text.replace(/[^0-9]/g, "");
    if (digitsOnly.length > 1 && digitsOnly.startsWith("0")) {
      return digitsOnly.replace(/^0+/, "") || "0";
    }
    return digitsOnly;
  }

  if (formatType === "decimalNumber") {
    let cleaned = text.replace(/[^0-9.]/g, "");

    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    const [integerPart, decimalPart] = cleaned.split(".");

    if (decimalPart === undefined) {
      return integerPart;
    }

    const maxPrecision = precision > 0 ? precision : 2;
    const truncatedDecimal = decimalPart.slice(0, maxPrecision);

    return `${integerPart}.${truncatedDecimal}`;
  }

  return text;
};

/**
 * Formats email by only keeping alphabets, numbers, and email-valid symbols.
 * Removes email-invalid characters, and spaces from the user input.
 *
 * @param emailString - The raw input string for the email
 * @returns The email string stripped of any email-invalid characters.
 *
 * @example
 * formatEmailInput("example@#4gmail .com.@np") // Returns "example@4gmail.com.np"
 * formatEmailInput("HP23124##@Hp.com213") // Returns "hp23124@hp.com"
 */
export const formatEmailInput = (emailString: string): string => {
  if (!emailString) return "";

  // Convert to lower case, remove spaces, and strip unsupported characters
  const cleaned = emailString
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9@._+-]/g, "");

  // If no '@' is present yet, return clean local part
  const atIndex = cleaned.indexOf("@");
  if (atIndex === -1) return cleaned;

  // Separate into localPart (before first @) and domainPart (after first @)
  const localPart = cleaned.slice(0, atIndex);

  // Strip ANY additional '@' symbols typed in the domain section
  let domain = cleaned.slice(atIndex + 1).replace(/@/g, "");

  // Prevent consecutive dots inside domain (e.g. "gmail..com" -> "gmail.com")
  domain = domain.replace(/\.{2,}/g, ".");

  // Strip trailing digits, symbols, or dots appended after a TLD extension
  domain = domain.replace(/(\.[a-z]{2,})[^a-z]+$/g, "$1");

  return `${localPart}@${domain}`;
};

/**
 * Formats string as phone number by only keeping numbers.
 * Removes invalid starting digits for Nepalese phone numbers, and removes spaces from the user input.
 * Accepts numbers starting with [98, 97, 96] characters.
 *
 * @param phoneString - The raw input string for phone number
 * @returns The phone number string stripped of any invalid characters.
 *
 * @example
 * formatPhoneInput("984653@sf320.4") // Returns "9846533204"
 * formatPhoneInput("981230422--124") // Returns "981230422124"
 */
export const formatPhoneInput = (phoneString: string): string => {
  const cleaned = formatNumberInput({
    text: phoneString,
    formatType: "wholeNumber",
  });
  const validNumber = ["8", "7", "6"];
  if (!phoneString) return "";

  if (cleaned.length >= 0 && cleaned[0] !== "9") return "";
  if (cleaned.length >= 1 && validNumber.includes(cleaned[1])) return cleaned;

  return cleaned;
};
