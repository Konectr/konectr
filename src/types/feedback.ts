/** Feedback category types */
export type FeedbackCategory = 'feature_request' | 'bug_report' | 'general_feedback';

/** Feedback status types */
export type FeedbackStatus = 'open' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined';

/** Vote type */
export type VoteType = 'upvote' | 'downvote' | null;

/** Feedback ticket from database */
export interface FeedbackTicket {
  id: string;
  ticket_id: string; // KON-001 format
  category: FeedbackCategory;
  title: string;
  description: string;
  status: FeedbackStatus;
  upvote_count: number;
  downvote_count: number;
  submitter_name: string;
  submitter_photo_url: string | null;
  attachment_count: number;
  created_at: string;
  admin_response: string | null;
}

/** Feedback ticket with full details */
export interface FeedbackTicketDetail extends FeedbackTicket {
  submitter_id: string;
  responded_at: string | null;
}

/** Feedback attachment */
export interface FeedbackAttachment {
  id: string;
  ticket_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  public_url: string;
  created_at: string;
}

/** Category metadata for display */
export const categoryMeta: Record<FeedbackCategory, { label: string; emoji: string; description: string }> = {
  feature_request: {
    label: 'Feature Request',
    emoji: '\u{1F4A1}', // lightbulb
    description: 'Suggest new features or improvements',
  },
  bug_report: {
    label: 'Bug Report',
    emoji: '\u{1F41B}', // bug
    description: 'Report issues or problems',
  },
  general_feedback: {
    label: 'General Feedback',
    emoji: '\u{1F4AC}', // speech bubble
    description: 'Share your thoughts',
  },
};

/** Status metadata for display */
export const statusMeta: Record<FeedbackStatus, { label: string; color: string; bgColor: string }> = {
  open: {
    label: 'Open',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  planned: {
    label: 'Planned',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  declined: {
    label: 'Declined',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
};
