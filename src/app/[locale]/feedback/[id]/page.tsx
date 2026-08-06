// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import FeedbackTicketDetailContent from "./FeedbackTicketDetailContent";
import { buildPageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  return buildPageMetadata({
    locale,
    path: `/feedback/${id}`,
    title: "Feedback Details | Konectr",
    description: "View feedback details, vote, and see community responses.",
  });
}

export default async function FeedbackTicketDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <FeedbackTicketDetailContent ticketId={id} />;
}
