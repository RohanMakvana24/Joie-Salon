import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPost, formatBlogDate, readingMinutes } from '../../../src/data/blogPosts';
import { BlogCard } from '../../../src/components/BlogCard';
import { BUSINESS_INFO } from '../../../src/data/barbershopData';
import { SITE_URL } from '../../../src/lib/seo';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return BLOG_POSTS.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return { title: 'Article not found | Joie Salon', robots: { index: false, follow: true } };
  const title = `${post.title} | Joie Salon Rajkot`;
  const url = SITE_URL ? `${SITE_URL}/blog/${post.slug}` : undefined;
  return { title, description: post.description,
    alternates: { canonical: url ?? null },
    openGraph: { title, description: post.description, type: 'article', publishedTime: `${post.publishedAt}T00:00:00+05:30`, ...(url ? { url, images: [{ url: `${SITE_URL}${post.image}`, alt: post.imageAlt }] } : {}) },
    twitter: { card: SITE_URL ? 'summary_large_image' : 'summary', title, description: post.description, ...(SITE_URL ? { images: [`${SITE_URL}${post.image}`] } : {}) },
  };
}

export default async function ArticlePage({ params }: Props) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const url = SITE_URL ? `${SITE_URL}/blog/${post.slug}` : undefined;
  const schema = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, datePublished: `${post.publishedAt}T00:00:00+05:30`, ...(url ? { mainEntityOfPage: url, image: `${SITE_URL}${post.image}` } : {}), publisher: { '@type': 'Organization', name: BUSINESS_INFO.name, ...(SITE_URL ? { url: SITE_URL } : {}) } };
  return <>
    <nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Journal</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span></nav>
    <article className="journal-article">
      <header className="journal-article__header"><span className="journal-eyebrow">{post.category}</span><h1>{post.title}</h1><p>{post.description}</p><div className="journal-meta"><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time><span>{readingMinutes(post)} min read</span></div></header>
      <figure className="journal-cover"><img src={post.image} alt={post.imageAlt} width={1200} height={700} fetchPriority="high" /><figcaption>Style illustration · not a photograph of a salon customer.</figcaption></figure>
      <div className="journal-reading"><aside className="journal-toc"><h2>In this story</h2><nav aria-label="Article contents">{post.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.heading}</a>)}</nav><Link href="/blog">← All stories</Link></aside><div className="journal-prose"><p className="journal-lead">{post.intro}</p>{post.sections.map((section) => <section key={section.id} id={section.id}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.tips && <ul>{section.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>}</section>)}<div className="journal-article-note">Published by Joie Salon. Discuss your preferred hair, skin, or bridal look with your stylist during consultation.</div></div></div>
    </article>
    <section className="journal-cta"><span className="journal-eyebrow">Your next look starts here</span><h2>Let’s talk about your next cut.</h2><p>Message us with your preferred service and time. Your appointment is confirmed when the salon replies.</p><a className="journal-button" href={BUSINESS_INFO.bookingUrl} target="_blank" rel="noopener noreferrer">Enquire on WhatsApp ↗</a></section>
    <section className="journal-related"><h2>Keep exploring</h2><div className="journal-grid">{BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 2).map((item) => <BlogCard key={item.slug} post={item} />)}</div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
  </>;
}
