import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import FeedbackBoardContent from "./FeedbackBoardContent";

export const metadata: Metadata = {
  title: "Feedback Board | Konectr",
  description: "Vote on feature requests and help shape the future of Konectr. Share your ideas and see what the community wants.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FeedbackPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FeedbackBoardContent />;
}
