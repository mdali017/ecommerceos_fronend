"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createCampaign, type Campaign, type CampaignPlatform } from "@/app/redux/features/campaign/campaignSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { campaignProductOptions, getCampaignProductById } from "@/lib/campaign-products";
import { CAMPAIGN_PLATFORM_LABELS, getCampaignShareUrl, slugifyCampaignTitle } from "@/lib/campaign-utils";
import { upsertPublicCampaign } from "@/lib/campaign-public-storage";
import { showValidationError } from "@/lib/swal";
import Swal from "sweetalert2";

const platforms = Object.keys(CAMPAIGN_PLATFORM_LABELS) as CampaignPlatform[];

export function CreateCampaignForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const campaigns = useAppSelector((state) => state.campaign.campaigns) as Campaign[];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<CampaignPlatform>("facebook");
  const [productId, setProductId] = useState(campaignProductOptions[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);

  const selectedProduct = useMemo(
    () => getCampaignProductById(productId),
    [productId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      await showValidationError("Campaign title দিন।");
      return;
    }

    if (!productId || !selectedProduct) {
      await showValidationError("কোন product-এ campaign চালাবেন তা select করুন।");
      return;
    }

    let slug = slugifyCampaignTitle(title);
    if (!slug) slug = `campaign-${Date.now()}`;

    const existingSlugs = new Set(campaigns.map((item) => item.slug));
    let uniqueSlug = slug;
    let counter = 1;
    while (existingSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter += 1;
    }

    const campaignId = `cmp-${Date.now().toString(36)}`;
    const payload = {
      slug: uniqueSlug,
      title: title.trim(),
      description: description.trim(),
      platform,
      status: "running" as const,
      product: selectedProduct,
    };

    dispatch(createCampaign(payload));

    upsertPublicCampaign({
      id: campaignId,
      ...payload,
      createdAt: new Date().toISOString(),
    });

    setSubmitting(true);
    const shareUrl = getCampaignShareUrl(uniqueSlug);

    await Swal.fire({
      icon: "success",
      title: "Campaign তৈরি হয়েছে",
      html: `<p style="color:#6b7280;margin-top:8px"><strong>${selectedProduct.name}</strong> product-এর জন্য link তৈরি হয়েছে।</p><p style="margin-top:12px;font-size:13px;word-break:break-all;color:#1a4d2e;font-weight:600">${shareUrl}</p>`,
      confirmButtonText: "Campaign List",
      confirmButtonColor: "#f58220",
    });

    router.push("/admin/campaigns");
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Create Campaign</h2>
          <p className="mt-1 text-sm text-gray-500">
            Product select করে social media marketing link তৈরি করুন
          </p>
        </div>
        <Link
          href="/admin/campaigns"
          className="text-sm font-semibold text-brand-green hover:text-brand-orange"
        >
          ← Back
        </Link>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-5 rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="campaign-product" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Select Product *
          </label>
          <select
            id="campaign-product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          >
            {campaignProductOptions.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — ৳{product.price.toLocaleString("en-US")} ({product.category})
              </option>
            ))}
          </select>
          {selectedProduct && (
            <p className="mt-2 text-xs text-gray-500">
              Landing page-এ বাম পাশে {selectedProduct.name} এর image ও details দেখাবে
            </p>
          )}
        </div>

        <div>
          <label htmlFor="campaign-title" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Campaign Title *
          </label>
          <input
            id="campaign-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summer Grocery Sale"
            className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
        </div>

        <div>
          <label
            htmlFor="campaign-description"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            Description
          </label>
          <textarea
            id="campaign-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Facebook / Instagram promo details..."
            className="w-full resize-none rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
        </div>

        <div>
          <label htmlFor="campaign-platform" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Platform
          </label>
          <select
            id="campaign-platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as CampaignPlatform)}
            className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          >
            {platforms.map((item) => (
              <option key={item} value={item}>
                {CAMPAIGN_PLATFORM_LABELS[item]}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl bg-brand-gray/40 px-4 py-3 text-sm text-gray-600">
          Generated link-এ বামে product details, ডানে name, phone, email, address form থাকবে।
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-orange py-3 text-sm font-bold text-white hover:bg-brand-orange-dark disabled:opacity-60"
        >
          {submitting ? "তৈরি হচ্ছে..." : "Generate Campaign Link"}
        </button>
      </form>
    </div>
  );
}
