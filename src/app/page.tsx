import { db } from "@/db";
import { communities } from "@/db/schema";
import Link from "next/link";
import NewCommunityForm from "@/components/NewCommunityForm";

export default async function HomePage() {
  const allCommunities = await db.select().from(communities);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border-4 border-kwk-black bg-kwk-space px-6 py-10 text-white shadow-[8px_8px_0_#e8ff3e] sm:px-10 sm:py-14">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-kwk-pink/30 blur-2xl" />
        <div className="absolute -bottom-16 left-1/3 h-44 w-44 rounded-full bg-kwk-blue/60 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-kwk-luna">
              Learn · Share · Belong
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Find your people.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-kwk-luna sm:text-lg">
              Explore communities built around the ideas, causes, and creative
              projects you care about.
            </p>
          </div>
          <NewCommunityForm />
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-kwk-purple">
              Explore
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              All communities
            </h2>
          </div>
          <span className="rounded-full bg-kwk-luna px-3 py-1 text-sm font-semibold text-kwk-space">
            {allCommunities.length} total
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allCommunities.map((community) => (
            <Link
              key={community.id}
              href={`/${community.slug}`}
              className="group relative overflow-hidden rounded-2xl border-2 border-kwk-black bg-white p-6 shadow-[4px_4px_0_#0b0b0b] transition duration-300 hover:-translate-y-1 hover:bg-kwk-yellow/20 hover:shadow-[7px_7px_0_#ff5bbd] [&:nth-child(3n+2)]:bg-kwk-luna/50 [&:nth-child(3n+3)]:bg-kwk-yellow/20"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-kwk-luna to-kwk-yellow text-xl">
                ✦
              </div>
              <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-kwk-space">
                {community.name}
              </h3>
              <p className="mt-2 min-h-10 text-sm leading-6 text-slate-600">
                {community.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-kwk-purple">
                Visit community{" "}
                <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
