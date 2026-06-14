export async function loadKidsData(profile) {
  const filename = `${profile.toLowerCase()}.json`;

  // Detect if running on GitHub Pages
  const isGithubPages = window.location.hostname.includes("github.io");

  // Build correct base path
  const basePath = isGithubPages
    ? `/${window.location.pathname.split('/')[1]}` // repo name
    : "";

  const url = `${basePath}/${filename}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to load ${filename}`);
  }

  const raw = await res.json();
  
  const videos = raw.map(v => ({
  ...v,
  timestamp: new Date(v.timestamp),
  firstSeen: new Date(v.firstSeen),
  watched: v.watched === true,
  videoCategory: v.videoCategory || "Uncategorized",   // ⭐ ADD THIS
  keywords: v.keyword
    ? v.keyword.split(',').map(k => k.trim()).filter(Boolean)
    : []
}));

  return { videos };
}
