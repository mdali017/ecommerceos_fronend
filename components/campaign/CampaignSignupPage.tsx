"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Campaign } from "@/app/redux/features/campaign/campaignSlice";
import { useAppSelector } from "@/app/redux/hooks";
import { campaignProductOptions } from "@/lib/campaign-products";
import { getPublicCampaigns } from "@/lib/campaign-public-storage";
import { CampaignSignupForm } from "./CampaignSignupForm";

function withProductFallback(campaign: Campaign): Campaign {
  if (campaign.product) return campaign;

  return {
    ...campaign,
    product: campaignProductOptions[0] ?? {
      id: "fallback",
      name: "Khaas Food Product",
      price: 0,
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop",
      category: "Grocery",
    },
  };
}

export function CampaignSignupPage({ slug }: { slug: string }) {
  const reduxCampaigns = useAppSelector((state) => state.campaign.campaigns);
  const [publicCampaigns] = useState(() => getPublicCampaigns());

  const campaign = useMemo(() => {
    const merged = [...reduxCampaigns];
    for (const item of publicCampaigns) {
      if (!merged.some((existing) => existing.slug === item.slug)) {
        merged.push(item);
      }
    }
    return merged.find((item) => item.slug === slug) ?? null;
  }, [reduxCampaigns, publicCampaigns, slug]);

  if (!campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-gray/30 px-4">
        <div className="rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Campaign not found</h1>
          <p className="mt-2 text-sm text-gray-500">এই link টি সঠিক নয় বা campaign বন্ধ করা হয়েছে।</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-brand-green hover:text-brand-orange"
          >
            হোমপেজে যান
          </Link>
        </div>
      </div>
    );
  }

  if (campaign.status !== "running") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-gray/30 px-4">
        <div className="rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">{campaign.title}</h1>
          <p className="mt-2 text-sm text-gray-500">এই campaign এখন active নয়।</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-brand-green hover:text-brand-orange"
          >
            হোমপেজে যান
          </Link>
        </div>
      </div>
    );
  }

  return <CampaignSignupForm campaign={withProductFallback(campaign)} />;
}
