import Link from 'next/link';

export default function ArticleNotFound() {
  return <section className="journal-intro"><span className="journal-eyebrow">Story not found</span><h1>This page has<br />left the chair.</h1><p>The article may have moved. Browse our journal for hair, skincare, and bridal styling guides.</p><Link className="journal-button" href="/blog">Back to the journal ↗</Link></section>;
}
