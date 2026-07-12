import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getCampaignProductById } from "@/lib/campaign-products";

export type CampaignPlatform = "facebook" | "instagram" | "tiktok" | "youtube" | "other";
export type CampaignStatus = "running" | "paused" | "ended";

export interface CampaignProductSnapshot {
  id: string;
  name: string;
  nameBn?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  weight?: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  product: CampaignProductSnapshot;
  createdAt: string;
}

export interface CampaignLead {
  id: string;
  campaignId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredAt: string;
}

interface CampaignState {
  campaigns: Campaign[];
  leads: CampaignLead[];
}

const defaultSeedProduct: CampaignProductSnapshot = {
  id: "p1",
  name: "Gawa Ghee 1kg",
  nameBn: "গাওয়া ঘি ১ কেজি",
  price: 1930,
  image:
    "https://images.unsplash.com/photo-1631452180519-014549103de4?w=600&h=600&fit=crop",
  category: "Ghee",
  weight: "১ কেজি",
};

const initialState: CampaignState = {
  campaigns: [
    {
      id: "cmp-1",
      slug: "summer-grocery-sale",
      title: "Summer Grocery Sale",
      description: "Facebook promo for seasonal grocery offers.",
      platform: "facebook",
      status: "running",
      product: getCampaignProductById("p1") ?? defaultSeedProduct,
      createdAt: "2026-07-01T10:00:00.000Z",
    },
  ],
  leads: [],
};

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    createCampaign: (
      state,
      action: PayloadAction<Omit<Campaign, "id" | "createdAt">>
    ) => {
      state.campaigns.unshift({
        ...action.payload,
        id: createId("cmp"),
        createdAt: new Date().toISOString(),
      });
    },
    updateCampaignStatus: (
      state,
      action: PayloadAction<{ id: string; status: CampaignStatus }>
    ) => {
      const campaign = state.campaigns.find((item) => item.id === action.payload.id);
      if (campaign) campaign.status = action.payload.status;
    },
    addCampaignLead: (
      state,
      action: PayloadAction<Omit<CampaignLead, "id" | "registeredAt">>
    ) => {
      state.leads.unshift({
        ...action.payload,
        id: createId("lead"),
        registeredAt: new Date().toISOString(),
      });
    },
  },
});

export const { createCampaign, updateCampaignStatus, addCampaignLead } = campaignSlice.actions;
export default campaignSlice.reducer;
