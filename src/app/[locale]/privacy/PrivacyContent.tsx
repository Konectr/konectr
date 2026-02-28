// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: [
      'Konectr ("we", "us", "our") operates the Konectr mobile application (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.',
      "By using Konectr, you agree to the collection and use of information in accordance with this policy.",
    ],
  },
  {
    id: "company",
    title: "2. Company Information",
    details: [
      { label: "Company Name", value: "Konectr" },
      {
        label: "Registered Address",
        value:
          "Kuala Lumpur, Federal Territory of Kuala Lumpur 50000, Malaysia",
      },
      { label: "Contact Email", value: "privacy@konectr.app" },
      { label: "Website", value: "https://konectr.app" },
    ],
  },
  {
    id: "data-collection",
    title: "3. Data We Collect",
    dataCategories: [
      {
        category: "Personal Information",
        icon: "👤",
        items: [
          "Phone number (for authentication)",
          "Name (display name for your profile)",
          "Age (to verify you are 18+)",
          "Gender (for profile display)",
          "Profile photo (optional)",
          "Bio, interests, and languages spoken",
        ],
      },
      {
        category: "Location Data",
        icon: "📍",
        items: [
          "Approximate location (within 50km radius, fuzzy only)",
          "City and neighborhood (never exact address)",
          "Venue check-ins (when you create or join activities)",
        ],
      },
      {
        category: "Activity Data",
        icon: "🎯",
        items: [
          "Venues visited (to suggest similar activities)",
          "Activities created (hosting history)",
          "Matches made (to improve matching algorithm)",
          "Messages sent (stored encrypted, auto-deleted after 90 days)",
        ],
      },
      {
        category: "Usage Data",
        icon: "📊",
        items: [
          "App interactions (features used, screens viewed)",
          "Crash logs (to fix bugs and improve stability)",
          "Device information (OS version, app version, device model)",
        ],
      },
    ],
  },
  {
    id: "data-use",
    title: "4. How We Use Your Data",
    useItems: [
      "Match you with other users for in-person activities",
      "Verify your identity and maintain a safe community",
      "Improve our Service through analytics",
      "Comply with legal obligations under PDPA 2010",
      "Send service-related notifications",
      "Prevent fraud and abuse",
    ],
    neverDo: [
      "Send marketing emails without your explicit consent",
      "Sell your data to third parties",
      "Use your data for purposes unrelated to the Service",
    ],
  },
  {
    id: "data-sharing",
    title: "5. Data Sharing",
    subsections: [
      {
        subtitle: "With Other Users",
        content:
          "We share your profile information (name, photo, bio, interests), approximate location, and activity preferences with matched users.",
      },
      {
        subtitle: "We NEVER Share",
        bullets: [
          "Your phone number",
          "Your exact location",
          "Your private messages with others",
          "Your personal contact information",
        ],
      },
      {
        subtitle: "Service Providers",
        content:
          "We work with trusted third-party providers: Supabase (data hosting in Singapore), Firebase Cloud Messaging (push notifications), and Sentry (crash reporting). All providers are bound by strict data protection agreements.",
      },
    ],
  },
  {
    id: "rights",
    title: "6. Your Rights Under PDPA 2010",
    rights: [
      {
        right: "Right to Access",
        detail: "Request a copy of your personal data in JSON format.",
      },
      {
        right: "Right to Correction",
        detail: "Update or correct inaccurate information in your profile.",
      },
      {
        right: "Right to Deletion",
        detail: "Delete your account and all associated data within 30 days.",
      },
      {
        right: "Right to Data Portability",
        detail: "Export your data in a structured, machine-readable format.",
      },
      {
        right: "Right to Withdraw Consent",
        detail: "Stop us from processing your data at any time.",
      },
      {
        right: "Right to Complaint",
        detail:
          "File a complaint with the Personal Data Protection Commissioner.",
      },
    ],
  },
  {
    id: "location",
    title: "7. Location Data Specifics",
    protections: [
      {
        icon: "🚫",
        text: "NEVER tracked in background \u2014 only when the app is active",
      },
      {
        icon: "🔵",
        text: "Stored as approximate area (fuzzy location, not exact coordinates)",
      },
      {
        icon: "🗑️",
        text: "Auto-deleted after 30 days of inactivity",
      },
      {
        icon: "⚙️",
        text: "You can disable location permissions in device settings anytime",
      },
    ],
  },
  {
    id: "children",
    title: "8. Children\u2019s Privacy",
    content: [
      "Konectr is strictly 18+ only. Age verification is required during signup. We do not knowingly collect data from minors under 18. Underage users are immediately blocked and reported if discovered.",
      "If we learn we have collected personal data from anyone under 18, we will delete that information immediately. Parents should contact privacy@konectr.app if they discover their child is using Konectr.",
    ],
  },
  {
    id: "security",
    title: "9. Data Security",
    securityGroups: [
      {
        category: "Technical Safeguards",
        items: [
          "End-to-end encryption for private messages",
          "Encrypted data storage via Singapore data center",
          "Secure HTTPS transmission for all data transfers",
          "Two-factor authentication for admin access",
        ],
      },
      {
        category: "Organizational Safeguards",
        items: [
          "Regular security audits",
          "Limited employee access on need-to-know basis",
          "Security training for all team members",
          "Incident response plan for data breaches",
        ],
      },
    ],
  },
  {
    id: "retention",
    title: "10. Data Retention",
    retentionItems: [
      { data: "Active accounts", period: "Retained while account is open" },
      {
        data: "Deleted accounts",
        period: "Soft delete 30 days, hard delete after, backups removed within 90 days",
      },
      {
        data: "Messages",
        period: "Auto-deleted after 90 days of conversation inactivity",
      },
      {
        data: "Activity history",
        period: "Retained for 6 months, then anonymized",
      },
      {
        data: "Location data",
        period: "Auto-deleted after 30 days of inactivity",
      },
      { data: "Crash logs", period: "Retained for 90 days, then deleted" },
    ],
  },
  {
    id: "international",
    title: "11. International Data Transfers",
    content: [
      "Your data is stored in Singapore (via Supabase Asia region). We comply with PDPA (Personal Data Protection Act 2010, Malaysia) and GDPR (General Data Protection Regulation, European Union).",
      "When transferring data internationally, we ensure adequate safeguards including standard contractual clauses, data processing agreements, and compliance with local data protection laws.",
    ],
  },
  {
    id: "cookies",
    title: "12. Cookies and Tracking",
    content: [
      "We do not use cookies or third-party tracking. We use minimal analytics for crash reporting, feature usage, and performance monitoring. You can opt out of analytics in Settings > Privacy > Analytics.",
      "We do NOT use advertising cookies, track you across other apps or websites, sell data to advertisers, or build advertising profiles.",
    ],
  },
  {
    id: "changes",
    title: "13. Changes to Privacy Policy",
    content: [
      "We may update this policy periodically. You will be notified via in-app notification. Continued use after changes constitutes acceptance. Major changes require explicit re-consent.",
    ],
  },
  {
    id: "contact",
    title: "14. Contact & Complaints",
    details: [
      { label: "Privacy Questions", value: "privacy@konectr.app" },
      { label: "General Support", value: "support@konectr.app" },
      { label: "Legal Matters", value: "legal@konectr.app" },
      { label: "Response Time", value: "Within 48\u201372 hours" },
    ],
    content: [
      "If you are not satisfied with our response, you may escalate to the Personal Data Protection Department, Ministry of Communications and Digital, Level 5, MCMC Tower 1, Jalan Impact, Cyberjaya, 63000 Selangor, Malaysia (pdpa@pdp.gov.my).",
    ],
  },
];

