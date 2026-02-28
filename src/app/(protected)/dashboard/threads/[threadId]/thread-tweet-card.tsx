"use client";

import type { ThreadTweet } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ThreadTweetCardProps {
  tweet: ThreadTweet;
  isFirst: boolean;
  isLast: boolean;
  connector: boolean;
}

const typeLabels: Record<string, string> = {
  misconception: "Misconception",
  correction: "Correction",
  explanation: "Explanation",
  example: "Example",
  take: "Takeaway",
};

export function ThreadTweetCard({
  tweet,
  isFirst,
  isLast,
  connector,
}: ThreadTweetCardProps) {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 transition hover:bg-muted/50",
        isFirst && "rounded-t-2xl",
        isLast && "rounded-b-2xl",
      )}
    >
      <div className="flex shrink-0 flex-col items-center">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm",
            tweet.avatarColor,
          )}
        >
          {tweet.author.charAt(0)}
        </div>
        {connector && (
          <div className="mt-1 h-full min-h-[1.5rem] w-px bg-border" />
        )}
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">{tweet.author}</span>
          <span className="text-xs text-muted-foreground">{tweet.handle}</span>
          {tweet.type && typeLabels[tweet.type] && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                tweet.type === "misconception" && "bg-destructive/20 text-destructive",
                tweet.type === "correction" && "bg-chart-2/20 text-chart-2",
                tweet.type === "explanation" && "bg-chart-3/20 text-chart-3",
                tweet.type === "take" && "bg-primary/20 text-primary",
                tweet.type === "example" && "bg-chart-4/20 text-chart-4",
              )}
            >
              {typeLabels[tweet.type]}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{tweet.content}</p>
      </div>
    </div>
  );
}
