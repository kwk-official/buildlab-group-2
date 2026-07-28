"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import GifPicker from "@/components/GifPicker";
import { useAuth } from "@/lib/auth";

type NewCommentFormProps = {
  postId: string;
};

export default function NewCommentForm({ postId }: NewCommentFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const { user, ready } = useAuth();
  const router = useRouter();

  function handleGifSelected(gifUrl: string) {
    setText((currentText) => {
      const separator =
        currentText.length > 0 && !currentText.endsWith("\n") ? "\n" : "";
      return `${currentText}${separator}${gifUrl}`;
    });
    setIsGifPickerOpen(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setError("Please log in to add a comment.");
      return;
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Please enter a comment.");
      return;
    }

    setError(null);
    setPending(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ text: trimmedText }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Unable to add comment.");
        return;
      }

      setText("");
      router.refresh();
    } catch {
      setError("Unable to add comment.");
    } finally {
      setPending(false);
    }
  }

  if (!ready) {
    return (
      <p className="text-sm text-gray-600">Checking your sign-in status...</p>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-lg border border-gray-200 bg-white p-4"
      >
        <label
          htmlFor="comment-text"
          className="block text-sm font-medium text-gray-900"
        >
          Add a comment
        </label>

        <textarea
          id="comment-text"
          name="comment"
          rows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Write your comment..."
          disabled={pending}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-between gap-3">
          <Button
            label="Add GIF"
            onClick={() => setIsGifPickerOpen((isOpen) => !isOpen)}
            variant="secondary"
            disabled={pending}
          />
          <Button label="Add Comment" type="submit" disabled={pending} />
        </div>
      </form>

      {isGifPickerOpen && (
        <GifPicker
          onGifSelected={handleGifSelected}
          onClose={() => setIsGifPickerOpen(false)}
        />
      )}
    </>
  );
}