export function PrivacyContent() {
  return (
    <main className="bg-background">
      {/* Last Updated */}
      <section className="pt-12 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-muted-foreground text-sm">
            Last Updated: November 30, 2025 &middot; Effective Date: December
            10, 2025
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <h2
              className="text-lg font-bold text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Contents
            </h2>
            <nav className="grid sm:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02 }}
              className="scroll-mt-24"
            >
              <h2
                className="text-2xl font-bold text-foreground mb-4"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {section.title}
              </h2>

              {/* Content paragraphs */}
              {section.content?.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-muted-foreground leading-relaxed mb-3"
                >
                  {paragraph}
                </p>
              ))}

              {/* Details (key-value pairs) */}
              {section.details && (
                <div className="bg-card rounded-xl p-5 border border-border/50 mt-3">
                  <dl className="space-y-2">
                    {section.details.map((detail, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-foreground min-w-[140px]">
                          {detail.label}:
                        </dt>
                        <dd className="text-sm text-muted-foreground">
                          {detail.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Data categories */}
              {section.dataCategories && (
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {section.dataCategories.map((cat, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-xl p-5 border border-border/50"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <h4 className="text-sm font-bold text-foreground">
                          {cat.category}
                        </h4>
                      </div>
                      <ul className="space-y-1.5">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5 text-xs">
                              •
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Data use items */}
              {section.useItems && (
                <>
                  <div className="mt-3">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      We use your information to:
                    </h3>
                    <ul className="space-y-1.5">
                      {section.useItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-primary">✓</span>
                          <span className="text-muted-foreground text-sm">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {section.neverDo && (
                    <div className="mt-4 bg-green-50 dark:bg-green-950/30 rounded-xl p-5 border border-green-200 dark:border-green-900/50">
                      <h4 className="text-sm font-bold text-green-800 dark:text-green-300 mb-2">
                        We do NOT:
                      </h4>
                      <ul className="space-y-1.5">
                        {section.neverDo.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5 text-xs">
                              ✕
                            </span>
                            <span className="text-green-800 dark:text-green-300 text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Subsections */}
              {section.subsections?.map((sub, i) => (
                <div key={i} className="mt-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {sub.subtitle}
                  </h3>
                  {sub.content && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                      {sub.content}
                    </p>
                  )}
                  {sub.bullets && (
                    <ul className="space-y-1.5">
                      {sub.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="text-red-500 mt-0.5 text-xs">
                            ✕
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Rights */}
              {section.rights && (
                <div className="space-y-3 mt-4">
                  {section.rights.map((right, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-xl p-4 border border-border/50"
                    >
                      <h4 className="text-sm font-bold text-foreground mb-1">
                        {right.right}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {right.detail}
                      </p>
                    </div>
                  ))}
                  <p className="text-muted-foreground text-sm mt-2">
                    To exercise these rights, contact:{" "}
                    <a
                      href="mailto:privacy@konectr.app"
                      className="text-primary hover:underline"
                    >
                      privacy@konectr.app
                    </a>
                  </p>
                </div>
              )}

              {/* Location protections */}
              {section.protections && (
                <div className="space-y-3 mt-4">
                  {section.protections.map((p, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="text-muted-foreground text-sm pt-1">
                        {p.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Security groups */}
              {section.securityGroups && (
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {section.securityGroups.map((group, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-xl p-5 border border-border/50"
                    >
                      <h4 className="text-sm font-bold text-foreground mb-3">
                        {group.category}
                      </h4>
                      <ul className="space-y-1.5">
                        {group.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span className="text-muted-foreground text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Retention table */}
              {section.retentionItems && (
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden mt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-3 font-medium text-foreground">
                          Data Type
                        </th>
                        <th className="text-left p-3 font-medium text-foreground">
                          Retention Period
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.retentionItems.map((item, i) => (
                        <tr
                          key={i}
                          className="border-b border-border/30 last:border-0"
                        >
                          <td className="p-3 text-foreground font-medium">
                            {item.data}
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {item.period}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-foreground dark:bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-white/80 text-lg mb-4">
              This Privacy Policy is governed by the laws of Malaysia. Any
              disputes shall be resolved in the courts of Kuala Lumpur.
            </p>
            <p className="text-white/60 text-sm">
              Questions? Contact us at{" "}
              <a
                href="mailto:privacy@konectr.app"
                className="text-primary hover:underline"
              >
                privacy@konectr.app
              </a>{" "}
              &middot; Also read our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
