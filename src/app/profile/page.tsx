import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { communities, posts } from "@/db/schema";
import { DEV_AUTH_COOKIE_NAME, getSeedUserById } from "@/lib/auth-session";

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
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border-4 border-kwk-black bg-kwk-purple p-6 text-white shadow-[8px_8px_0_#e8ff3e] sm:p-8">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-kwk-pink/40 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <img
            src={user.image}
            alt={`${user.name}'s profile picture`}
            className="h-24 w-24 rounded-2xl bg-white object-cover ring-4 ring-white/20 sm:h-28 sm:w-28"
          />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-kwk-yellow">
              Your profile
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
              {user.name}
            </h1>
            <p className="mt-2 text-slate-300">{user.email}</p>
            <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-slate-200">
              {authoredPosts.length}{" "}
              {authoredPosts.length === 1 ? "post" : "posts"} shared
            </p>
          </div>
        </div>
      </section>

      <section>
        <p className="text-sm font-bold uppercase tracking-wider text-kwk-purple">
          Your activity
        </p>
        <h2 className="mb-5 mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Posts you&apos;ve shared
        </h2>

        {authoredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto mb-3 text-3xl">✍️</div>
            <p className="text-sm text-slate-500">
              You haven&apos;t created any posts yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {authoredPosts.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl border-2 border-kwk-black bg-white p-6 shadow-[4px_4px_0_#0b0b0b] transition duration-300 hover:-translate-y-0.5 hover:bg-kwk-luna/50 hover:shadow-[6px_6px_0_#ff5bbd]"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
                  <span className="rounded-full bg-kwk-yellow/30 px-2.5 py-1 font-bold text-kwk-space">
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
                  className="mt-4 block text-lg font-bold text-slate-900 transition group-hover:text-kwk-space"
                >
                  {post.title}
                </Link>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
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
