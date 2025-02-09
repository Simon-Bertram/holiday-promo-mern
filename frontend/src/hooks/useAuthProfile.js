import { skipToken } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "@/slices/usersApiSlice";

export function useAuthProfile() {
  // Retrieve user auth data (including token) from the global Redux state
  const { userInfo } = useSelector((state) => state.auth);
  // Determine if we should fetch the profile by checking for a token
  const profileQueryArg = userInfo?.token ? undefined : skipToken;

  return useGetProfileQuery(profileQueryArg);
}
