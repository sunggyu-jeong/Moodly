export const splitToParagraphs = (text: string): string[] => {
  if (!text.includes('. ')) {
    return [text];
  }

  const parts = text.split('. ');

  return parts
    .map((part, idx) => (idx === parts.length - 1 ? part.trim() : `${part.trim()}.`))
    .filter(Boolean);
};
