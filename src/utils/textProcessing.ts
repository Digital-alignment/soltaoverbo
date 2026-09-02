export function decodeHtmlEntities(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/<\/p>/gi, ' </p>')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getWordPreview(html: string, wordLimit: number = 35): string {
  const decodedText = decodeHtmlEntities(stripHtmlTags(html));
  const trimmedText = decodedText.trim();
  const words = trimmedText.split(/\s+/).filter(word => word.length > 0);

  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  return trimmedText;
}
