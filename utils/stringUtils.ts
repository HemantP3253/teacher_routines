import { searchByDegreeName } from "@/data/degreeDataTU";
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

export const formatSubjectCode = (degreeInfo: degreeQuery): string => {
  if (!degreeInfo.degreeName || !degreeInfo.term || !degreeInfo.subjects)
    return "";
  const degreeName = degreeInfo.degreeName;
  const branch = degreeInfo.branch;
  const term = degreeInfo.term;
  const subject = degreeInfo.subjects.split(":")[0];

  if (branch) return `${degreeName}_${branch}_${term}_${subject}`;
  else if (subject !== "") return `${degreeName}_${term}_${subject}`;
  else return "";
};

export const formattedSubjectCodeToObject = (subjectCode: string): Object => {
  const shortCodes = subjectCode.split("_");
  const hasBranches = shortCodes.length === 6;
  const { faculty, degreeType } = searchByDegreeName(shortCodes[2]);

  let degreeInfo: degreeQuery = {
    level: "subjects",
    faculty: faculty,
    degreeType: degreeType,
    degreeName: shortCodes[2],
    branch: hasBranches ? shortCodes[3] : undefined, // Add shortCodeToBranchName
    term: hasBranches ? shortCodes[4] : shortCodes[3],
    subjects: hasBranches ? shortCodes[5] : shortCodes[4],
  };

  return degreeInfo;
};
