import type { Campaign } from "@/app/redux/features/campaign/campaignSlice";

const CAMPAIGN_PUBLIC_KEY = "ecommerceos_public_campaigns";

export function getPublicCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CAMPAIGN_PUBLIC_KEY);
    return raw ? (JSON.parse(raw) as Campaign[]) : [];
  } catch {
    return [];
  }
}

export function syncPublicCampaigns(campaigns: Campaign[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CAMPAIGN_PUBLIC_KEY, JSON.stringify(campaigns));
}

export function upsertPublicCampaign(campaign: Campaign) {
  const campaigns = getPublicCampaigns();
  const index = campaigns.findIndex(
    (item) => item.id === campaign.id || item.slug === campaign.slug
  );

  if (index >= 0) {
    campaigns[index] = campaign;
  } else {
    campaigns.push(campaign);
  }

  syncPublicCampaigns(campaigns);
}

export function findPublicCampaignBySlug(slug: string) {
  return getPublicCampaigns().find((campaign) => campaign.slug === slug) ?? null;
}
