"use client";

import { useAuth } from "./useAuth";
import { useAuthProfile } from "./useAuthProfile";

const role = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
};

export function useRoleAuth(requiredRoles) {
  const { isLoading: authLoding } = useAuth();
  const { data: profile, isLoading: profileLoading } = useAuthProfile();

  const isAuthorized = profile?.role && requiredRoles.includes(profile.role);
  const isLoading = authLoding || profileLoading;

  return {
    isAuthorized,
    isLoading,
    profile,
  };
}
