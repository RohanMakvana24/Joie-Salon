'use client';

import { useCallback, useMemo, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { BUSINESS_INFO, FAITHFUL_REVIEWS } from '../data/barbershopData';
import './GoogleReviewsSection.css';

const AVATAR_COLORS = ['#1a73e8', '#a142f4', '#00897b', '#c5221f', '#e37400', '#455a64'];

const cleanQuote = (quote: string) =>
  quote
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^["“'']+|["”'']+$/g, '')
    .trim();

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

export function GoogleReviewsSection() {
  const reviews = useMemo(
    () =>
      FAITHFUL_REVIEWS.map((review, index) => ({
        ...review,
        quote: cleanQuote(review.verbatimQuote),
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
      })).filter((review) => review.quote.length > 0),
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const total = reviews.length;
  const active = reviews[activeIndex];

  const step = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) => (current + direction + total) % total);
    },
    [total],
  );

  if (!active) return null;

  return (
    <section id="google-reviews" aria-labelledby="google-reviews-heading" className="grev">
      <div className="grev__shell">
        <div
          className="grev__card"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') step(1);
            if (event.key === 'ArrowLeft') step(-1);
          }}
        >
          <div className="grev__intro">
            <span className="grev__badge">
              <FaGoogle aria-hidden="true" />
              Google Reviews
            </span>
            <h2 id="google-reviews-heading">
              What Rajkot says
              <br />
              <span>after the chair.</span>
            </h2>
            <p>
              Word-for-word reviews from the salon&rsquo;s Google listing &mdash; nothing rewritten, nothing borrowed.
            </p>
            <a
              className="grev__all"
              href={BUSINESS_INFO.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read all on Google
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div className="grev__stage">
            <article className="grev__quote" aria-live="polite" key={active.id}>
              <span className="grev__mark" aria-hidden="true">
                &ldquo;
              </span>
              <p className="grev__text">{active.quote}</p>
              <footer className="grev__person">
                <span className="grev__avatar" style={{ background: active.avatarColor }} aria-hidden="true">
                  {initialsOf(active.reviewerName)}
                </span>
                <div className="grev__person-info">
                  <strong>{active.reviewerName}</strong>
                  <span>{active.relativeDateSnapshot} &middot; Google review</span>
                </div>
              </footer>
            </article>

            <div className="grev__rail" role="tablist" aria-label="Choose a Google review">
              {reviews.map((review, index) => (
                <button
                  key={review.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Review by ${review.reviewerName}`}
                  className={`grev__chip${index === activeIndex ? ' is-active' : ''}`}
                  style={{ ['--chip' as string]: review.avatarColor }}
                  onClick={() => setActiveIndex(index)}
                >
                  {initialsOf(review.reviewerName)}
                </button>
              ))}
            </div>

            <div className="grev__controls">
              <button
                type="button"
                className="grev__nav"
                aria-label="Previous Google review"
                onClick={() => step(-1)}
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <span className="grev__count" aria-hidden="true">
                <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
                <span>/ {String(total).padStart(2, '0')}</span>
              </span>
              <button
                type="button"
                className="grev__nav"
                aria-label="Next Google review"
                onClick={() => step(1)}
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GoogleReviewsSection;
