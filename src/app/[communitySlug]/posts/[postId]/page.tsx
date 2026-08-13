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
    <div>
      <Link
        href={`/${communitySlug}`}
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to community
      </Link>

      <article className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        <div className="mt-2 flex items-center gap-2">
          {post.authorImage && (
            <img
              src={post.authorImage}
              alt={post.authorName ?? "Author"}
              className="h-6 w-6 rounded-full"
            />
          )}
          <span className="text-sm text-gray-500">
            {post.authorName} ·{" "}
            {post.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-gray-700">{post.content}</p>
      </article>

      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
        <CommentList comments={postComments} />
        <NewCommentForm postId={post.id} />
      </div>
    </div>
  );
}
