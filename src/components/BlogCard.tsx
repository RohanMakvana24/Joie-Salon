import Link from 'next/link';
import { type BlogPost, formatBlogDate, readingMinutes } from '../data/blogPosts';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="journal-card">
      <Link href={`/blog/${post.slug}`} className="journal-card__image" tabIndex={-1} aria-hidden="true">
        <img src={post.image} alt="" width={640} height={480} loading="lazy" />
      </Link>
      <div className="journal-card__body">
        <span className="journal-eyebrow">{post.category}</span>
        <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
        <p>{post.description}</p>
        <div className="journal-meta"><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time><span>{readingMinutes(post)} min read</span></div>
        <Link className="journal-text-link" href={`/blog/${post.slug}`}>Read the story <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  );
}
