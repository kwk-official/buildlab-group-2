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
    eventIds.length == 0
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
    .map((rsvp) => rsvp.eventId),
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {community.name} — Events
        </h1>
        <p className="mt-2 text-gray-600">
          Upcoming events for {community.name}.
        </p>
      </div>

      <CommunityNav slug={community.slug} activeTab="events" />

      <div className="mb-8">
        <NewEventForm communityId={community.id}/>
      </div>

      {/* ====================================================== */}
      {/* PLACEHOLDER: Events list will go here.                 */}
      {/* See Tickets #2, #5, and #9.                            */}
      {/* ====================================================== */}
      {/* <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-left"> */}
      <div>
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
            <article key={event.id}>
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 m-5 text-left">
                <h2 className="text-lg font-bold text-gray-700">{event.name}</h2>
                <p className="text-lg font-medium text-blue-400">{event.description}</p>
                <p className="text-lg font-medium text-blue-400">Start: {event.startTime.toLocaleString()}</p>
                <p className="text-lg font-medium text-blue-400">End: {event.endTime.toLocaleString()}</p>
                <p>{rsvpCount} attending</p>
                <form method="POST" action={`/api/events/${event.id}/rsvp`}>
                  <Button label={buttonLabel} type="submit" disabled={buttonDisabled} />
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
