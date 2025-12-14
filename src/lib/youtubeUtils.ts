export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return extractYouTubeVideoId(url) !== null;
}

export function generateYouTubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    showinfo: '0',
    iv_load_policy: '3',
    controls: '1',
    disablekb: '1',
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
