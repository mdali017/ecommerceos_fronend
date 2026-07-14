"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setCustomerSession } from "@/app/redux/features/auth/authSlice";
import { addCampaignLead } from "@/app/redux/features/campaign/campaignSlice";
import type { Campaign } from "@/app/redux/features/campaign/campaignSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import { registerCustomer } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { showValidationError } from "@/lib/swal";
import Swal from "sweetalert2";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-US")}`;
}

export function CampaignSignupForm({ campaign }: { campaign: Campaign }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const product = campaign.product;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      await showValidationError("নাম, ইমেইল, ফোন ও ঠিকানা সব দিন।");
      return;
    }

    if (phone.trim().length < 11) {
      await showValidationError("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।");
      return;
    }

    setSubmitting(true);

    const customer = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };

    try {
      const result = await registerCustomer({
        ...customer,
        source: "campaign",
      });

      dispatch(
        addCampaignLead({
          campaignId: campaign.id,
          ...customer,
        })
      );

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

      const passwordHint = phone.trim().slice(-4).padStart(4, "0");

      await Swal.fire({
        icon: "success",
        title: "স্বাগতম!",
        html: `<p style="color:#6b7280;margin-top:8px">আপনার dashboard access চালু হয়েছে।</p><p style="margin-top:12px;font-size:13px;color:#374151">পরবর্তীতে login: <strong>${phone.trim()}</strong> / <strong>${passwordHint}</strong></p>`,
        confirmButtonText: "Dashboard দেখুন",
        confirmButtonColor: "#f58220",
      });

      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      await showValidationError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green to-brand-green-light px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
        >
          🌿 Ecommerce OS
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-brand-border bg-brand-gray/20 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-brand-orange">
                Campaign Offer
              </span>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">{campaign.title}</h1>
              {campaign.description && (
                <p className="mt-2 text-sm text-gray-600">{campaign.description}</p>
              )}

              <div className="mt-6 overflow-hidden rounded-2xl border border-brand-border bg-white">
                <div className="relative aspect-square max-h-[320px] w-full bg-brand-gray">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
                    {product.category}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {product.nameBn ?? product.name}
                  </h2>
                  {product.nameBn && (
                    <p className="mt-0.5 text-sm text-gray-500">{product.name}</p>
                  )}
                  {product.weight && (
                    <p className="mt-2 text-sm text-gray-500">{product.weight}</p>
                  )}
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-brand-orange">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900">আপনার তথ্য দিন</h3>
              <p className="mt-1 text-sm text-gray-500">
                Submit করলে customer dashboard access পাবেন
              </p>

              <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="campaign-name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                    নাম *
                  </label>
                  <input
                    id="campaign-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>

                <div>
                  <label htmlFor="campaign-phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
                    ফোন *
                  </label>
                  <input
                    id="campaign-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>

                <div>
                  <label htmlFor="campaign-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                    ইমেইল *
                  </label>
                  <input
                    id="campaign-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>

                <div>
                  <label htmlFor="campaign-address" className="mb-1.5 block text-sm font-semibold text-gray-700">
                    ঠিকানা *
                  </label>
                  <textarea
                    id="campaign-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-brand-orange py-3.5 text-sm font-bold text-white hover:bg-brand-orange-dark disabled:opacity-60"
                >
                  {submitting ? "প্রক্রিয়াকরণ..." : "ড্যাশবোর্ডে যান"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
