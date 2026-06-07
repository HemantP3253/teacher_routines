import { searchByDegreeName } from "@/data/degreeDataTU";
import { degreeQuery } from "@/interfaces/interfaces";

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
