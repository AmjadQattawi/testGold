export type CurrentUser = {
  userID: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  userRoleID: number;
  userRoleName: string;
  emailConfirmed: boolean;
};

export function readCurrentUser(response: unknown): CurrentUser | null {
  if (!response || typeof response !== "object") return null;
  const outer = response as Record<string, unknown>;
  const content =
    outer.content && typeof outer.content === "object"
      ? (outer.content as Record<string, unknown>)
      : outer;
  const user = (content.user ?? outer.user ?? content) as Record<
    string,
    unknown
  >;
  if (
    !user ||
    typeof user !== "object" ||
    typeof user.userID !== "number" ||
    typeof user.userName !== "string" ||
    typeof user.userEmail !== "string"
  )
    return null;
  return {
    userID: user.userID,
    userName: user.userName,
    userEmail: user.userEmail,
    userPhone: typeof user.userPhone === "string" ? user.userPhone : "",
    userRoleID: typeof user.userRoleID === "number" ? user.userRoleID : 0,
    userRoleName:
      typeof user.userRoleName === "string" ? user.userRoleName : "",
    emailConfirmed: user.emailConfirmed === true,
  };
}
