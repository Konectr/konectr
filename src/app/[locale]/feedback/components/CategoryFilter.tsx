"use client";

import { Button } from "@/components/ui/button";
import { categoryMeta, type FeedbackCategory } from "@/types/feedback";

interface Props {
  selected: FeedbackCategory | null;
  onChange: (category: FeedbackCategory | null) => void;
}

const categories: (FeedbackCategory | null)[] = [
  null,
  "feature_request",
  "bug_report",
  "general_feedback",
];

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isSelected = cat === selected;
        const meta = cat ? categoryMeta[cat] : null;

        return (
          <Button
            key={cat || "all"}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(cat)}
            className={`rounded-full ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {meta ? (
              <>
                <span className="mr-1.5">{meta.emoji}</span>
                {meta.label}
              </>
            ) : (
              "All"
            )}
          </Button>
        );
      })}
    </div>
  );
}
