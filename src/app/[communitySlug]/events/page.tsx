import { db } from "@/db";
import { communities, events, eventRSVPs } from "@/db/schema";
import { asc, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import CommunityNav from "@/components/CommunityNav";
import NewEventForm from "@/components/NewEventForm";
import type { CommunityPageProps } from "@/types";
import { cookies } from "next/headers";
import { DEV_AUTH_COOKIE_NAME } from "@/lib/auth-session";
import Button from "@/components/Button";

// ============================================================
// EVENTS PAGE
// ============================================================
// This page will display all events for a community.
//
// YOUR TICKETS WILL ADD:
// - Ticket #2 (Person B): Fetch and display the list of events
// - Ticket #5 (Person B): Add a "New Event" button and form
// - Ticket #9 (Person B): Add RSVP functionality to each event
// ============================================================

export default async function EventsPage({ params }: CommunityPageProps) {
  const { communitySlug } = await params;
  const cookieStore = await cookies();
  const currUserId = cookieStore.get(DEV_AUTH_COOKIE_NAME)?.value ?? null;

  const community = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, communitySlug))
    .then((rows) => rows[0]);

  if (!community) {
    notFound();
  }

  const communityEvents = await db
    .select()
    .from(events)
    .where(eq(events.communityId, community.id))
    .orderBy(asc(events.startTime));
  const eventIds = communityEvents.map((event) => event.id);
  const rsvps =
    eventIds.length === 0
      ? []
      : await db
          .select()
          .from(eventRSVPs)
          .where(inArray(eventRSVPs.eventId, eventIds));
  const rsvpCountsByEventId = new Map<string, number>();

  for (const rsvp of rsvps) {
    const currentCount = rsvpCountsByEventId.get(rsvp.eventId) ?? 0;
    rsvpCountsByEventId.set(rsvp.eventId, currentCount + 1);
  }

  const currentUserRSVPEventIds = new Set(
    rsvps
      .filter((rsvp) => rsvp.userId === currUserId)
      .map((rsvp) => rsvp.eventId)
  );

  return (
    <div>
      <section className="mb-6 rounded-3xl border-4 border-kwk-black bg-kwk-green p-6 text-kwk-black shadow-[8px_8px_0_#e8ff3e] sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-kwk-black">
          Gather together
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Events at {community.name}
        </h1>
        <p className="mt-3 max-w-2xl text-kwk-black/80">
          Meet people, learn something new, and take part in what&apos;s next.
        </p>
      </section>

      <CommunityNav slug={community.slug} activeTab="events" />

      <div className="mb-6 flex justify-end">
        <NewEventForm communityId={community.id} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {communityEvents.map((event) => {
          const rsvpCount = rsvpCountsByEventId.get(event.id) ?? 0;
          const isAttending = currentUserRSVPEventIds.has(event.id);

          const buttonLabel = !currUserId
            ? "Log in to RSVP"
            : isAttending
              ? "Attending"
              : "RSVP";

          const buttonDisabled = !currUserId || isAttending;

          return (
            <article
              key={event.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-kwk-luna hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-kwk-luna text-xl">
                  📅
                </div>
                <span className="rounded-full bg-kwk-yellow/30 px-3 py-1 text-xs font-bold text-kwk-space">
                  {rsvpCount} attending
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{event.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {event.description}
              </p>
              <dl className="my-5 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex gap-2">
                  <dt className="font-bold text-slate-700">Starts</dt>
                  <dd className="text-slate-500">
                    {event.startTime.toLocaleString()}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold text-slate-700">Ends</dt>
                  <dd className="text-slate-500">
                    {event.endTime.toLocaleString()}
                  </dd>
                </div>
              </dl>
              <form method="POST" action={`/api/events/${event.id}/rsvp`}>
                <Button
                  label={buttonLabel}
                  type="submit"
                  disabled={buttonDisabled}
                />
              </form>
            </article>
          );
        })}
      </div>
    </div>
  );
}
