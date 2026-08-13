import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { communities, posts } from "@/db/schema";
import {
  DEV_AUTH_COOKIE_NAME,
  getSeedUserById,
} from "@/lib/auth-session";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(DEV_AUTH_COOKIE_NAME)?.value;
  const user = getSeedUserById(userId);

  if (!user) {
    redirect("/");
  }

  const authoredPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      communityName: communities.name,
      communitySlug: communities.slug,
    })
    .from(posts)
    .innerJoin(communities, eq(posts.communityId, communities.id))
    .where(eq(posts.authorId, user.id))
    .orderBy(desc(posts.createdAt));

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Your Profile</h1>

      <section className="flex flex-col gap-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <img
          src={user.image}
          alt={`${user.name}'s profile picture`}
          className="h-24 w-24 rounded-full bg-gray-100 object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
          <p className="mt-1 text-gray-600">{user.email}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your Posts
        </h2>

        {authoredPosts.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              You haven&apos;t created any posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {authoredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    {post.communityName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.createdAt.toISOString()}>
                    {post.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <Link
                  href={`/${post.communitySlug}/posts/${post.id}`}
                  className="mt-2 block text-lg font-semibold text-gray-900 hover:text-blue-600"
                >
                  {post.title}
                </Link>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-gray-600">
                  {post.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
