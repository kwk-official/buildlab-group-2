"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

type NewResourceFormProps = {
  communityId: string;
};

export default function NewResourceForm({ communityId }: NewResourceFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setPending(true);

    const response = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, url, communityId }),
    });

    setPending(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setTitle("");
    setDescription("");
    setUrl("");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button label="Add Resource" onClick={() => setOpen(true)} />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-resource-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-2xl">
            <h2
              id="add-resource-title"
              className="mb-5 text-xl font-bold text-slate-900"
            >
              Add a resource
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="resource-title"
                  className="block text-sm font-bold text-slate-700"
                >
                  Title
                </label>
                <input
                  id="resource-title"
                  name="title"
                  type="text"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-kwk-blue focus:bg-white focus:ring-4 focus:ring-kwk-luna"
                  placeholder="Resource title"
                />
              </div>

              <div>
                <label
                  htmlFor="resource-description"
                  className="block text-sm font-bold text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="resource-description"
                  name="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-kwk-blue focus:bg-white focus:ring-4 focus:ring-kwk-luna"
                  placeholder="What makes this resource useful?"
                />
              </div>

              <div>
                <label
                  htmlFor="resource-url"
                  className="block text-sm font-bold text-slate-700"
                >
                  URL
                </label>
                <input
                  id="resource-url"
                  name="url"
                  type="url"
                  required
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-kwk-blue focus:bg-white focus:ring-4 focus:ring-kwk-luna"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {error && (
                  <p className="mr-auto text-sm text-red-600">{error}</p>
                )}
                <Button
                  label="Cancel"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                />
                <Button label="Add Resource" type="submit" disabled={pending} />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
