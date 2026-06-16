export async function loadKidsData(profile) {
  const filename = `${profile.toLowerCase()}.json`;

  // Fetch directly from GitHub RAW so we always get the latest JSON
  const url = `https://raw.githubusercontent.com/joeycello1/kids-youtube-dashboard/main/${filename}?v=${Date.now()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load ${filename}`);
  }

  const raw = await res.json();

  const videos = raw.map(v => ({
    ...v,

    watched: profile === "jonah"
      ? v.watched_jonah === true
      : v.watched_kieran === true,

    broken: false,

    rating: profile === "jonah"
      ? v.rating_jonah || ""
      : v.rating_kieran || "",

    videoCategory: v.videoCategory || "Uncategorized"
  }));

  return { videos };
}