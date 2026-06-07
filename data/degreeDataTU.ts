import { Curriculum, degreeQuery } from "@/interfaces/interfaces";
import { removeSpaces, termArrayToString } from "@/utils/stringUtils";
import { addSpacesAfterUppercase } from "./../utils/stringUtils";

export const searchByDegreeName = (degreeName: string) => {
  if (!degreeName) return { faculty: "", degreeType: "" };

  const normalizedKey = degreeName.trim().toUpperCase();

  for (const facultyKey of Object.keys(Curriculums)) {
    const facultyData = Curriculums[facultyKey as keyof typeof Curriculums];

    for (const degreeTypeKey of Object.keys(facultyData)) {
      const typeData = facultyData[degreeTypeKey as keyof typeof facultyData];

      for (const currentDegreeName of Object.keys(typeData)) {
        if (currentDegreeName.trim().toUpperCase() === normalizedKey) {
          return {
            faculty: addSpacesAfterUppercase(facultyKey),
            degreeType: degreeTypeKey,
          };
        }
      }
    }
  }

  return { faculty: "", degreeType: "" };
};

export const getAllDegreeNames = (): string[] => {
  const aggregatedDegrees: string[] = [];

  for (const faculty of Object.values(Curriculums)) {
    for (const type of Object.values(faculty)) {
      aggregatedDegrees.push(...Object.keys(type));
    }
  }

  return aggregatedDegrees.sort();
};

export const getCurriculumData = (query: degreeQuery): string[] => {
  const { level, faculty, degreeType, degreeName, term, branch } = query;
  if (level === "degreeName" && faculty && degreeType) {
    const typeData =
      Curriculums[removeSpaces(faculty) as keyof Curriculum]?.[
        removeSpaces(degreeType)
      ];
    return typeData ? Object.keys(typeData) : [];
  }

  if (level === "branch" && faculty && degreeType && degreeName) {
    const branchData =
      Curriculums[removeSpaces(faculty) as keyof Curriculum]?.[degreeType]?.[
        degreeName
      ];
    return branchData?.branches ? Object.keys(branchData.branches) : [];
  }

  if (level === "term" && faculty && degreeType && degreeName) {
    const termData =
      Curriculums[removeSpaces(faculty) as keyof Curriculum]?.[degreeType]?.[
        degreeName
      ];

    if (!termData) return [];

    let degreeData;

    if (branch && termData.branches) {
      degreeData = termData.branches[branch];
    } else {
      degreeData = termData.data;
    }

    return degreeData
      ? termArrayToString(Object.keys(degreeData), termData.type)
      : [];
  }

  if (level === "subjects" && faculty && degreeType && degreeName && term) {
    const subjectData =
      Curriculums[removeSpaces(faculty) as keyof Curriculum]?.[degreeType]?.[
        degreeName
      ];
    if (!subjectData) return [];
    let degreeData;
    if (branch && subjectData.branches) {
      degreeData =
        subjectData.branches[branch]?.[Number((term as string).charAt(0))];
    } else {
      degreeData = subjectData.data?.[Number((term as string).charAt(0))];
    }

    return degreeData
      ? Object.entries(degreeData).map(([code, name]) => `${code}: ${name}`)
      : [];
  }

  return [];
};

