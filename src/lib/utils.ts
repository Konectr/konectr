// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// RFC-lite email check, shared by the RSVP claim form and POST /api/rsvp so the
// client gate and the server agree. The claim form has no <form> element, so the
// browser's own type="email" validation never fires — this is the only client gate.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
  const v = value.trim()
  return v.length > 0 && v.length <= 254 && EMAIL_REGEX.test(v)
}
