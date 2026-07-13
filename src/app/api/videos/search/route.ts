import { NextRequest, NextResponse } from "next/server";

/** GET /api/videos/search?q=glute+bridge
 *  Searches YouTube (Data API v3) ordered by relevance, returns the top
 *  embeddable results with view counts so the client can offer a pick list.
 *  We only ever EMBED the official YouTube player — videos are never
 *  downloaded or re-encoded (that would violate YouTube's ToS).
 *  Without a YOUTUBE_API_KEY, returns demo results so the UI still works. */

const DEMO_RESULTS = {
  demo: true,
  results: [
    { videoId: "g_tea8ZNk5A", title: "Glute Bridge — proper form (demo result)", channel: "Physio Channel", views: "1.2M" },
    { videoId: "wPM8icPu6H8", title: "How to do a Glute Bridge (demo result)", channel: "Rehab Science", views: "850K" },
  ],
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key || key.includes("REPLACE_ME")) {
    return NextResponse.json(DEMO_RESULTS);
  }

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.search = new URLSearchParams({
    part: "snippet", q: `${q} exercise physio form`, type: "video",
    videoEmbeddable: "true", maxResults: "6", order: "relevance", key,
  }).toString();

  const sRes = await fetch(searchUrl);
  if (!sRes.ok) {
    console.error("YouTube search failed:", sRes.status, await sRes.text());
    return NextResponse.json({ error: "Video search failed" }, { status: 502 });
  }
  const sData = await sRes.json();
  const ids = (sData.items ?? []).map((i: { id: { videoId: string } }) => i.id.videoId).filter(Boolean);
  if (!ids.length) return NextResponse.json({ results: [] });

  // fetch view counts, then sort by views within the relevant set
  const statsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  statsUrl.search = new URLSearchParams({ part: "statistics,snippet", id: ids.join(","), key }).toString();
  const vRes = await fetch(statsUrl);
  const vData = vRes.ok ? await vRes.json() : { items: [] };

  const results = (vData.items ?? [])
    .map((v: { id: string; snippet: { title: string; channelTitle: string }; statistics: { viewCount?: string } }) => ({
      videoId: v.id,
      title: v.snippet.title,
      channel: v.snippet.channelTitle,
      viewCount: Number(v.statistics.viewCount ?? 0),
    }))
    .sort((a: { viewCount: number }, b: { viewCount: number }) => b.viewCount - a.viewCount)
    .map((v: { videoId: string; title: string; channel: string; viewCount: number }) => ({
      ...v,
      views: v.viewCount > 1_000_000 ? (v.viewCount / 1_000_000).toFixed(1) + "M" : Math.round(v.viewCount / 1000) + "K",
    }));

  return NextResponse.json({ results });
}
