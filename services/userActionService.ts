import { UserProfileProps } from "@/interfaces/interfaces";
import { supabase } from "./supabase";

export const getProfilesByStatus = async (
  userStatus: "pending" | "rejected" | "approved" | "all" = "pending",
  collegeCode: string,
  limitCount: number = 3,
) => {
  let baseQuery = supabase
    .from("profiles")
    .select("*")
    .contains("colleges", [collegeCode])
    .eq("is_admin", false)
    .order("created_at", { ascending: true });

  if (userStatus === "pending") {
    baseQuery = baseQuery
      .or(`approved_by.is.null,approved_by.not.cs.{${collegeCode}}`)
      .or(`rejected_by.is.null,rejected_by.not.cs.{${collegeCode}}`);
    console.log(baseQuery);
  } else if (userStatus === "approved") {
    baseQuery = baseQuery.contains("approved_by", [collegeCode]);
  } else if (userStatus === "rejected") {
    baseQuery = baseQuery.contains("rejected_by", [collegeCode]);
  }

  const { data, error } = await baseQuery
    .order("created_at", {
      ascending: true,
    })
    .limit(limitCount);

  if (error) {
    console.error("Error while fetching user information: ", error.message);
    return { formattedUsers: [], error: null };
  }

  if (data && Array.isArray(data)) {
    let formattedUsers = data.map((user: UserProfileProps) => ({
      id: user?.id,
      username: user?.username,
      full_name: user?.full_name,
      date_of_birth: user?.date_of_birth,
      colleges: user?.colleges,
      gender: user?.gender,
      address: user?.address,
      phone: user?.phone,
      avatar_url: user?.avatar_url,
      is_admin: user?.is_admin,
      approved_by: user?.approved_by,
      rejected_by: user?.rejected_by,
    }));

    return { formattedUsers, error: null };
  }
  return { formattedUsers: [], error: null };
};

export const userAction = async (
  userData: UserProfileProps,
  collegeCode: string,
  action: "reject" | "approve" | "clear",
) => {
  if (!collegeCode) return;
  try {
    let currentApprovals = userData?.approved_by || [];
    let currentRejections = userData?.rejected_by || [];
    let updatedApprovals: string[] = [];
    let updatedRejections: string[] = [];

    switch (action) {
      case "approve":
        updatedApprovals = [...new Set([...currentApprovals, collegeCode])];
        updatedRejections = currentRejections.filter(
          (code) => code !== collegeCode,
        );
        break;

      case "reject":
        updatedApprovals = currentApprovals.filter(
          (code) => code !== collegeCode,
        );
        updatedRejections = [...new Set([...currentRejections, collegeCode])];
        break;

      case "clear":
        updatedApprovals = currentApprovals.filter(
          (code) => code !== collegeCode,
        );
        updatedRejections = currentRejections.filter(
          (code) => code !== collegeCode,
        );
        break;

      default:
        return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        approved_by: updatedApprovals.length > 0 ? updatedApprovals : null,
        rejected_by: updatedRejections.length > 0 ? updatedRejections : null,
      })
      .eq("id", userData.id);

    if (error) {
      console.error(
        `Error executing [${action}] on user profile: `,
        error.message,
      );
      return;
    }
  } catch (error: any) {
    console.error(
      `Unexpected error while approving user profile: `,
      error.message,
    );
  }
};

// export const onApprove = async (userData: UserProfileProps) => {
//   try {
//     const currentApprovals = userData?.approved_by || [];
//     const updatedApprovals = [...new Set([...currentApprovals, collegeCode])];
//     const currentRejections = userData?.rejected_by || [];
//     const updatedRejections = currentRejections.filter(
//       (code) => code !== currentCollege?.college_code,
//     );

//     const { error } = await supabase
//       .from("profiles")
//       .update({
//         approved_by: updatedApprovals ,
//         rejected_by: updatedRejections.length > 0 ? updatedRejections : null,
//       })
//       .eq("id", userData.id);

//     if (error) {
//       console.error("Error while updating user profile: ", error.message);
//       return;
//     }
//   } catch (error: any) {
//     console.error(
//       "Unexpected error while approving user profile: ",
//       error.message,
//     );
//   }
// };

// export const onReject = async (userData: UserProfileProps) => {
//   try {
//     const { currentCollege } = useCollegeInfo() || "";
//     const currentRejections = userData?.rejected_by || [];
//     const updatedRejections = [
//       ...new Set([...currentRejections, currentCollege?.college_code]),
//     ];
//     const currentApprovals = userData?.approved_by || [];
//     const updatedApprovals = currentApprovals.filter(
//       (code) => code !== currentCollege?.college_code,
//     );
//     const { error } = await supabase
//       .from("profiles")
//       .update({
//         rejected_by: updatedRejections,
//         approved_by: updatedApprovals.length > 0 ? updatedApprovals : null,
//       })
//       .eq("id", userData.id);

//     if (error) {
//       console.error("Error while updating user profile: ", error.message);
//       return;
//     }
//   } catch (error: any) {
//     console.error(
//       "Unexpected error while approving user profile: ",
//       error.message,
//     );
//   }
// };

// export const onClear = async (userData: UserProfileProps) => {
//   try {
//     const { currentCollege } = useCollegeInfo() || "";
//     const currentRejections = userData?.rejected_by || [];
//     const updatedRejections = currentRejections.filter(
//       (code) => code !== currentCollege?.college_code,
//     );
//     const currentApprovals = userData?.approved_by || [];
//     const updatedApprovals = currentApprovals.filter(
//       (code) => code !== currentCollege?.college_code,
//     );
//     const { error } = await supabase
//       .from("profiles")
//       .update({
//         rejected_by: updatedRejections.length > 0 ? updatedRejections : null,
//         approved_by: updatedApprovals.length > 0 ? updatedApprovals : null,
//       })
//       .eq("id", userData.id);

//     if (error) {
//       console.error("Error while updating user profile: ", error.message);
//       return;
//     }
//   } catch (error: any) {
//     console.error(
//       "Unexpected error while approving user profile: ",
//       error.message,
//     );
//   }
// };
