import { CampaignSignupPage } from "@/components/campaign/CampaignSignupPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CampaignPage({ params }: PageProps) {
  const { slug } = await params;
  return <CampaignSignupPage slug={slug} />;
}
