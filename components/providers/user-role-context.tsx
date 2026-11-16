"use client";

import { createContext } from "react";

export type UserRole = "USER" | "ADMIN" | null;

export const UserRoleContext = createContext<UserRole | undefined>(undefined);

export function UserRoleContextProvider({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  return (
    <UserRoleContext.Provider value={role}>{children}</UserRoleContext.Provider>
  );
}
