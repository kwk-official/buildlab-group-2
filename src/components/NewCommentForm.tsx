"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

type NewCommentFormProps = {
  postId: string;
};

export default function NewCommentForm({ postId }: NewCommentFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { user, ready } = useAuth();
  const router = useRouter();

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

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ text: trimmedText }),
    });

    setPending(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Unable to add comment.");
      return;
    }

    setText("");
    router.refresh();
  }

  if (!ready) {
    return (
      <p className="text-sm text-slate-600">Checking your sign-in status...</p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <label
        htmlFor="comment-text"
        className="block text-sm font-bold text-slate-900"
      >
        Add a comment
      </label>

      <textarea
        id="comment-text"
        name="comment"
        rows={4}
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-kwk-blue focus:bg-white focus:ring-4 focus:ring-kwk-luna"
        placeholder="Write your comment..."
        disabled={pending}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <Button label="Add Comment" type="submit" disabled={pending} />
      </div>
    </form>
  );
}
