import { db } from "@/db";
import NewResourceForm from "@/components/NewResourceForm";
import { communities, posts, resources, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import NewResourceForm from "@/components/NewResourceForm";
import { notFound } from "next/navigation";
import CommunityNav from "@/components/CommunityNav";
import NewPostForm from "@/components/NewPostForm";
import ResourceSearch from "@/components/ResourceSearch";
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
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">        <div>
          <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
          <p className="mt-2 text-gray-600">{community.description}</p>
        </div>

        <NewPostForm communityId={community.id} />
      </div>

      <CommunityNav slug={community.slug} activeTab="home" />

      {/* two column wrapper  */}

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Community Posts</h2>

              {communityPosts.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">
                  No posts have been shared in this community yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-gray-200">
                  {communityPosts.map((post) => (
                    <li key={post.id} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        By {post.authorName} &middot;{" "}
                        {post.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
        </section>
        <aside className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">


          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Helpful Resources
            </h2>
            <NewResourceForm communityId={community.id} />
          </div>

          {communityResources.length > 0 ? (
            <div className="space-y-3">
              {communityResources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {resource.description}
                  </p>
                  <span className="mt-3 block break-all text-sm font-medium text-blue-600">
                    {resource.url}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <p className="text-sm text-gray-500">
                No resources have been shared yet.
              </p>
            </div>
          )}
        </aside>

      </div>

      {/* <section className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Helpful Resources
          </h2>
          <NewResourceForm communityId={community.id} />
        </div>

        <ResourceSearch resources={communityResources} />
        {communityResources.length > 0 ? (
          <div className="space-y-3">
            {communityResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {resource.description}
                </p>
                <span className="mt-3 block break-all text-sm font-medium text-blue-600">
                  {resource.url}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              No resources have been shared yet.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">Community Posts</h2>

        {communityPosts.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No posts have been shared in this community yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-200">
            {communityPosts.map((post) => (
              <li key={post.id} className="py-4 first:pt-0 last:pb-0">
                <h3 className="text-lg font-medium text-gray-900">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  By {post.authorName} &middot;{" "}
                  {post.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section> */}
    </div>
  );
}
