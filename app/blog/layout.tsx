import Link from 'next/link';
import { BUSINESS_INFO } from '../../src/data/barbershopData';
import { BlogChrome } from '../../src/components/BlogChrome';
import './blog.css';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogChrome>
      <main id="journal-main">{children}</main>
      <footer className="journal-footer"><div><Link href="/">Classic Cut Salon</Link><p>{BUSINESS_INFO.streetAddress}, {BUSINESS_INFO.locality}, {BUSINESS_INFO.region} {BUSINESS_INFO.postalCode}</p></div><nav aria-label="Contact links"><a href={BUSINESS_INFO.phoneHref}>{BUSINESS_INFO.phoneDisplay}</a><a href={BUSINESS_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer">Get directions ↗</a></nav></footer>
    </BlogChrome>
  );
}
