"use client";

import { useEffect } from "react";
import { updateCustomerProfile } from "@/app/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useGetMeQuery } from "@/app/redux/services/authApi";

export function CustomerSessionHydrator() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isCustomerLoggedIn = useAppSelector((state) => state.auth.isCustomerLoggedIn);
  const { data: profile } = useGetMeQuery(undefined, {
    skip: !accessToken || !isCustomerLoggedIn,
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    dispatch(
      updateCustomerProfile({
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
      })
    );
  }, [dispatch, profile]);

  return null;
}
