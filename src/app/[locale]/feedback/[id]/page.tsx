import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import FeedbackTicketDetailContent from "./FeedbackTicketDetailContent";

export const metadata: Metadata = {
  title: "Feedback Details | Konectr",
  description: "View feedback details, vote, and see community responses.",
};

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function FeedbackTicketDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <FeedbackTicketDetailContent ticketId={id} />;
}
