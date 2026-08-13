import { db } from "@/db";
import NewResourceForm from "@/components/NewResourceForm";
import { communities, posts, resources, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import NewResourceForm from "@/components/NewResourceForm";
import { notFound } from "next/navigation";
import CommunityNav from "@/components/CommunityNav";
import NewPostForm from "@/components/NewPostForm";
import ResourceSearch from "@/components/ResourceSearch";
import Link from "next/link";
import type { CommunityPageProps } from "@/types";

// ============================================================
// COMMUNITY HOMEPAGE
// ============================================================
// This is the main page for a specific community.
//
// YOUR TICKETS WILL ADD:
// - Ticket #1 (Person A): Display a list of posts here
// - Ticket #3 (Person C): Display a list of resources here
// - Ticket #4 (Person A): Add a "New Post" button and form
// - Ticket #6 (Person C): Add an "Add Resource" button and form
// - Ticket #10 (Person B): Improve the layout and styling
// ============================================================

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { communitySlug } = await params;

  const community = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, communitySlug))
    .then((rows) => rows[0]);

  if (!community) {
    notFound();
  }

  const communityResources = await db
    .select()
    .from(resources)
    .where(eq(resources.communityId, community.id));
  const communityPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      createdAt: posts.createdAt,
      authorName: users.name,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.communityId, community.id))
    .orderBy(desc(posts.createdAt));

  return (
    <div>
      <section className="mb-6 overflow-hidden rounded-3xl border border-kwk-luna bg-gradient-to-br from-kwk-luna via-white to-kwk-yellow/30 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-kwk-purple">
              Community
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {community.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {community.description}
            </p>
          </div>
          <NewPostForm communityId={community.id} />
        </div>
      </section>

      <CommunityNav slug={community.slug} activeTab="home" />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-kwk-green">
                Discover
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Helpful resources
              </h2>
            </div>
            <NewResourceForm communityId={community.id} />
          </div>

          <ResourceSearch resources={communityResources} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-kwk-purple">
              Latest conversations
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Community posts
            </h2>
          </div>

          {communityPosts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No posts have been shared in this community yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {communityPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/${community.slug}/posts/${post.id}`}
                    className="group block rounded-xl border border-slate-200 p-4 transition hover:border-kwk-luna hover:bg-kwk-luna/50"
                  >
                    <h3 className="font-bold text-slate-900 transition group-hover:text-kwk-space">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 text-xs font-medium text-slate-500">
                      By {post.authorName} &middot;{" "}
                      {post.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
