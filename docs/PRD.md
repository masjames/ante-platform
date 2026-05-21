# ANTE Platform PRD

Status: Draft v0.1  
Owner: Adit / ANTE ecosystem  
Date: 2026-05-21

## 1. Product Intent

ANTE Platform is an internal static website engine for the ANTE ecosystem. It exists to let KALANA build, migrate, host, and maintain content-heavy websites quickly using a repeatable TypeScript schema and renderer.

ANTE Platform is not sold directly. The commercial entry point is KALANA as a managed service: clients buy outcomes, setup, maintenance, and growth support. ANTE Platform is the internal engine that makes those services faster, cheaper, and more standardized.

Frame Malang is the first flagship implementation and public case study. It should prove that the engine can produce a fast local media/community website with articles, categories, membership/support calls to action, and sponsor placements on free infrastructure.

ANTEP is the monetization and membership layer. ANTE Platform should not become a payment, CRM, or membership SaaS. It should expose stable slots and embeds where ANTEP can handle contribution, member identity, benefit delivery, and recurring revenue workflows.

## 2. Operating Constraints

- Free infrastructure first: use local files, static output, Git, and free hosting tiers before paid services.
- No spend for the MVP unless Adit explicitly approves it.
- 30-day MVP mindset: prove a working Frame Malang site, not a generalized publishing platform.
- Static-first by default: generated HTML should work without a server runtime.
- Indonesian/local-business friendly: content model and templates should support Bahasa Indonesia, local sponsors, community membership, and simple editorial workflows.
- Internal maintainability over external polish: the engine should be easy for KALANA to operate before it is broadly reusable.

## 3. Non-Goals

- Selling ANTE Platform as a standalone SaaS.
- Building a full CMS admin panel in the MVP.
- Building payments, auth, subscriptions, or member management inside ANTE Platform.
- Supporting arbitrary theme marketplaces or user-installed plugins.
- Multi-tenant hosting orchestration beyond repo/config conventions.
- Real-time personalization, comments, forums, analytics dashboards, or recommendation systems.
- Replacing ANTEP, KALANA, or Frame Malang as separate product/business surfaces.

## 4. Users and Stakeholders

Primary internal users:

- KALANA implementer: configures sites, migrates content, runs builds, deploys static output, and maintains client websites.
- Editorial operator: drafts and publishes pages/posts through file changes or a later lightweight content workflow.
- Adit/product owner: decides scope, prioritizes Frame Malang needs, validates whether the engine creates leverage.

External stakeholders:

- Frame Malang readers: need fast pages, clear navigation, readable local content, and reliable mobile UX.
- Frame Malang contributors/editors: need predictable content structure and low-friction publishing.
- Sponsors: need visible placements, target URLs, and basic campaign metadata.
- Members/supporters: need clear support/membership entry points powered by ANTEP.
- Future KALANA clients: benefit indirectly through faster delivery and lower maintenance cost.

## 5. MVP Scope

The MVP should generate and deploy a static Frame Malang website with:

- Site config: name, domain, description, logo, navigation, and social links.
- Pages: home, about, membership/support, contact or editorial info.
- Posts: title, slug, excerpt, body, cover image, category, tags, author, published date, SEO fields, and publish status.
- Categories: category landing pages and post grouping.
- Membership block: copy, benefits, and optional ANTEP embed target.
- Sponsor slots: named placements for home, article, and sidebar surfaces.
- Static renderer: HTML output for pages, posts, category indexes, home/index, sponsor placements, and membership CTA.
- Build command: deterministic local build from source content to `dist/`.
- Deploy target: one free static host path, initially GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any equivalent free tier.
- Basic SEO: title, description, semantic HTML, canonical URL if domain is configured, and sensible social metadata.
- Basic ops docs: local build, content publishing, deployment, rollback, and known limits.

## 6. Architecture

ANTE Platform should be organized as a static build pipeline:

1. Content Source
   File-based content and config live in the repo. MVP can use typed `.ts`/`.json` seed data or Markdown/MDX once the parser is chosen.

2. Schema Layer
   TypeScript types define the stable data contract for site config, pages, posts, categories, membership, and sponsor slots. The current scaffold starts in `src/schema.ts`.

3. Content Loader
   Reads site config and content files, validates shape, filters drafts, resolves relationships, and produces normalized content collections.

4. Render Core
   Converts normalized content into escaped, complete HTML documents. The current scaffold starts in `src/render.ts`.

5. Route Builder
   Maps content to output paths such as `/`, `/posts/{slug}/`, `/categories/{slug}/`, `/membership/`, and static asset paths.

6. Asset Pipeline
   Copies images, CSS, and other static files into `dist/` with stable paths. MVP can avoid hashing until caching needs are clearer.

7. Deploy Output
   Emits a portable `dist/` folder that any static host can serve.

## 7. Module Boundaries

