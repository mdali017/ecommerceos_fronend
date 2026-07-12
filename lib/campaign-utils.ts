export function slugifyCampaignTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCampaignShareUrl(slug: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/campaign/${slug}`;
  }
  return `/campaign/${slug}`;
}

export const CAMPAIGN_PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  other: "Other",
};

export const CAMPAIGN_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  running: { label: "Running", className: "bg-green-100 text-green-700" },
  paused: { label: "Paused", className: "bg-yellow-100 text-yellow-700" },
  ended: { label: "Ended", className: "bg-gray-100 text-gray-600" },
};
