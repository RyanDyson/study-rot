import Link from "next/link";
import { notFound } from "next/navigation";
import { getThread } from "@/lib/mock-data";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ThreadTweetCard } from "../../../threads/[threadId]/thread-tweet-card";

interface PageProps {
  params: Promise<{ threadId: string }>;
}

export default async function ThreadPage({ params }: PageProps) {
  const { threadId } = await params;
  const thread = getThread(threadId);

  if (!thread) notFound();

  const sortedTweets = [...thread.tweets].sort((a, b) => a.order - b.order);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-4 p-4">
          <Link
            href="/dashboard"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">
                {thread.title}
              </h1>
              <p className="text-sm text-muted-foreground">{thread.topic}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 pb-20">
        <div className="mx-auto w-full max-w-2xl">
          <div className="divide-y divide-border">
            {sortedTweets.map((tweet, index) => (
              <div key={tweet.id} className="relative">
                <ThreadTweetCard
                  tweet={tweet}
                  showConnector={index < sortedTweets.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-4 p-4">
          <Link
            href="/dashboard/upload"
            className="inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            Upload & generate another thread
          </Link>
        </div>
      </div>
    </div>
  );
}
