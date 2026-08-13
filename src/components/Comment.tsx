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
    <article className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        {comment.authorImage ? (
          <img
            src={comment.authorImage}
            alt={authorLabel}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700"
          >
            {avatarInitial}
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-900">{authorLabel}</p>
          <p className="text-xs text-gray-500">
            {comment.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{comment.text}</p>
    </article>
  );
}