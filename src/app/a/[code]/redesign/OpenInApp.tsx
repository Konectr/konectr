// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import ExternalIcon from './ExternalIcon';

export default function OpenInApp({ deepLink }: { deepLink: string }) {
  return (
    <div className="mt-3 text-center">
      <a
        href={deepLink}
        className="inline-flex items-center gap-1.5 text-[#FF774D] font-semibold text-xs hover:underline"
      >
        Already have the app? Open in Konectr
        <ExternalIcon />
      </a>
    </div>
  );
}
