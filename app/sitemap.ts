import type { MetadataRoute } from 'next';
import { SITE_URL } from '../src/lib/seo';
import { BLOG_POSTS } from '../src/data/blogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_URL ? [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/blog` },
    ...BLOG_POSTS.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: `${post.publishedAt}T00:00:00+05:30` })),
  ] : [];
}
