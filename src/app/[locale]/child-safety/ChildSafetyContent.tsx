// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// EVERY CLAIM ON THIS PAGE MUST MATCH WHAT KONECTR ACTUALLY DOES.
//
// Two claims are deliberately narrow and must not be "improved" into something
// stronger:
//
//  1. Moderation is REPORT-DRIVEN. There is no profanity filter, no content
//     classifier and no hash-matching anywhere in the app or the database —
//     the only triggers on public.messages are read-marking and push. The same
//     answer was given to Play in the content-rating questionnaire ("Chat
//     moderation: No"), so softening it here would contradict a filing.
//  2. We do NOT claim NCMEC reporting. NCMEC's reporting regime binds US-based
//     providers; Konectr is Malaysian. Add it only if Konectr actually registers.
//
// Age enforcement referenced below is real: step_2_age.dart:117 and
// validators.dart:196 block under-18 signups, and the Play target-audience
// declaration is "18 and over only".

"use client";

import { motion } from "framer-motion";

const prohibited = [
  "Any sexualised content involving a minor, including drawn, animated or AI-generated material",
  "Grooming, or any attempt to contact or meet a minor for sexual purposes",
  "Sextortion, or sharing or threatening to share someone's intimate images",
  "Child trafficking, or helping anyone else carry it out",
  "Using Konectr to arrange or advertise any of the above somewhere else",
];

const response = [
  {
    what: "We prioritise it",
    detail:
      "Reports of child sexual abuse and exploitation go to the top of the queue, ahead of every other report type, and are reviewed by a person.",
  },
  {
    what: "We remove and ban",
    detail:
      "Confirmed accounts are permanently banned and their content is removed. This is not a warning or a strike — it is immediate and final.",
  },
  {
    what: "We preserve evidence",
    detail:
      "We retain the relevant account data and content where the law requires it, so that authorities can act on it.",
  },
  {
    what: "We report it",
    detail:
      "We report apparent child sexual abuse and exploitation to the relevant regional and national authorities, including the Royal Malaysia Police.",
  },
];

export function ChildSafetyContent() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-12"
      >
        <p className="text-sm text-muted-foreground">
          Last updated 17 August 2026
        </p>

        <section>
          <p className="text-lg">
            Konectr is an app for adults to meet other adults around real-world
            activities — coffee, a run, a badminton court, a hike. We have zero
            tolerance for child sexual abuse and exploitation (CSAE), including
            child sexual abuse material (CSAM), grooming, sextortion and
            trafficking. This page sets out our standards, how to report a
            concern, and what we do about it.
          </p>
        </section>

        {/* Age */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">Konectr is 18+</h2>
          <p className="text-muted-foreground">
            Konectr is available only to adults. We collect date of birth during
            signup and block anyone under 18 from creating an account. If we find
            that an account belongs to someone under 18, we remove it. Konectr is
            declared as an 18-and-over app on the Google Play Store and the Apple
            App Store.
          </p>
        </section>

        {/* Prohibited */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">What is prohibited</h2>
          <p className="mb-5 text-muted-foreground">
            The following results in immediate, permanent removal from Konectr:
          </p>
          <ul className="space-y-3">
            {prohibited.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Reporting */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">How to report</h2>
          <p className="mb-4 text-muted-foreground">
            Anyone can report a child safety concern to us, whether or not they
            use Konectr.
          </p>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="mb-2 font-semibold">In the app</p>
              <p className="text-muted-foreground">
                Open any profile and use{" "}
                <span className="font-medium">Report</span>, or press and hold a
                message and choose{" "}
                <span className="font-medium">Flag Message</span> — in one-to-one
                and group chats alike. Reports come straight to us. You can also
                block the person, which takes effect immediately.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="mb-2 font-semibold">By email</p>
              <p className="text-muted-foreground">
                Email{" "}
                <a
                  href="mailto:hello@konectr.app?subject=Child%20safety"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  hello@konectr.app
                </a>{" "}
                with <span className="font-medium">Child safety</span> in the
                subject line. You do not need a Konectr account to email us.
              </p>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">
            If a child is in immediate danger, contact your local emergency
            services first. In Malaysia, call 999.
          </p>
        </section>

        {/* Response */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">What happens next</h2>
          <div className="space-y-4">
            {response.map((item) => (
              <div
                key={item.what}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="font-semibold">{item.what}</p>
                <p className="text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-muted-foreground">
            We want to be straightforward about how this works: our moderation is
            report-driven. We do not scan or read private messages, and we do not
            run automated content detection. That means reports from people using
            Konectr are how we find out, which is why we act on them quickly and
            why reporting is available on every profile and every message.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">Compliance contact</h2>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-muted-foreground">
              For questions about these standards or our child safety practices,
              contact{" "}
              <a
                href="mailto:hello@konectr.app?subject=Child%20safety%20standards"
                className="font-semibold text-primary underline underline-offset-4"
              >
                hello@konectr.app
              </a>
              .
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
