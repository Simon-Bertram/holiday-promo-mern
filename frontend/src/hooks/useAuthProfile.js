import { skipToken } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "@/slices/usersApiSlice";

export function useAuthProfile() {
  // Retrieve user auth data from the global Redux state
  const { userInfo } = useSelector((state) => state.auth);
  // Use userInfo (if available) to initiate the query
  const profileQueryArg = userInfo ? undefined : skipToken;

  return useGetProfileQuery(profileQueryArg);
}
