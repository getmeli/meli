function cleanString(s: string): string {
  if (!s) {
    return '';
  }
  return s
    .toLowerCase()
    .trim()
    .replace(/[&/\\#,+()$~%. '":*?<>{}\-_]/g, '');
}

export function textSearch(needle: string, haystack: string): boolean {
  if (!needle || !haystack) {
    return true;
  }
  const cleanHaystack = cleanString(haystack);

  return needle.split(' ')
    .some(term => {
      const cleanTerm = cleanString(term);
      return cleanHaystack.indexOf(cleanTerm) !== -1;
    });
}
