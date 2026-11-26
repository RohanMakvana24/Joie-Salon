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
export const SEO_TITLE = "Joie Salon — Ladies Hair, Skin & Bridal Studio in Rajkot";
export const SEO_DESCRIPTION =
  "Rated 4.9★ ladies hair, skin & bridal salon at Jyoti Nagar Main Road, Behind Crystal Mall, Rajkot. Expert layer cuts, caramel balayage, keratin smoothing, hydra-glow facials, nail art & bridal makeup. Call +91 82828 48453.";