Recommended internal modules:

- `schema`: Type definitions and validation contracts. No rendering logic.
- `content`: File loading, parsing, normalization, draft filtering, and relationship checks.
- `render`: Pure HTML rendering functions for layouts and content types.
- `routes`: URL and filesystem path generation.
- `build`: Orchestrates loading, rendering, asset copy, and writing to `dist/`.
- `themes` or `templates`: Site presentation variants after Frame Malang proves the first template.
- `integrations/antep`: Embed URL generation and safe placement helpers only. No payment logic.
- `integrations/deploy`: Optional wrappers or docs for free static hosts.

Boundary rules:

- Render functions receive validated data and return strings.
- Content loaders must not know about final HTML markup.
- ANTEP integration must remain an embed/interface boundary.
- Sponsor slots are content/config objects, not hard-coded template copy.
- Site-specific Frame Malang data should live outside reusable engine code.

## 8. Data and Content Model

Current scaffold types:

- `SiteConfig`: global identity, domain, description, logo, navigation, social links.
- `NavigationItem`: label and href.
- `Page`: title, slug, body, SEO fields, status.
- `Post`: title, slug, excerpt, body, cover image, category, tags, author, published date, SEO fields, status.
- `Category`: name, slug, description.
- `Membership`: title, description, benefits, optional `antepEmbed`.
- `SponsorSlot`: name, placement, image, target URL, optional campaign dates.

MVP validation requirements:

- Slugs are unique within each content type.
- Published posts require `title`, `slug`, `body`, `category`, and valid `publishedAt`.
- Post category must match an existing category slug or name normalization rule.
- Draft content is excluded from production output by default.
- URLs in navigation, sponsor target URLs, social links, and ANTEP embeds are sanitized or validated.
- Date fields use ISO-like strings and render in a consistent local display format.
- Body content must have a deliberate format decision: trusted HTML, Markdown transformed to HTML, or a constrained rich-text representation.

Recommended MVP content layout:

```text
projects/ante-platform/
  content/
    frame-malang/
      site.json
      pages/
      posts/
      categories.json
      membership.json
      sponsors.json
  src/
    schema.ts
    render.ts
    content/
    routes/
    build.ts
  public/
    frame-malang/
  dist/
```

## 9. Render and Deploy Flow

Local build flow:

1. Run `npm install` once.
2. Run `npm run build` to type-check the engine.
3. Run the future static generation command, for example `npm run generate -- --site frame-malang`.
4. Loader reads `content/frame-malang`.
5. Validator rejects malformed content with actionable errors.
6. Renderer creates HTML pages.
7. Asset pipeline copies public assets.
8. Output is written to `dist/frame-malang` or `dist/`.
9. Deploy the generated folder through a free static host.

Production deploy flow:

- Main branch changes trigger static host build.
- Host runs install and generation commands.
- Host publishes `dist/`.
- Rollback uses the host's previous deployment or Git revert.

Initial routes:

- `/`
- `/articles/` or `/posts/`
- `/articles/{post.slug}/`
- `/categories/{category.slug}/`
- `/membership/`
- Static assets under `/assets/`

## 10. APIs and Interfaces

Internal TypeScript interfaces should remain simple and stable:

```ts
type ContentBundle = {
  site: SiteConfig;
  pages: Page[];
  posts: Post[];
  categories: Category[];
  membership?: Membership;
  sponsorSlots: SponsorSlot[];
};

type Route = {
  path: string;
  html: string;
};

type BuildOptions = {
  siteKey: string;
  contentDir: string;
  outDir: string;
  includeDrafts?: boolean;
};
```

Expected functions:

- `loadContent(options): ContentBundle`
- `validateContent(bundle): ValidationResult`
- `renderPage(site, page): string`
- `renderPost(site, post): string`
- `renderCategory(site, category, posts): string`
- `renderHome(site, bundle): string`
- `renderMembership(site, membership): string`
- `buildRoutes(bundle): Route[]`
- `writeDist(routes, assets, outDir): void`

External interfaces:

- Generated static HTML and assets.
- ANTEP embed URL or snippet in `Membership.antepEmbed`.
- Sponsor target URLs.
- Static host build settings.

## 11. Security and Operations

Security:

- Escape all untrusted text by default.
- Treat raw HTML body content as a deliberate trust boundary. If raw HTML is allowed, document that only trusted maintainers may edit it.
- Validate external URLs to avoid accidental `javascript:` or malformed links.
- Add `rel="noopener noreferrer"` for external sponsor/social links.
- Keep secrets out of repo content. MVP should not need API keys.
- Avoid server runtime and databases for MVP, reducing attack surface.

Operations:

- Build must fail loudly on invalid content, duplicate slugs, broken required relationships, and missing critical assets.
- Generated output should be deterministic so diffs are meaningful.
- Keep a short publishing checklist for Frame Malang.
- Use Git history and static host deployment history for rollback.
- Track performance with Lighthouse or equivalent manual checks before launch.
- Track broken links with a local script or static check before publishing.

