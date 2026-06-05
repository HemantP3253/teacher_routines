import { degreeQuery } from "@/interfaces/interfaces";

export const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour <= 5) return "Goodnight";
  if (currentHour <= 11) return "Good morning";
  if (currentHour <= 17) return "Good afternoon";
  if (currentHour <= 21) return "Good evening";
  return "Goodnight";
};

export const getColorByString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += "00" + value.toString(16);
  }
  return color;
};

export const formatDegreeData = (str: string) => {
  str.replaceAll("FacultyOf", "");
  const regexPattern = /[A-Z]/;
  for (let i = 0; i < str.length; i++) {
    str.match(regexPattern);
  }
};

const TermMap: Record<number, string> = {
  1: "1st (First)",
  2: "2nd (Second)",
  3: "3rd (Third)",
  4: "4th (Fourth)",
  5: "5th (Fifth)",
  6: "6th (Sixth)",
  7: "7th (Seventh)",
  8: "8th (Eighth)",
  9: "9th (Ninth)",
  10: "10th (Tenth)",
};

export const termToFormattedString = (item?: number | string) => {
  if (item) return TermMap[typeof item === "string" ? Number(item) : item];
  return "Invalid";
};

export const termArrayToString = (item?: string[], term?: string) => {
  let formattedItem: string[] = [""];
  if (item) {
    for (let i: number = 0; i < item.length; i++) {
      formattedItem[i] = termToFormattedString(item[i]) + ` ${term}`;
    }
    return formattedItem;
  } else return [];
};

export const pad = (item: number) => {
  return item.toString().padStart(2, "0");
};

export const removeSpaces = (text: string) => {
  return text.replace(/\s+/g, "");
};

export function addSpacesAfterUppercase(text: string): string;
export function addSpacesAfterUppercase(text: string[]): string[];

// 2. Implement the actual function
export function addSpacesAfterUppercase(
  text: string | string[],
): string | string[] {
  if (Array.isArray(text)) {
    return text.map((item) => addSpacesAfterUppercase(item));
  }

  return text.replace(/([A-Z])/g, " $1").trim();
}

export const facultyNameToShortCode = (facultyName: string): string => {
  let shortCode: string, uppercaseMatches: string;
  const matchPattern = /[A-Z]/g;
  shortCode = facultyName.replace("And", "").replace("Of", "OF");
  uppercaseMatches = (shortCode.match(matchPattern)?.join("") || "").replace(
    "OF",
    "o",
  );
  if (uppercaseMatches.substring(2) === "AAS") uppercaseMatches = "IAAS";

  return uppercaseMatches;
};

export const shortCodeToFacultyName = (facultyCode: string): string => {
  if (facultyCode.length < 3) return "";

  const isFacultyType = facultyCode.charAt(0) === "F";
  const facultyDict = {
    E: "Education",
    HSS: "HumanitiesAndSocialSciences ",
    L: "Law",
    M: "Management",
  };
  const instituteDict = {
    AAS: "AgricultureAndAnimalScience",
    E: "Engineering",
    F: "Forestry",
    M: "Medicine",
    ST: "ScienceAndTechnology",
  };
  let prefix = isFacultyType ? "FacultyOf" : "InstituteOf";
  let postfix;
  const returnString = `${prefix}${postfix}`;

  if (isFacultyType)
    if (facultyCode.substring(2) in facultyDict) {
      postfix =
        facultyDict[facultyCode.substring(2) as keyof typeof facultyDict];
      return returnString;
    }

  if (facultyCode.includes("AAS")) {
    postfix = instituteDict.AAS;
    return returnString;
  }
  if (facultyCode.substring(2) in instituteDict) {
    postfix =
      instituteDict[facultyCode.substring(2) as keyof typeof instituteDict];
    return returnString;
  }

  return "";
};

export const degreeTypeToShortCode = (degreeType: string): string => {
  const degreeTypeDict = {
    Bachelors: "B",
    Masters: "M",
    MasterOfPhilosophy: "MP",
    DoctorOfPhilosophy: "PHD",
    PostgraduateDiplomas: "PGD",
  };
  const shortCode = degreeTypeDict[degreeType as keyof typeof degreeTypeDict];

  if (shortCode) return shortCode;
  return "";
};

export const shortCodeToDegreeType = (degreeType: string): string => {
  const degreeTypeDict = {
    B: "Bachelors",
    M: "Masters",
    MP: "MasterOfPhilosophy",
    PHD: "DoctorOfPhilosophy",
    PGD: "PostgraduateDiplomas",
  };
  const convertedDegreeType =
    degreeTypeDict[degreeType as keyof typeof degreeTypeDict];

  if (convertedDegreeType) return convertedDegreeType;
  return "";
};

export const formatSubjectCode = (degreeInfo: degreeQuery): string => {
  if (
    !degreeInfo.faculty ||
    !degreeInfo.degreeType ||
    !degreeInfo.degreeName ||
    !degreeInfo.term ||
    !degreeInfo.subjects
  )
    return "";
  const faculty = facultyNameToShortCode(degreeInfo.faculty);
  const degreeType = degreeTypeToShortCode(degreeInfo.degreeType);
  const degreeName = degreeInfo.degreeName;
  const branch = degreeInfo.branch;
  const term = degreeInfo.term;
  const subject = degreeInfo.subjects.split(":")[0];

  if (branch)
    return `${faculty}_${degreeType}_${degreeName}_${branch}_${term}_${subject}`;
  else if (subject !== "")
    return `${faculty}_${degreeType}_${degreeName}_${term}_${subject}`;
  else return "";
};

export const formattedSubjectCodeToObject = (subjectCode: string): Object => {
  const shortCodes = subjectCode.split("_");
  const hasBranches = shortCodes.length === 6;

  let degreeInfo: degreeQuery = {
    level: "subjects",
    faculty: shortCodeToFacultyName(shortCodes[0]),
    degreeType: shortCodeToDegreeType(shortCodes[1]),
    degreeName: shortCodes[2],
    branch: hasBranches ? shortCodes[3] : undefined, // Add shortCodeToBranchName
    term: hasBranches ? shortCodes[4] : shortCodes[3],
    subjects: hasBranches ? shortCodes[5] : shortCodes[4],
  };

  return degreeInfo;
};

export const RangeToSubjectTime = (
  startTime: string,
  endTime: string,
  maxDuration: string,
) => {
  let hours = Number(endTime) - Number(startTime);
};
