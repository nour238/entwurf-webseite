import { defineConfig } from 'astro/config';

// GitHub Pages URLs:
// - project site: https://<owner>.github.io/<repo>/
// - user/org site: https://<owner>.github.io/
// The deploy workflow provides GITHUB_REPOSITORY, so no values need to be
// hardcoded here. Local builds keep base "/" and no site, which is fine
// because canonical/OG URLs are optional outside a deployment.
const repository = process.env.GITHUB_REPOSITORY ?? '';
const [owner, repo] = repository.split('/');
const isUserSite = Boolean(owner && repo) && repo.toLowerCase() === `${owner}.github.io`.toLowerCase();
const base = process.env.BASE_PATH ?? (repo && !isUserSite ? `/${repo}` : '/');
const site = process.env.SITE_URL ?? (owner ? `https://${owner.toLowerCase()}.github.io` : undefined);

export default defineConfig({
  output: 'static',
  site,
  base,
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
});
