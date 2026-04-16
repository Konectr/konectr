// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SmartDownloadLink from "@/components/SmartDownloadLink";

const LOGO_ICON_ORANGE = "/logos/konectr-icon-orange.svg";

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;

  return {
    title: "You've Been Invited to Konectr!",
    description: `Join Konectr with referral code ${code}. Meet real people for real activities in Kuala Lumpur. Download the app and start connecting.`,
    openGraph: {
      title: "You've Been Invited to Konectr!",
      description:
        "Your friend invited you to Konectr — the app for meeting real people through real activities in KL.",
      type: "website",
    },
  };
}

export default async function ReferralPage({ params }: Props) {
  const { code } = await params;
  const deepLink = `konectr://referral/${code}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header - Solid Sunset Orange */}
        <div className="bg-[#FF774D] py-8 px-4 text-center">
          <Link href="/">
            <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Image
                src={LOGO_ICON_ORANGE}
                alt="Konectr"
                width={40}
                height={40}
                unoptimized
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">
            You&apos;re Invited!
          </h1>
          <p className="text-white/90 text-sm">
            A friend wants you to join Konectr
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Value Props */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-lg">🤝</span>
              <div>
                <h3 className="text-sm font-bold text-[#1F1F1F]">
                  Meet Real People
                </h3>
                <p className="text-[#666] text-xs">
                  Connect with like-minded people for real activities
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📍</span>
              <div>
                <h3 className="text-sm font-bold text-[#1F1F1F]">
                  Public Venues Only
                </h3>
                <p className="text-[#666] text-xs">
                  All meetups happen at cafes, gyms, and public spaces
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">⚡</span>
              <div>
                <h3 className="text-sm font-bold text-[#1F1F1F]">
                  Spontaneous & Fun
                </h3>
                <p className="text-[#666] text-xs">
                  Pick your vibe, find who&apos;s free, meet at the spot
                </p>
              </div>
            </div>
          </div>

          {/* Referral Code Display */}
          <div className="bg-[#FFF5F2] rounded-xl p-4 mb-5 text-center">
            <p className="text-[#999] text-xs mb-1">Your referral code</p>
            <p className="text-[#FF774D] text-lg font-bold tracking-wider">
              {code}
            </p>
          </div>

          {/* Download CTA */}
          <SmartDownloadLink
            code={code}
            kind="referral"
            className="flex items-center justify-center gap-2 w-full bg-[#1F1F1F] text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on App Store
          </SmartDownloadLink>

          {/* Open in App */}
          <div className="mt-4 text-center">
            <p className="text-[#999] text-xs mb-1">Already have the app?</p>
            <a
              href={deepLink}
              className="inline-flex items-center gap-1.5 text-[#FF774D] font-medium text-sm hover:underline"
            >
              Open in Konectr
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-[#999] text-xs">
        <Link href="/" className="hover:text-[#FF774D]">
          konectr.app
        </Link>{" "}
        &middot; The Offline First App
      </p>
    </div>
  );
}
