"use client";

import { useContext } from "react";
import { UserRoleContext } from "@/components/providers/user-role-context";

export function useUserRole() {
  const role = useContext(UserRoleContext);

  if (role === undefined) {
    throw new Error("useUserRole must be used within UserRoleProvider");
  }

  return {
    role,
    isAdmin: role === "ADMIN",
    isAuthenticated: role !== null,
  };
}
