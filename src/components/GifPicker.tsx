"use client";

import { useState } from "react";

type GiphyGif = {
  id: string;
  title: string;
  images: {
    original: {
      url: string;
    };
  };
};

type GiphySearchResponse = {
  data?: GiphyGif[];
  error?: string;
};

type GifPickerProps = {
  onGifSelected: (gifUrl: string) => void;
  onClose: () => void;
};

export default function GifPicker({ onGifSelected, onClose }: GifPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GiphyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function searchGifs(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setError("Enter a search term.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/giphy?query=${encodeURIComponent(trimmedQuery)}`
      );
      const data = (await response.json()) as GiphySearchResponse;

      if (!response.ok) {
        setResults([]);
        setError(data.error ?? "Unable to search for GIFs.");
        return;
      }

      setResults(Array.isArray(data.data) ? data.data : []);
    } catch {
      setResults([]);
      setError("Unable to search for GIFs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gif-picker-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="gif-picker-title"
            className="text-lg font-semibold text-gray-900"
          >
            Add a GIF
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close GIF picker"
          >
            Close
          </button>
        </div>

        <form onSubmit={searchGifs} className="mb-4 flex gap-2">
          <label htmlFor="gif-search" className="sr-only">
            Search for GIFs
          </label>
          <input
            id="gif-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search for GIFs..."
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="overflow-y-auto">
          {!loading && !error && results.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-600">
              Search for a GIF to add to your comment.
            </p>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {results.map((gif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() => onGifSelected(gif.images.original.url)}
                  className="overflow-hidden rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Select ${gif.title || "GIF"}`}
                >
                  {/* Giphy returns runtime image URLs that are not known to Next.js config. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={gif.images.original.url}
                    alt={gif.title || "GIF search result"}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
