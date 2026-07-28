import { NextResponse } from "next/server";

const GIPHY_SEARCH_URL = "https://api.giphy.com/v1/gifs/search";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "A search query is required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GIPHY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GIF search is not configured." },
      { status: 500 }
    );
  }

  const searchUrl = new URL(GIPHY_SEARCH_URL);
  searchUrl.searchParams.set("api_key", apiKey);
  searchUrl.searchParams.set("q", query);

  try {
    const response = await fetch(searchUrl, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to search for GIFs." },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to search for GIFs." },
      { status: 502 }
    );
  }
}
