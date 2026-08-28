// © Konectr 2026. All rights reserved.
// The single gating decision for /thanks conversion pixels: fire only when the
// page was reached with a Tally response id AND /api/thanks-verify confirmed
// it (HTTP 200). No rid, or any non-200 verify outcome → fire nothing.

export function mayFireConversion(
  rid: string | null | undefined,
  verifyStatus: number | null
): boolean {
  return typeof rid === 'string' && rid.length > 0 && verifyStatus === 200;
}
