type CommentData = {
  id: string;
  text: string;
  createdAt: Date;
  authorName: string | null;
  authorImage: string | null;
};

type CommentProps = {
  comment: CommentData;
};

export type { CommentData };

export default function Comment({ comment }: CommentProps) {
  const authorLabel = comment.authorName?.trim() || "Unknown user";
  const avatarInitial = authorLabel.charAt(0).toUpperCase() || "?";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        {comment.authorImage ? (
          <img
            src={comment.authorImage}
            alt={authorLabel}
            className="h-10 w-10 rounded-full bg-slate-100 object-cover ring-2 ring-white"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-kwk-luna text-sm font-bold text-kwk-space"
          >
            {avatarInitial}
          </div>
        )}

        <div>
          <p className="text-sm font-bold text-slate-900">{authorLabel}</p>
          <p className="text-xs text-slate-500">
            {comment.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {comment.text}
      </p>
    </article>
  );
}
