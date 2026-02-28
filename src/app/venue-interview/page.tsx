// © Konectr 2026. All rights reserved.
// Hidden venue discovery interview form — not indexed, not linked from nav

import type { Metadata } from "next";
import VenueInterviewForm from "./VenueInterviewForm";

export const metadata: Metadata = {
  title: "Venue Discovery Interview — Konectr",
  robots: { index: false, follow: false },
};

export default function VenueInterviewPage() {
  return <VenueInterviewForm />;
}