Observability for MVP:

- Build logs are enough initially.
- Add generated route count and skipped draft count to build output.
- Manual QA checklist covers home, article, category, membership, sponsor links, mobile layout, and SEO tags.

## 12. Milestones

### Milestone 1: Engine Contract

Target: Days 1-3

- Finalize PRD and MVP route/content decisions.
- Extend schema only where needed for Frame Malang.
- Decide body format for MVP: trusted HTML or Markdown.
- Define content folder layout and sample Frame Malang seed content.

Acceptance:

- TypeScript build passes.
- Sample content can be represented without schema workarounds.
- Invalid content cases are known and documented.

### Milestone 2: Static Build Pipeline

Target: Days 4-10

- Implement content loader and validator.
- Implement route builder.
- Implement filesystem writer to `dist/`.
- Generate home, page, post, category, and membership routes.

Acceptance:

- One command generates a browsable static site locally.
- Draft posts do not render by default.
- Duplicate slugs and missing categories fail the build.

### Milestone 3: Frame Malang MVP Site

Target: Days 11-18

- Add Frame Malang config, navigation, categories, core pages, and initial articles.
- Add sponsor slot rendering.
- Add membership/support page with ANTEP embed placeholder.
- Add mobile-first CSS.

Acceptance:

- Frame Malang site is usable on mobile and desktop.
- Home page shows latest posts, categories, sponsor placement, and membership CTA.
- Article pages show category, date, title, excerpt/body, and sponsor placement.

### Milestone 4: Free Deploy

Target: Days 19-24

- Choose one free host.
- Add host build config or documented setup.
- Deploy Frame Malang preview.
- Run manual QA and performance checks.

Acceptance:

- Public preview URL works.
- Deploy can be repeated from Git.
- Rollback path is documented.

### Milestone 5: Case Study and KALANA Packaging

Target: Days 25-30

- Document what KALANA can offer using the engine.
- Capture before/after metrics where available.
- Write internal implementation checklist.
- List next reusable features for second client/site.

Acceptance:

- Frame Malang can be shown as a flagship implementation.
- KALANA has a clear managed-service story.
- ANTE Platform remains internal and does not require SaaS packaging.

## 13. MVP Acceptance Criteria

Functional:

- Static generation command produces a complete `dist/` site.
- Generated site includes home, pages, posts, categories, membership/support, and sponsor placements.
- Content status controls draft vs published output.
- All required Frame Malang MVP content can be represented in the schema.
- ANTEP appears only as an embed/link boundary.

Quality:

- `npm run build` passes.
- Generated HTML escapes unsafe text fields.
- Invalid content fails with useful errors.
- Routes are stable and human-readable.
- Mobile layout is readable without horizontal scroll.
- Lighthouse or equivalent manual review shows acceptable performance for a static site.

Business:

- Frame Malang preview can be shared as a case study.
- KALANA can use the workflow to explain managed website delivery.
- MVP runs on free infrastructure with no paid dependency.

## 14. Risks

- Scope creep into CMS, payments, membership, or plugin platform before the first static site works.
- Raw HTML body content can create security issues if untrusted editors are added later.
- Free hosting limits may become a constraint for media-heavy sites.
- Frame Malang-specific assumptions could leak into the reusable engine.
- No admin UI means publishing still requires technical comfort during MVP.
- Sponsor placement needs may become more campaign-management-like than the static model supports.
- ANTEP interface is not fully defined yet, so embed assumptions may change.

## 15. Next Engineering Tasks

1. Decide MVP body format: trusted HTML now, or Markdown with a parser dependency.
2. Add `src/content` loader for one site key and local content directory.
3. Add validation for required fields, duplicate slugs, status filtering, dates, URLs, and category references.
4. Add `src/routes` to produce route objects from validated content.
5. Add `src/build.ts` command to write `dist/`.
6. Extend `src/render.ts` with home, category, membership, sponsor slot, and external link helpers.
7. Add Frame Malang seed content under `content/frame-malang`.
8. Add CSS and asset copy support.
9. Add a local preview option, either simple static server docs or an npm script.
10. Add deploy docs for the chosen free host.
11. Add minimal tests for validation and route generation once modules exist.
12. Add a manual launch checklist for Frame Malang.

## 16. Decision Log

- 2026-05-21: ANTE Platform is defined as an internal static website engine, not a direct commercial product.
- 2026-05-21: KALANA is the commercial managed-service entry point.
- 2026-05-21: Frame Malang is the first flagship implementation and case study.
- 2026-05-21: ANTEP is the monetization/membership layer and should remain outside engine core.
- 2026-05-21: MVP prioritizes free infrastructure, no spend, and a 30-day delivery horizon.
