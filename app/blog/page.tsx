import type { Metadata } from 'next';
import { BlogCard } from '../../src/components/BlogCard';
import { BLOG_POSTS } from '../../src/data/blogPosts';
import { SITE_URL } from '../../src/lib/seo';

const title = 'Hair, Skin & Bridal Journal | Joie Salon, Rajkot';
const description = 'Joie Salon’s Rajkot guides cover choosing a ladies salon, layered haircuts, balayage, facials, bridal makeup and gel nail art.';
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: SITE_URL ? `${SITE_URL}/blog` : null },
  openGraph: { title, description, type: 'website', ...(SITE_URL ? { url: `${SITE_URL}/blog` } : {}) },
  twitter: { card: 'summary', title, description },
};

export default function BlogPage() {
  return <>
    <section className="journal-intro"><span className="journal-eyebrow">The Joie Salon journal</span><h1>Salon guides for <em>Rajkot.</em></h1><p>Find the right salon for your next appointment and explore hair colour, layered cuts, facials, bridal makeup and nail art.</p></section>
    <section className="journal-grid" aria-label="Latest articles">{BLOG_POSTS.map((post) => <BlogCard key={post.slug} post={post} />)}</section>
    <section className="journal-cta"><span className="journal-eyebrow">From inspiration to your next look</span><h2>Find your glow. Take a seat.</h2><p>Bring your ideas to Joie Salon, Jyoti Nagar Main Road, Behind Crystal Mall, Rajkot.</p><a href="/#contact" className="journal-button">Plan your visit ↗</a></section>
  </>;
}
