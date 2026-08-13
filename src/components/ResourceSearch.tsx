"use client";

import { useState } from "react";

type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
};

type ResourceSearchProps = {
  resources: Resource[];
};

export default function ResourceSearch({ resources }: ResourceSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredResources = resources.filter((resource) => {
    const title = resource.title.toLowerCase();
    const description = resource.description.toLowerCase();

    return (
      title.includes(normalizedSearchTerm) ||
      description.includes(normalizedSearchTerm)
    );
  });

  return (
    <div>
      <label htmlFor="resource-search" className="sr-only">
        Search resources
      </label>
      <input
        id="resource-search"
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by title or description..."
        className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-kwk-blue focus:bg-white focus:ring-4 focus:ring-kwk-luna"
      />

      {resources.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">
            No resources have been shared yet.
          </p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">
            No resources match your search.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-kwk-green hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-slate-900 transition group-hover:text-kwk-space">
                  {resource.title}
                </h3>
                <span className="text-kwk-green transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {resource.description}
              </p>
              <span className="mt-3 block truncate text-xs font-semibold text-kwk-space">
                {resource.url.replace(/^https?:\/\//, "")}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
