export async function loadKidsData(profile) {
  
  // -----------------------------------------
  // ⭐ GUEST MODE — read‑only, single JSON
  // -----------------------------------------
  if (profile === "guest") {
    const url = `https://raw.githubusercontent.com/joeycello1/kids-youtube-dashboard/main/jonah.json?v=${Date.now()}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to load guest data");
    }

    const raw = await res.json();

    const videos = raw.map(v => ({
      ...v,
      watched: false,
      rating: "",
      broken: false,
      videoCategory: v.videoCategory || "Uncategorized"
    }));

    return { videos };
  }

  // -----------------------------------------
  // ⭐ NORMAL MODE — Jonah or Kieran
  // -----------------------------------------
  const filename = `${profile.toLowerCase()}.json`;

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

    rating: profile === "jonah"
      ? v.rating_jonah || ""
      : v.rating_kieran || "",

    broken: false,

    videoCategory: v.videoCategory || "Uncategorized"
  }));

  return { videos };
}