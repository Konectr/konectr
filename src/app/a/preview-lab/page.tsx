// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// Redesign preview harness — renders the new RSVP screens with mock data so the
// design can be reviewed without a live share code / DB. Static route /a/preview-lab
// (takes priority over the dynamic [code] route). Not linked; remove before ship.

import PreviewLabClient from './PreviewLabClient';

export const metadata = { title: 'RSVP redesign preview', robots: { index: false } };

export default function PreviewLab() {
  return <PreviewLabClient />;
}
