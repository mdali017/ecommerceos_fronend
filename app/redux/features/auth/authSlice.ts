import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CustomerInfo {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface LastOrder {
  orderId: string;
  total: number;
  itemCount: number;
  date: string;
}

export interface CustomerSession {
  customer: CustomerInfo;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  isCustomerLoggedIn: boolean;
  isDashboardUnlocked: boolean;
  pendingCheckoutActivation: boolean;
  loginMethod: "phone" | "email";
  customer: CustomerInfo | null;
  lastOrder: LastOrder | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isCustomerLoggedIn: false,
  isDashboardUnlocked: false,
  pendingCheckoutActivation: false,
  loginMethod: "phone",
  customer: null,
  lastOrder: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginMethod: (state, action: PayloadAction<"phone" | "email">) => {
      state.loginMethod = action.payload;
    },
    completeOrder: (
      state,
      action: PayloadAction<{ customer: CustomerInfo; order: LastOrder }>
    ) => {
      state.customer = action.payload.customer;
      state.lastOrder = action.payload.order;
      state.pendingCheckoutActivation = true;
      state.isDashboardUnlocked = false;
    },
    unlockDashboard: (state) => {
      state.isDashboardUnlocked = true;
    },
    setCustomerSession: (state, action: PayloadAction<CustomerSession>) => {
      state.isCustomerLoggedIn = true;
      state.isDashboardUnlocked = true;
      state.pendingCheckoutActivation = false;
      state.customer = action.payload.customer;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    customerLogout: (state) => {
      state.isCustomerLoggedIn = false;
      state.isDashboardUnlocked = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
    logoutDashboard: (state) => {
      state.isDashboardUnlocked = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const {
  setLoginMethod,
  completeOrder,
  unlockDashboard,
  setCustomerSession,
  customerLogout,
  logoutDashboard,
} = authSlice.actions;

export default authSlice.reducer;
