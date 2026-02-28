"use client";

import { useState } from "react";
import type { ThreadTweet } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
} from "lucide-react";

interface ThreadTweetCardProps {
  tweet: ThreadTweet;
  depth?: number;
  isLast?: boolean;
  showConnector?: boolean;
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
  depth = 0,
  isLast = false,
  showConnector = false,
}: ThreadTweetCardProps) {
  const [showReplies, setShowReplies] = useState(depth === 0);
  const [liked, setLiked] = useState(false);
  const hasReplies = tweet.replies && tweet.replies.length > 0;

  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-xs shrink-0",
            tweet.avatarColor,
          )}
        >
          {tweet.author.charAt(0)}
        </div>
        {(showConnector || (hasReplies && showReplies)) && (
          <div className="mt-1 w-0.5 flex-1 bg-border/60" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">
              {tweet.author}
            </span>
            {tweet.type && typeLabels[tweet.type] && (
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider",
                  tweet.type === "misconception" &&
                    "bg-destructive/10 text-destructive-foreground",
                  tweet.type === "correction" &&
                    "bg-info/10 text-info-foreground",
                  tweet.type === "explanation" &&
                    "bg-success/10 text-success-foreground",
                  tweet.type === "take" && "bg-chart-1/10 text-chart-1",
                  tweet.type === "example" &&
                    "bg-warning/10 text-warning-foreground",
                )}
              >
                {typeLabels[tweet.type]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{tweet.timestamp}</span>
            <button className="hover:bg-muted rounded-full p-1 transition">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-1 text-sm leading-relaxed text-foreground">
          {tweet.content}
        </p>

        <div className="mt-3 flex items-center gap-4">
          <button
            onClick={() => setLiked(!liked)}
            className="group flex items-center gap-1.5 transition hover:text-destructive"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition",
                liked
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground group-hover:text-destructive",
              )}
            />
            {tweet.likes > 0 && (
              <span
                className={cn(
                  "text-xs",
                  liked ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {tweet.likes + (liked ? 1 : 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => hasReplies && setShowReplies(!showReplies)}
            className="group flex items-center gap-1.5 transition hover:text-info"
          >
            <MessageCircle className="h-5 w-5 text-muted-foreground transition group-hover:text-info" />
            {tweet.replyCount && tweet.replyCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {tweet.replyCount}
              </span>
            )}
          </button>

          <button className="group flex items-center gap-1.5 transition hover:text-success">
            <Repeat2 className="h-5 w-5 text-muted-foreground transition group-hover:text-success" />
          </button>

          <button className="group flex items-center gap-1.5 transition hover:text-primary">
            <Send className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
          </button>
        </div>

        {hasReplies && tweet.replyCount && tweet.replyCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="cursor-pointer mt-2 text-xs text-muted-foreground hover:text-foreground transition"
          >
            {showReplies ? "Hide" : "View"} {tweet.replyCount}{" "}
            {tweet.replyCount === 1 ? "reply" : "replies"}
          </button>
        )}

        {hasReplies && showReplies && (
          <div className="mt-3 space-y-0 border-l-0">
            {tweet.replies?.map((reply, index) => (
              <ThreadTweetCard
                key={reply.id}
                tweet={reply}
                depth={depth + 1}
                isLast={index === tweet.replies!.length - 1}
                showConnector={!isLast || index < tweet.replies!.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
