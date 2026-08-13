"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

type NewPostFormProps = {
  communityId: string;
};

export default function NewPostForm({ communityId }: NewPostFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { user, ready } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setError("Please log in to create a post.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("Please enter a post title.");
      return;
    }

    if (!trimmedContent) {
      setError("Please enter post content.");
      return;
    }

    setError(null);
    setPending(true);

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        title: trimmedTitle,
        content: trimmedContent,
        communityId,
      }),
    });

    setPending(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setTitle("");
    setContent("");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button label="New Post" onClick={() => setOpen(true)} />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-post-title"
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="new-post-title" className="mb-4 text-xl font-semibold text-gray-900">
              Create a new post
            </h2>

            {!ready ? (
              <p className="text-sm text-gray-600">Checking your sign-in status...</p>
            ) : !user ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Log in from the header to create a post in this community.
                </p>
                <div className="flex justify-end">
                  <Button label="Close" variant="secondary" onClick={() => setOpen(false)} />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="post-title" className="block text-sm font-medium text-gray-900">
                    Title
                  </label>
                  <input
                    id="post-title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Share an update with the community"
                  />
                </div>

                <div>
                  <label htmlFor="post-content" className="block text-sm font-medium text-gray-900">
                    Content
                  </label>
                  <textarea
                    id="post-content"
                    name="content"
                    rows={5}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Write your post here..."
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <Button label="Cancel" variant="secondary" onClick={() => setOpen(false)} />
                  <Button label="Create Post" type="submit" disabled={pending} />
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}