import type { Page, Post, SiteConfig } from "./schema";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export function renderLayout(site: SiteConfig, title: string, body: string) {
  const nav = site.navigation
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join("");

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | ${escapeHtml(site.name)}</title>
  <meta name="description" content="${escapeHtml(site.description ?? "")}" />
</head>
<body>
  <header>
    <strong>${escapeHtml(site.name)}</strong>
    <nav>${nav}</nav>
  </header>
  <main>${body}</main>
</body>
</html>`;
}

export function renderPage(site: SiteConfig, page: Page) {
  return renderLayout(
    site,
    page.seoTitle ?? page.title,
    `<article><h1>${escapeHtml(page.title)}</h1><div>${page.body}</div></article>`,
  );
}

export function renderPost(site: SiteConfig, post: Post) {
  return renderLayout(
    site,
    post.seoTitle ?? post.title,
    `<article>
      <p>${escapeHtml(post.category)} · ${escapeHtml(post.publishedAt)}</p>
      <h1>${escapeHtml(post.title)}</h1>
      ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ""}
      <div>${post.body}</div>
    </article>`,
  );
}
