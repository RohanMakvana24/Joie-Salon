// Set the public production origin before building for deployment.
const configuredUrl = process.env.SITE_URL?.trim();

function getSiteUrl(): string | undefined {
  if (!configuredUrl) return undefined;
  const url = new URL(configuredUrl);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('SITE_URL must be a public HTTP or HTTPS origin.');
  }
  return url.origin;
}

export const SITE_URL = getSiteUrl();
export const SEO_TITLE = "Best Men's Salon in Rajkot | Joie Salon, Pedak Road";
export const SEO_DESCRIPTION =
  "Rated 4.9★ best men's salon on Pedak Road, Arya Nagar, Rajkot. Master skin fades, precision haircuts, royal beard grooming, groom packages & de-tan facials. Call +91 82828 48453.";
