"use client";

import { useCallback } from "react";
import {
  adminLogout,
  updateAdminTokens,
} from "@/app/redux/features/admin/adminSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { refreshAuth } from "@/lib/api/auth";
import { isTokenExpired } from "@/lib/api/token-utils";

export function useAdminToken() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const refreshToken = useAppSelector((state) => state.admin.refreshToken);

  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    if (!refreshToken) return null;

    if (!accessToken || isTokenExpired(accessToken)) {
      try {
        const result = await refreshAuth(refreshToken);
        dispatch(updateAdminTokens(result.tokens));
        return result.tokens.accessToken;
      } catch {
        dispatch(adminLogout());
        return null;
      }
    }

    return accessToken;
  }, [accessToken, refreshToken, dispatch]);

  return { accessToken, refreshToken, getValidAccessToken };
}
