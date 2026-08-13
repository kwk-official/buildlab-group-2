import { db } from "@/db";
import { posts, users, communities, comments } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { PostPageProps } from "@/types";
import CommentList from "@/components/CommentList";
import NewCommentForm from "@/components/NewCommentForm";

// ============================================================
// POST DETAIL PAGE
// ============================================================
// This page displays a single post and its comments.
//
// YOUR TICKETS WILL ADD:
// - Ticket #7 (Person A): Display comments and add a comment form
// ============================================================

export default async function PostDetailPage({ params }: PostPageProps) {
  const { communitySlug, postId } = await params;

  // First, verify the community exists
  const community = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, communitySlug))
    .then((rows) => rows[0]);

  if (!community) {
    notFound();
  }

  // Then fetch the post, ensuring it belongs to this community
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(and(eq(posts.id, postId), eq(posts.communityId, community.id)))
    .then((rows) => rows[0]);

  if (!post) {
    notFound();
  }

  const postComments = await db
    .select({
      id: comments.id,
      text: comments.text,
      createdAt: comments.createdAt,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.postId, postId))
    .orderBy(asc(comments.createdAt));

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/${communitySlug}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-kwk-purple transition hover:-translate-x-1 hover:text-kwk-space"
      >
        ← Back to community
      </Link>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-kwk-purple">
          {community.name}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          {post.title}
        </h1>
        <div className="mt-5 flex items-center gap-3 border-b border-slate-100 pb-5">
          {post.authorImage && (
            <img
              src={post.authorImage}
              alt={post.authorName ?? "Author"}
              className="h-10 w-10 rounded-full bg-slate-100 ring-2 ring-white"
            />
          )}
          <span className="text-sm text-slate-500">
            <strong className="block font-bold text-slate-800">
              {post.authorName}
            </strong>
            {post.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700">
          {post.content}
        </p>
      </article>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Conversation</h2>
        <CommentList comments={postComments} />
        <NewCommentForm postId={post.id} />
      </div>
    </div>
  );
}