export const Curriculums: Curriculum = {
  // Data for Faculty of Humanities and Social Sciences
  FacultyOfHumanitiesAndSocialSciences: {
    Bachelors: {
      BA: {
        hasBranches: true,
        type: "Year",
        common: {
          1: {
            "C.Eng 401": "Compulsory English I",
            "C.Nep 402": "Compulsory Nepali",
          },
          2: {
            "Nepal Studies": "Nepal Studies",
          },
          3: {
            "C.Eng 403": "Compulsory English II",
          },
        },
        branches: {
          Sociology: {
            1: {
              CENG401: "Compulsory English I",
              CNEP402: "Compulsory Nepali",
              SO421: "Introduction to Sociology",
              SO422: "Dynamics of Nepali Society",
            },
            2: {
              CENG403: "Reading & Writing Across Disciplines",
              SO423: "Sociological Theories",
              SO424: "Research Methods in Sociology",
            },
            3: {
              SO425: "Sociology of Democracy & Diversity",
              SO410: "Federalism & Local Planning (Elective)",
            },
            4: {
              SO426: "Sociology of Development",
              SO427: "Academic Writing & Research",
            },
          },
          "Major English": {
            1: {
              CENG401: "Compulsory English I",
              CNEP402: "Compulsory Nepali",
              ENG421: "Reading, Writing and Thinking",
              ENG422: "History of English Literature",
            },
            2: {
              CENG403: "Reading & Writing Across Disciplines",
              ENG423: "Prose: Essays and Short Stories",
              ENG424: "Reading and Responding to Poetry",
            },
            3: {
              ENG425: "Visual Arts",
              ENG410: "Professional & Technical Communication",
            },
            4: {
              ENG426: "Drama and Novel",
              ENG427: "Research and Writing",
            },
          },
          "Rural Development": {
            1: {
              CENG401: "Compulsory English I",
              CNEP402: "Compulsory Nepali",
              RD421: "Theories of Development",
              RD422: "Basic Research Methods",
            },
            2: {
              CENG403: "Reading & Writing Across Disciplines",
              RD423: "Economics and Development",
              RD424: "Society and Development",
            },
            3: {
              RD425: "Governance and Development",
              RD410: "Rural Sociology (Elective)",
            },
            4: {
              RD426: "Environment and Development",
              RD427: "Planning and Project Management",
            },
          },
        },
      },
      BCA_Old: {
        hasBranches: false,
        type: "Semester",
        data: {
          1: {
            CACS101: "Computer Fundamentals & Applications",
            CACO102: "Society and Technology",
            CAEN103: "English I",
            CAMT104: "Mathematics I",
            CACS105: "Digital Logic",
          },
          2: {
            CACS151: "C Programming",
            CAAC152: "Financial Accounting",
            CAEN153: "English II",
            CAMT154: "Mathematics II",
            CACS155: "Microprocessor and Computer Architecture",
          },
          3: {
            CACS201: "Data Structures and Algorithms",
            CAST202: "Probability and Statistics",
            CACS203: "System Analysis and Design",
            CACS204: "OOP in Java",
            CACS205: "Web Technology I",
          },
          4: {
            CACS251: "Operating System",
            CACS252: "Numerical Methods",
            CACS253: "Software Engineering",
            CACS254: "Scripting Language",
            CACS255: "Database Management System",
            CAPJ256: "Project I",
          },
          5: {
            CACS301: "MIS and E-Business",
            CACS302: "DotNet Technology",
            CACS303: "Computer Networking",
            CAMG304: "Introduction to Management",
            CACS305: "Computer Graphics and Animation",
          },
          6: {
            CACS351: "Mobile Programming",
            CACS352: "Distributed System",
            CAEC353: "Applied Economics",
            CACS354: "Advanced Java Programming",
            CACS355: "Network Programming",
            CAPJ356: "Project II",
          },
          7: {
            CACS401: "Cyber Law and Professional Ethics",
            CACS402: "Cloud Computing",
            CAIN403: "Internship",
            CACS404: "Image Processing",
            CACS405: "Database Administration",
            CACS406: "Network Administration",
            CACS408: "Advanced Dot Net Technology",
            CACS409: "E-Governance",
            CACS410: "Artificial Intelligence",
          },
          8: {
            CAOR451: "Operations Research",
            CAPJ452: "Project III",
            CACS453: "Database Programming",
            CACS454: "Geographical Information System",
            CACS455: "Data Analysis and Visualization",
            CACS456: "Information Retrieval",
            CACS457: "Software Project Management",
            CACS458: "Network Security",
            CACS459: "Digital Economy",
            CACS460: "E-Commerce",
          },
        },
      },
      BCA_New: {
        hasBranches: false,
        type: "Semester",
        data: {
          1: {
            BCA101: "Computer Fundamentals and Applications",
            BCA102: "Programming in C",
            BCA103: "Digital Logic",
            BCA104: "Mathematics-I",
            BCA105: "Professional Communication and Ethics",
            BCA106: "Hardware Workshop",
          },
          2: {
            BCA151: "Discrete Structure",
            BCA152: "Microprocessor and Computer Architecture",
            BCA153: "OOP in Java",
            BCA154: "Mathematics-II",
            BCA155: "UX/UI Design",
            BCA156: "Principles of Management",
          },
          3: {
            BCA201: "Data Structure and Algorithms",
            BCA202: "Database Management System",
            BCA203: "Web Technology-I",
            BCA204: "System Analysis and Design",
            BCA205: "Probability and Statistics",
            BCA206: "Applied Economics",
          },
          4: {
            BCA251: "Operating Systems",
            BCA252: "Software Engineering",
            BCA253: "Numerical Methods",
            BCA254: "Python Programming",
            BCA255: "Web Technology-II",
            BCA256: "Project-I",
          },
          5: {
            BCA301: "Computer Network",
            BCA302: "Artificial Intelligence",
            BCA303: "Advance Java Programming",
            BCA304: "MIS and e-Business",
            BCA305: "Society and Technology",
            BCA306: "Project-II",
          },
          6: {
            BCA351: "Computer Graphics and animation",
            BCA352: "Mobile Programming",
            BCA353: "Cryptography and Network Security",
            BCA354: "Technical Writing",
            BCA355: "Distributed System",
            BCA356: "Project-III",
          },
          7: {
            BCA401: "Cyber Security and Ethical Hacking",
            BCA402: "Software Project Management",
            BCA403: "Financial Accounting",
            BCA404: "Project-IV",
            // BCA405: "Elective-I",
            // BCA406: "Elective-II",

            // Elective I Options
            "BCA404-I": "Machine Learning",
            "BCA404-II": "E-Commerce",
            "BCA404-III": "Database Administration",
            "BCA404-IV": "Linux",
            // Elective II Options
            "BCA405-I": "Dotnet Technology",
            "BCA405-II": "Business Intelligence",
            "BCA405-III": "Software Testing and Quality Assurance",
            "BCA405-IV": "Data Visualization",
          },
          8: {
            BCA451: "Cloud Computing",
            BCA452: "Internship",
            // BCA453: "Elective-III",
            // BCA454: "Elective-IV",

            // Elective III Options
            "BCA453-I": "Network Administration",
            "BCA453-II": "E-governance",
            "BCA453-III": "Database Programming",
            "BCA453-IV": "Geographical Information System",
            // Elective IV Options
            "BCA454-I": "Digital Marketing and SEO",
            "BCA454-II": "Image Processing",
            "BCA454-III": "Internet of Things",
            "BCA454-IV": "Data Mining and Data warehouse",
          },
        },
      },
      BSW: {
        hasBranches: false,
        type: "Year",
        data: {
          1: {
            BSW401: "Introduction to Social Work",
            BSW402: "Basic Concepts in Sociology and Anthropology",
            ENGL401: "Compulsory English I",
            NEPL401: "Compulsory Nepali",
          },
          2: {
            BSW403: "Social Case Work",
            BSW404: "Social Group Work",
            ENGL402: "Compulsory English II",
            ALT401: "Alternative English / Applied Language",
          },
          3: {
            BSW405: "Social Welfare Administration",
            BSW406: "Community Organization and Development",
            BSW407: "Social Work Research and Methods",
            ELECT401: "Elective (Functional Paper)",
          },
          4: {
            BSW408: "Social Policy and Leadership",
            BSW409: "Social Action and Social Movements",
            BSW410: "Human Rights and Social Justice",
            FIELD411: "Field Work and Research Project",
          },
        },
      },
    },
    Masters: {
      MCA: {
        hasBranches: false,
        type: "Semester",
        data: {
          1: {
            MCA501: "Discrete Structure",
            MCA502: "Advanced Operating System",
            MCA503: "Advanced Database Management System",
            MCA504: "Programming Logic & Techniques using Python",
            MCA505: "Research Methodology in Computer Applications",
            MCA506: "Technical Writing",
          },
          2: {
            MCA551: "Algorithm Analysis & Design",
            MCA552: "Object Oriented Software Engineering",
            MCA553: "Internet & Web Programming",
            MCA554: "Project I",
            MCA555: "Academic Writing - I",
            // Elective I options
            MCA556: "Digital Humanity",
            MCA557: "Digital Marketing",
            MCA558: "Knowledge Management",
            MCA559: "E-Governance",
          },
          3: {
            MCA601: "Cryptography and Network Security",
            MCA602: "Data Mining & Data Warehousing",
            MCA603: "Project II",
            MCA604: "Academic Writing - II",
            // Common Electives II & III
            MCA605: "Big Data Management",
            MCA606: "Managerial Economics",
            MCA607: "Virtualization & Cloud Computing",
            MCA608: "Image Processing",
            MCA609: "Artificial Intelligence",
            MCA610: "Digital Forensics",
            MCA611: "GIS & Remote Sensing",
            MCA612: "Data Science",
          },
          4: {
            MCA651: "Dissertation",
            MCA652: "Project III",
            // Common Electives IV & V
            MCA653: "Machine Learning",
            MCA654: "Internet of Things (IoT)",
            MCA655: "Information Security Audit",
            MCA656: "Natural Language Processing",
            MCA657: "IT Infrastructure Management",
            MCA658: "Quantum Computing",
            MCA659: "Business Intelligence",
            MCA660: "UI/UX Design",
          },
        },
      },
    },
  },
  InstituteOfScienceAndTechnology: {
    Bachelors: {
      "B.Sc.CSIT": {
        hasBranches: false,
        type: "Semester",
        data: {
          1: {
            CSC109: "Introduction to Information Technology",
            CSC110: "C Programming",
            CSC111: "Digital Logic",
            MTH112: "Mathematics I",
            PHY113: "Physics",
          },
          2: {
            CSC160: "Discrete Structure",
            CSC161: "Object Oriented Programming",
            CSC162: "Microprocessor",
            MTH163: "Mathematics II",
            STA164: "Statistics I",
          },
          3: {
            CSC206: "Data Structure and Algorithms",
            CSC207: "Numerical Method",
            CSC208: "Computer Architecture",
            CSC209: "Computer Graphics",
            STA210: "Statistics II",
          },
          4: {
            CSC257: "Theory of Computation",
            CSC258: "Computer Networks",
            CSC259: "Operating Systems",
            CSC260: "Database Management System",
            CSC261: "Artificial Intelligence",
          },
          5: {
            CSC314: "Design and Analysis of Algorithms",
            CSC315: "System Analysis and Design",
            CSC316: "Cryptography",
            CSC317: "Simulation and Modeling",
            CSC318: "Web Technology",
            // List of Electives I
            CSC319: "Multimedia Computing",
            CSC320: "Wireless Networking",
            CSC321: "Image Processing",
            CSC322: "Knowledge Management",
            CSC323: "Society and Ethics in Information Technology",
            CSC324: "Microprocessor Based Design",
          },
          6: {
            CSC364: "Software Engineering",
            CSC365: "Compiler Design and Construction",
            CSC366: "E-Governance",
            CSC367: "NET Centric Computing",
            CSC368: "Technical Writing",
            // List of Electives II
            CSC369: "Applied Logic",
            CSC370: "E-commerce",
            CSC371: "Automation and Robotics",
            CSC372: "Neural Networks",
            CSC373: "Computer Hardware Design",
            CSC374: "Cognitive Science",
          },
          7: {
            CSC409: "Advanced Java Programming",
            CSC410: "Data Warehousing and Data Mining",
            MGT411: "Principles of Management",
            CSC412: "Project Work",
            // List of Electives III
            CSC413: "Information Retrieval",
            CSC414: "Database Administration",
            CSC415: "Software Project Management",
            CSC416: "Network Security",
            CSC417: "Digital System Design",
            MGT418: "International Marketing",
          },
          8: {
            CSC461: "Advanced Database",
            CSC462: "Internship",
            // List of Electives IV & V
            CSC463: "Advanced Networking with IPV6",
            CSC464: "Distributed Networking",
            CSC465: "Game Technology",
            CSC466: "Distributed and Object Oriented Database",
            CSC467: "Introduction to Cloud Computing",
            CSC468: "Geographical Information System",
            CSC469: "Decision Support System and Expert System",
            CSC470: "Mobile Application Development",
            CSC471: "Real Time Systems",
            CSC472: "Network and System Administration",
            CSC473: "Embedded Systems Programming",
            MGT474: "International Business Management",
          },
        },
      },
    },
  },
} as const;
