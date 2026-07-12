"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Campaign, CampaignLead } from "@/app/redux/features/campaign/campaignSlice";
import { useAppSelector } from "@/app/redux/hooks";
import {
  CAMPAIGN_PLATFORM_LABELS,
  CAMPAIGN_STATUS_LABELS,
  getCampaignShareUrl,
} from "@/lib/campaign-utils";
import { syncPublicCampaigns } from "@/lib/campaign-public-storage";
import Swal from "sweetalert2";

export function AdminCampaignList() {
  const campaigns = useAppSelector((state) => state.campaign.campaigns) as Campaign[];
  const leads = useAppSelector((state) => state.campaign.leads) as CampaignLead[];
  const [showRunningOnly, setShowRunningOnly] = useState(false);

  useEffect(() => {
    syncPublicCampaigns(campaigns);
  }, [campaigns]);

  const visibleCampaigns = useMemo<Campaign[]>(
    () =>
      showRunningOnly
        ? campaigns.filter((campaign) => campaign.status === "running")
        : campaigns,
    [campaigns, showRunningOnly]
  );

  const copyLink = async (slug: string) => {
    const url = getCampaignShareUrl(slug);
    try {
      await navigator.clipboard.writeText(url);
      await Swal.fire({
        icon: "success",
        title: "Link copied",
        text: url,
        confirmButtonColor: "#f58220",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        icon: "info",
        title: "Campaign Link",
        text: url,
        confirmButtonColor: "#f58220",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Campaign List</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowRunningOnly((prev) => !prev)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              showRunningOnly
                ? "bg-brand-green text-white"
                : "border border-brand-green bg-white text-brand-green hover:bg-brand-green hover:text-white"
            }`}
          >
            Running Campaign
          </button>
          <Link
            href="/admin/campaigns/create"
            className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            + Create Campaign
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Platform</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Leads</th>
                <th className="px-6 py-3">Share Link</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    কোনো campaign নেই। Create Campaign থেকে নতুন তৈরি করুন।
                  </td>
                </tr>
              ) : (
                visibleCampaigns.map((campaign) => {
                  const status = CAMPAIGN_STATUS_LABELS[campaign.status];
                  const leadCount = leads.filter((lead) => lead.campaignId === campaign.id).length;

                  return (
                    <tr
                      key={campaign.id}
                      className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{campaign.title}</p>
                        <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500">
                          {campaign.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {campaign.product?.name ?? "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {campaign.product?.category ?? ""}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {CAMPAIGN_PLATFORM_LABELS[campaign.platform]}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">{leadCount}</td>
                      <td className="px-6 py-4">
                        <code className="rounded bg-brand-gray px-2 py-1 text-xs text-gray-600">
                          /campaign/{campaign.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => void copyLink(campaign.slug)}
                          className="text-sm font-semibold text-brand-green hover:text-brand-orange"
                        >
                          Copy Link
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
