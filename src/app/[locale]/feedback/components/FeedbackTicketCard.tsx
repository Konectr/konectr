"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  type FeedbackTicket,
  categoryMeta,
  statusMeta,
} from "@/types/feedback";

interface Props {
  ticket: FeedbackTicket;
}

export default function FeedbackTicketCard({ ticket }: Props) {
  const netVotes = ticket.upvote_count - ticket.downvote_count;
  const categoryInfo = categoryMeta[ticket.category];
  const statusInfo = statusMeta[ticket.status];

  return (
    <Card className="hover:border-primary/30 transition-colors overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {/* Vote Count Column */}
          <div className="flex flex-col items-center justify-center gap-1 py-4 px-4 bg-muted/30 border-r min-w-[70px]">
            <span
              className={`font-bold text-2xl ${
                netVotes > 0
                  ? "text-primary"
                  : netVotes < 0
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {netVotes}
            </span>
            <span className="text-xs text-muted-foreground">votes</span>
          </div>

          {/* Content Column */}
          <div className="flex-1 p-4">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-lg">{categoryInfo.emoji}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {ticket.ticket_id}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
            </div>

            {/* Title */}
            <Link href={`/feedback/${ticket.id}`}>
              <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors mb-2 line-clamp-1">
                {ticket.title}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {ticket.description}
            </p>

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {ticket.submitter_photo_url ? (
                <img
                  src={ticket.submitter_photo_url}
                  alt={ticket.submitter_name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-[10px]">
                    {ticket.submitter_name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
              <span>{ticket.submitter_name || "Anonymous"}</span>
              <span className="text-muted-foreground/50">•</span>
              <span>
                {new Date(ticket.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {ticket.attachment_count > 0 && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {ticket.attachment_count}
                  </span>
                </>
              )}
              {ticket.admin_response && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="text-primary font-medium">
                    Admin responded
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
