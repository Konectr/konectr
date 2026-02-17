"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { faqCategories, helpfulResources } from "./faq-data";

export function FAQContent() {
  return (
    <main className="bg-background">
      {/* FAQ Sections */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-12 last:mb-0"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h2
                  className="text-2xl md:text-3xl font-bold text-foreground"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {category.title}
                </h2>
              </div>

              {/* FAQ Accordion */}
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${category.title}-${faqIndex}`}
                    className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5 [&[data-state=open]>svg]:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-orange-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Still have questions?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white text-white hover:text-white hover:border-white hover:bg-white/10 bg-transparent font-semibold px-8"
                asChild
              >
                <Link href="mailto:hello@konectr.app">hello@konectr.app</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2
              className="text-2xl md:text-3xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Helpful Resources
            </h2>
            <p className="text-muted-foreground">
              Learn more about Konectr
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpfulResources.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="block bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-[border-color,box-shadow] group"
                >
                  <span className="text-3xl block mb-3">{link.icon}</span>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {link.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
