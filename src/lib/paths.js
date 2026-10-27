const base = import.meta.env.BASE_URL;

/**
 * Prefixes a root-relative path with Astro's configured base path, so internal
 * links and public assets keep working when the site is deployed to a
 * subdirectory (e.g. GitHub Pages project sites).
 */
export function withBase(path = '/') {
  const prefix = base.replace(/\/$/, '');
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`;
}
