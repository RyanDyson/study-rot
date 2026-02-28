import Link from "next/link";
import { notFound } from "next/navigation";
import { getThread } from "@/lib/mock-data";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ThreadTweetCard } from "./thread-tweet-card";

interface PageProps {
  params: Promise<{ threadId: string }>;
}

export default async function ThreadPage({ params }: PageProps) {
  const { threadId } = await params;
  const thread = getThread(threadId);

  if (!thread) notFound();

  const sortedTweets = [...thread.tweets].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className="inline-flex h-7 w-fit items-center gap-1.5 rounded-full px-2.5 text-[0.8rem] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {thread.title}
            </h1>
            <p className="text-sm text-muted-foreground">{thread.topic}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[36rem]">
        <div className="flex flex-col gap-0 rounded-2xl border border-border bg-card shadow-xl">
          {sortedTweets.map((tweet, index) => (
            <div key={tweet.id}>
              <ThreadTweetCard
                tweet={tweet}
                isFirst={index === 0}
                isLast={index === sortedTweets.length - 1}
                connector={index < sortedTweets.length - 1}
              />
              {index < sortedTweets.length - 1 && (
                <div className="ml-6 h-4 w-px bg-border" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 border-t border-border pt-6">
        <Link
          href="/dashboard/upload"
          className="inline-flex h-7 items-center rounded-full px-2.5 text-[0.8rem] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          Upload & generate another
        </Link>
      </div>
    </div>
  );
}
