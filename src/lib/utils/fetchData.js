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

    watched: profile === "jonah"
      ? v.watched_jonah === true
      : v.watched_kieran === true,

    broken: false,

    videoCategory: v.videoCategory || "Uncategorized"
  }));

  return { videos };

}
