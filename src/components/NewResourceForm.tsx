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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-resource-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2
              id="add-resource-title"
              className="mb-4 text-xl font-semibold text-gray-900"
            >
              Add a resource
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="resource-title"
                  className="block text-sm font-medium text-gray-900"
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
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Resource title"
                />
              </div>

              <div>
                <label
                  htmlFor="resource-description"
                  className="block text-sm font-medium text-gray-900"
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
                  className="mt-1 w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="What makes this resource useful?"
                />
              </div>

              <div>
                <label
                  htmlFor="resource-url"
                  className="block text-sm font-medium text-gray-900"
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
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {error && <p className="mr-auto text-sm text-red-600">{error}</p>}
                <Button
                  label="Cancel"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                />
                <Button
                  label="Add Resource"
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
