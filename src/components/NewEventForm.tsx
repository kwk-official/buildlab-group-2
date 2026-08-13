"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Button from "@/components/Button";

type NewEventFormProps = {
  communityId: string;
};

const labelClassName = "block text-sm font-medium text-gray-700";
const fieldClassName =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function NewEventForm({ communityId }: NewEventFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  function resetForm() {
    setName("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setLocation("");
  }

  function closeDialog() {
    setOpen(false);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Log in to create an event.");
      return;
    }

    setPending(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          startTime,
          endTime,
          location,
          communityId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }

      resetForm();
      closeDialog();
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button label="+ New Event" onClick={() => setOpen(true)} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Create a new event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className={labelClassName}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClassName}
                  placeholder="Event name"
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClassName}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={fieldClassName}
                  placeholder="What is this event about?"
                />
              </div>

              <div>
                <label htmlFor="startTime" className={labelClassName}>
                  Start Time
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="endTime" className={labelClassName}>
                  End Time
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="location" className={labelClassName}>
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={fieldClassName}
                  placeholder="Event location"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  label="Cancel"
                  variant="secondary"
                  onClick={closeDialog}
                />

                <Button
                  label={pending ? "Creating..." : "Create"}
                  type="submit"
                  disabled={pending}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
