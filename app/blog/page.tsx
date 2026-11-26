import type { Metadata } from 'next';
import { BlogCard } from '../../src/components/BlogCard';
import { BLOG_POSTS } from '../../src/data/blogPosts';
import { SITE_URL } from '../../src/lib/seo';

const title = 'Hair, Skin & Bridal Journal | Joie Salon, Rajkot';
const description = 'Layered haircut ideas, balayage tips, skincare routines, and bridal prep guides for your visit to Joie Salon on Jyoti Nagar Main Road, Rajkot.';
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: SITE_URL ? `${SITE_URL}/blog` : null },
  openGraph: { title, description, type: 'website', ...(SITE_URL ? { url: `${SITE_URL}/blog` } : {}) },
  twitter: { card: 'summary', title, description },
};

export default function BlogPage() {
  return <>
    <section className="journal-intro"><span className="journal-eyebrow">The Joie Salon journal</span><h1>Good hair starts<br />with a little <em>know-how.</em></h1><p>Fresh perspectives on layered cuts, caramel balayage, hydra-glow skincare, and bridal styling from our Rajkot ladies studio.</p><div className="journal-intro__bottom"><span>HAIR · SKIN · BRIDAL</span><span>{BLOG_POSTS.length} stories to explore</span></div></section>
    <section className="journal-grid" aria-label="Latest articles">{BLOG_POSTS.map((post) => <BlogCard key={post.slug} post={post} />)}</section>
    <section className="journal-cta"><span className="journal-eyebrow">From inspiration to your next look</span><h2>Find your glow. Take a seat.</h2><p>Bring your ideas to Joie Salon, Jyoti Nagar Main Road, Behind Crystal Mall, Rajkot.</p><a href="/#contact" className="journal-button">Plan your visit ↗</a></section>
  </>;
}
