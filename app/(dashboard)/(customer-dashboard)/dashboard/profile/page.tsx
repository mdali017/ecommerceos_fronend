"use client";

import { useEffect, useState } from "react";
import { updateCustomerProfile } from "@/app/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from "@/app/redux/services/authApi";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ApiError } from "@/lib/api/client";
import { showUnlockError, showUnlockSuccess } from "@/lib/swal";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { dictionary } = useLocale();
  const t = dictionary.dashboard;
  const customer = useAppSelector((state) => state.auth.customer);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: savingPassword }] = useUpdatePasswordMutation();

  useEffect(() => {
    if (!customer) {
      return;
    }

    setName(customer.name);
    setPhone(customer.phone);
    setEmail(customer.email);
    setAddress(customer.address);
  }, [customer]);

  if (!customer) {
    return (
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center shadow-sm">
        <p className="text-muted">{t.profileNotFound}</p>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      await showUnlockError(t.loginToUpdateProfile);
      return;
    }

    try {
      const updated = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
      }).unwrap();

      dispatch(
        updateCustomerProfile({
          id: updated.id,
          name: updated.name,
          phone: updated.phone,
          email: updated.email,
          address: updated.address,
        })
      );

      await showUnlockSuccess(t.profileUpdated);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t.profileUpdateFailed;
      await showUnlockError(message);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      await showUnlockError(t.loginToChangePassword);
      return;
    }

    if (newPassword.length < 4) {
      await showUnlockError(t.passwordMinLength);
      return;
    }

    if (newPassword !== confirmPassword) {
      await showUnlockError(t.passwordMismatch);
      return;
    }

    try {
      await updatePassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      }).unwrap();

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await showUnlockSuccess(t.passwordUpdated);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t.passwordUpdateFailed;
      await showUnlockError(message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">{t.profileTitle}</h2>

      <div className="rounded-2xl border border-brand-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-brand-border pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-2xl font-bold text-white">
            {customer.name.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{customer.name}</p>
            <p className="text-sm text-muted">{t.customerLabel}</p>
          </div>
        </div>

        <form onSubmit={(e) => void handleProfileSave(e)} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">{t.name}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">{t.phone}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">{t.address}</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-brand-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile || !accessToken}
            className="rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-light disabled:opacity-60"
          >
            {savingProfile ? t.saving : t.saveProfile}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-brand-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground">{t.changePassword}</h3>
        <form onSubmit={(e) => void handlePasswordSave(e)} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">{t.currentPassword}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">{t.newPassword}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">{t.confirmNewPassword}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <button
            type="submit"
            disabled={savingPassword || !accessToken}
            className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
          >
            {savingPassword ? t.updating : t.updatePassword}
          </button>
        </form>
      </div>
    </div>
  );
}
