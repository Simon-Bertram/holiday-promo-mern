"use client";

import { useAuth } from "./useAuth";
import { useAuthProfile } from "./useAuthProfile";

const role = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
};

export function useRoleAuth(requiredRoles) {
  const { isLoading: authLoading, user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useAuthProfile();

  const isAuthorized = Boolean(
    profile?.role && requiredRoles.includes(profile.role)
  );

  const isLoading = authLoading || profileLoading;

  return {
    isAuthorized,
    isLoading,
    profile,
    user,
  };
}
