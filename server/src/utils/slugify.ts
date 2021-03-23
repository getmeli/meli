import slug from 'src/utils/slugify';

export function slugify(str: string): string {
  return slug(str, {
    replacement: '-',
    lower: true,
  });
}
