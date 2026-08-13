import Link from "next/link";

type CommunityNavProps = {
  slug: string;
  activeTab: "home" | "events";
};

export default function CommunityNav({ slug, activeTab }: CommunityNavProps) {
  return (
    <nav
      aria-label="Community navigation"
      className="mb-8 flex w-fit gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
    >
      <Link
        href={`/${slug}`}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          activeTab === "home"
            ? "bg-kwk-purple text-white shadow-sm"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        Home
      </Link>
      <Link
        href={`/${slug}/events`}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          activeTab === "events"
            ? "bg-kwk-purple text-white shadow-sm"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        Events
      </Link>
    </nav>
  );
}
