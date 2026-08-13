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
        placeholder="Search resources..."
        className="mb-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {resources.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">
            No resources have been shared yet.
          </p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">
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
              className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                {resource.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {resource.description}
              </p>
              <span className="mt-3 block break-all text-sm font-medium text-blue-600">
                {resource.url}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
