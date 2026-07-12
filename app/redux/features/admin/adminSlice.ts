import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthTokens } from "@/lib/api/types";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

interface AdminState {
  isAuthenticated: boolean;
  adminId: string | null;
  adminName: string | null;
  adminEmail: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AdminState = {
  isAuthenticated: false,
  adminId: null,
  adminName: null,
  adminEmail: null,
  accessToken: null,
  refreshToken: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminSession: (state, action: PayloadAction<AdminSession>) => {
      state.isAuthenticated = true;
      state.adminId = action.payload.id;
      state.adminName = action.payload.name;
      state.adminEmail = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    updateAdminTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    adminLogout: (state) => {
      state.isAuthenticated = false;
      state.adminId = null;
      state.adminName = null;
      state.adminEmail = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setAdminSession, updateAdminTokens, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
