"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getFeedbackTicket,
  getTicketAttachments,
} from "@/lib/feedback-api";
import {
  type FeedbackTicketDetail,
  type FeedbackAttachment,
  categoryMeta,
  statusMeta,
} from "@/types/feedback";

interface Props {
  ticketId: string;
}

export default function FeedbackTicketDetailContent({ ticketId }: Props) {
  const [ticket, setTicket] = useState<FeedbackTicketDetail | null>(null);
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  async function loadTicket() {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeedbackTicket(ticketId);
      if (!data) {
        setError("Feedback ticket not found");
        return;
      }
      setTicket(data);

      // Load attachments
      const attachmentData = await getTicketAttachments(ticketId);
      setAttachments(attachmentData);
    } catch (err) {
      console.error("Failed to load ticket:", err);
      setError("Failed to load feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-5xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {error || "Ticket not found"}
          </h1>
          <p className="text-muted-foreground mb-6">
            The feedback ticket you&apos;re looking for doesn&apos;t exist or
            has been removed.
          </p>
          <Button asChild>
            <Link href="/feedback">Back to Feedback Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  const netVotes = ticket.upvote_count - ticket.downvote_count;
  const categoryInfo = categoryMeta[ticket.category];
  const statusInfo = statusMeta[ticket.status];

  return (
    <main className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/feedback"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to Feedback Board
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {/* Vote Count Column */}
                <div className="flex flex-col items-center justify-start gap-1 py-6 px-5 bg-muted/30 border-r min-w-[90px]">
                  <span
                    className={`font-bold text-3xl ${
                      netVotes > 0
                        ? "text-primary"
                        : netVotes < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {netVotes}
                  </span>
                  <span className="text-sm text-muted-foreground">votes</span>
                  <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground text-center">
                    <div>{ticket.upvote_count} up</div>
                    <div>{ticket.downvote_count} down</div>
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 p-6">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-2xl">{categoryInfo.emoji}</span>
                    <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {ticket.ticket_id}
                    </span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {ticket.title}
                  </h1>

                  {/* Submitter Info */}
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                    {ticket.submitter_photo_url ? (
                      <img
                        src={ticket.submitter_photo_url}
                        alt={ticket.submitter_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {ticket.submitter_name?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        {ticket.submitter_name || "Anonymous"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>

                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-foreground mb-3">
                        Attachments ({attachments.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {attachments.map((attachment) => (
                          <button
                            key={attachment.id}
                            onClick={() =>
                              setSelectedImage(attachment.public_url)
                            }
                            className="relative aspect-video rounded-lg overflow-hidden bg-muted border hover:border-primary transition-colors"
                          >
                            {attachment.file_type.startsWith("image/") ? (
                              <img
                                src={attachment.public_url}
                                alt={attachment.file_name}
                                className="w-full h-full object-cover"
                              />
                            ) : attachment.file_type.startsWith("video/") ? (
                              <div className="flex items-center justify-center h-full">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-10 h-10 text-muted-foreground"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full p-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-8 h-8 text-muted-foreground mb-1"
                                >
                                  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                                </svg>
                                <span className="text-xs text-muted-foreground truncate max-w-full">
                                  {attachment.file_name}
                                </span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Response */}
                  {ticket.admin_response && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-primary font-semibold text-sm">
                          Official Response
                        </span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">
                        {ticket.admin_response}
                      </p>
                    </div>
                  )}

                  {/* Vote CTA */}
                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Want to vote on this feature?
                    </p>
                    <Button asChild variant="outline">
                      <a
                        href="https://apps.apple.com/app/konectr"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Konectr App
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Attachment"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
