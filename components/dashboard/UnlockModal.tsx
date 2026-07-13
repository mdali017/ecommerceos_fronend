"use client";

import { useEffect, useState } from "react";
import {
  setLoginMethod,
  setCustomerSession,
} from "@/app/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { activateCheckoutCustomer, loginCustomer } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useLocale } from "@/components/providers/LocaleProvider";
import { showUnlockError, showUnlockSuccess } from "@/lib/swal";

type UnlockMode = "activate" | "login";

export function UnlockModal() {
  const dispatch = useAppDispatch();
  const { dictionary } = useLocale();
  const t = dictionary.dashboard;
  const loginMethod = useAppSelector((state) => state.auth.loginMethod);
  const customer = useAppSelector((state) => state.auth.customer);
  const pendingCheckoutActivation = useAppSelector(
    (state) => state.auth.pendingCheckoutActivation
  );
  const [mode, setMode] = useState<UnlockMode>(
    pendingCheckoutActivation && customer ? "activate" : "login"
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pendingCheckoutActivation && customer) {
      setMode("activate");
    }
  }, [pendingCheckoutActivation, customer]);

  useEffect(() => {
    if (mode !== "login") {
      return;
    }

    if (loginMethod === "phone") {
      setIdentifier(customer?.phone ?? "");
    } else {
      setIdentifier(customer?.email ?? "");
    }
  }, [loginMethod, customer, mode]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer) {
      await showUnlockError(t.orderInfoNotFound);
      return;
    }

    if (!password.trim() || password.trim().length < 4) {
      await showUnlockError(t.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      await showUnlockError(t.passwordNotMatch);
      return;
    }

    setSubmitting(true);

    try {
      const result = await activateCheckoutCustomer({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        password: password.trim(),
      });

      dispatch(
        setCustomerSession({
          customer: {
            id: result.user.id,
            name: result.user.name,
            phone: result.user.phone,
            email: result.user.email,
            address: result.user.address,
          },
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        })
      );

      await showUnlockSuccess();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t.accountCreateFailed;
      await showUnlockError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      await showUnlockError(t.loginCredentialsRequired);
      return;
    }

    setSubmitting(true);

    try {
      const result = await loginCustomer({
        identifier: identifier.trim(),
        password: password.trim(),
        method: loginMethod,
      });

      dispatch(
        setCustomerSession({
          customer: {
            id: result.user.id,
            name: result.user.name,
            phone: result.user.phone,
            email: result.user.email,
            address: result.user.address,
          },
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        })
      );

      await showUnlockSuccess();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t.loginFailed;
      await showUnlockError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream text-2xl">
            🔐
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">{t.unlockTitle}</h2>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "activate" ? t.unlockActivateSubtitle : t.unlockLoginSubtitle}
          </p>
        </div>

        {mode === "activate" && customer ? (
          <form onSubmit={(e) => void handleActivate(e)} className="space-y-4">
            <div className="rounded-xl border border-brand-border bg-brand-gray/40 p-4 text-sm">
              <p className="font-semibold text-gray-900">{customer.name}</p>
              <p className="mt-1 text-gray-600">{customer.phone}</p>
              <p className="text-gray-600">{customer.email}</p>
              <p className="mt-1 text-gray-600">{customer.address}</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                {t.setPassword}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordMinPlaceholder}
                className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                {t.confirmPassword}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.confirmPasswordPlaceholder}
                className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-green py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-green-light disabled:opacity-60"
            >
              {submitting ? t.savingPassword : t.setPassword}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setPassword("");
                setConfirmPassword("");
              }}
              className="w-full text-sm font-medium text-brand-green hover:underline"
            >
              {t.haveAccount}
            </button>
          </form>
        ) : (
          <>
            <div className="mb-5 flex rounded-xl bg-brand-gray p-1">
              <button
                type="button"
                onClick={() => {
                  dispatch(setLoginMethod("phone"));
                  setIdentifier(customer?.phone ?? "");
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  loginMethod === "phone"
                    ? "bg-white text-brand-orange shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                📱 {t.phone}
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(setLoginMethod("email"));
                  setIdentifier(customer?.email ?? "");
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  loginMethod === "email"
                    ? "bg-white text-brand-orange shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                ✉️ {t.email}
              </button>
            </div>

            <form onSubmit={(e) => void handleLogin(e)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  {loginMethod === "phone" ? t.phone : t.email}
                </label>
                <input
                  type={loginMethod === "phone" ? "tel" : "email"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    loginMethod === "phone"
                      ? "01XXXXXXXXX"
                      : "example@email.com"
                  }
                  className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  {t.passwordLabel}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.yourPassword}
                  className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-brand-green py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-green-light disabled:opacity-60"
              >
                {submitting ? t.verifying : t.login}
              </button>

              {pendingCheckoutActivation && customer ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode("activate");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="w-full text-sm font-medium text-brand-green hover:underline"
                >
                  {t.newOrderSetPassword}
                </button>
              ) : null}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
