# Joie Salon — Next.js

Website for Joie Salon, a ladies hair, skin and bridal studio in Rajkot, built with the Next.js App Router.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm test
npm run build
```

The site uses Next.js 15, React 19, and Tailwind CSS 4. The landing page is statically prerendered; interactive sections run as client components. Three.js lanyard rendering is loaded only in the browser. Shared content lives in `src/data`, and static images and fonts are in `public`.

## Local SEO deployment

Copy `.env.example` to `.env.local` and set `SITE_URL` to the actual public production origin before building. This enables the homepage canonical URL, Open Graph URL, salon identity URL and sitemap entry. Without it, domain-dependent fields are omitted and the sitemap is empty to avoid advertising an invented domain. Environment changes require a rebuild and redeployment.

The site allows indexing and exposes `/robots.txt` and `/sitemap.xml`. Keep staging deployments private or apply a host-level `X-Robots-Tag: noindex` header there.

After deployment, verify the domain in Google Search Console (optionally set `GOOGLE_SITE_VERIFICATION` to the HTML-tag content token), submit `/sitemap.xml`, and request homepage indexing. Claim or verify the salon's Google Business Profile, link the live website, and keep its name, address, phone and confirmed hours consistent with the website. Validate the deployed homepage using Google's Rich Results Test. Unconfirmed hours, prices and self-serving review ratings are intentionally omitted from structured data. Search visibility and rankings depend on Google and are not guaranteed.

## WhatsApp booking contact

Booking links use `BUSINESS_INFO.bookingUrl` in `src/data/barbershopData.ts`. Guests request appointments via WhatsApp at +91 96243 96903. The salon confirms appointments by replying.

The public demo banner and illustrative staff roster are not mounted on the homepage. Restore the team section after the owner supplies actual staff details and photos.

## Blog publishing

Visit `/blog` for the journal. Articles are statically generated at `/blog/[slug]` with individual metadata, article structured data, related stories and sitemap entries. Add or edit entries in `src/data/blogPosts.ts`, then rebuild and deploy. Each entry needs a unique, stable lowercase hyphenated slug, title, description, category, publication date (`YYYY-MM-DD`), public image path, descriptive image alt text, introduction and sections with unique IDs. Article covers are labelled as style illustrations.

There is no admin login, database, email collection or newsletter delivery in this version. Domain-dependent SEO fields still require `SITE_URL` at build time.
