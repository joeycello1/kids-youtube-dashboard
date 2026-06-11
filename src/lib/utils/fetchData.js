// src/lib/utils/fetchData.js

export async function loadDashboardData() {
  const raw = await (await fetch(`${import.meta.env.BASE_URL}data.json`)).json();
  const stats = await (await fetch(`${import.meta.env.BASE_URL}stats.json`)).json();

  const viralMap = new Map(
    stats.mostViral48h.map(v => [v.videoId, v.viewsPerHour])
  );

  const videos = raw.map(v => ({
    ...v,
    timestamp: new Date(v.timestamp),
    firstSeen: new Date(v.firstSeen),
    viewsPerHour48: viralMap.get(v.videoId) || 0,
    keywords: v.keyword
      ? v.keyword.split(',').map(k => k.trim()).filter(Boolean)
      : []
  }));

  return { videos, stats };
}