import React, { useRef, useState } from 'react';
import { ArrowUpRight, Calendar, Check, Copy, Instagram, Scissors, Users, MessageCircle } from 'lucide-react';
import { SkeletonImage } from './ui/skeleton-image';
import { BUSINESS_INFO } from '../data/barbershopData';
import './MeetYourBarberSection.css';

const CONSULTATION_TOPICS = [
  { id: 'haircut-blowdry', label: 'Layer Cut & Blow-Dry', summary: 'a tailored layer cut and blow-dry' },
  { id: 'color-keratin', label: 'Balayage & Keratin', summary: 'hair colour, balayage, or keratin care' },
  { id: 'facial-beauty', label: 'Hydra Facial & Brows', summary: 'a hydra-glow facial and eyebrow shaping' },
  { id: 'bridal-nails', label: 'Bridal Glam & Nails', summary: 'bridal makeup or gel nail art' },
];
const CRAFT_POINTS = [
  { icon: MessageCircle, title: 'We listen first', detail: 'Your hair. Your skin.' },
  { icon: Scissors, title: 'Crafted for you', detail: 'A finish that feels effortless.' },
  { icon: Users, title: 'Ladies sanctuary', detail: 'Calm studio. Personal care.' },
];

export const MeetYourBarberSection: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['haircut-blowdry']);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const stageRef = useRef<HTMLDivElement>(null);

  const handleStageMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const stage = stageRef.current;
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = stage.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    stage.style.setProperty('--rx', `${(-ny * 5.5).toFixed(2)}deg`);
    stage.style.setProperty('--ry', `${(nx * 6.5).toFixed(2)}deg`);
  };

  const resetStageTilt = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty('--rx', '0deg');
    stage.style.setProperty('--ry', '0deg');
  };
  const toggleTopic = (id: string) => {
    setSelectedTopics(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    setCopyStatus('idle');
  };
  const selectedServices = CONSULTATION_TOPICS.filter(topic => selectedTopics.includes(topic.id));
  const bookingNote = selectedServices.length
    ? `Hi Joie Salon, I would like to book ${selectedServices.map(topic => topic.summary).join(' and ')}.`
    : 'Hi Joie Salon, I would like to book an appointment.';
  const bookingUrl = `${BUSINESS_INFO.bookingUrl}?text=${encodeURIComponent(bookingNote)}`;
  const copyNote = async () => {
    try { await navigator.clipboard.writeText(bookingNote); setCopyStatus('copied'); }
    catch { setCopyStatus('error'); }
  };

  return (
    <section id="about" aria-labelledby="about-heading" className="meet-salon">
      <div className="meet-salon__inner">
        <header className="meet-salon__header">
          <div><p className="meet-salon__eyebrow">A LITTLE ABOUT YOUR NEXT FAVOURITE PLACE</p><h2 id="about-heading">Meet Your <span>Salon.</span></h2></div>
          <a className="meet-salon__instagram" href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit Joie Salon on Instagram"><Instagram size={15} /><span>{BUSINESS_INFO.instagramHandle}</span><ArrowUpRight size={16} /></a>
        </header>

        <div className="meet-salon__story">
          <div className="meet-salon__copy">
            <span className="meet-salon__place"><span /> JOIE SALON · JYOTI NAGAR</span>
            <h3>Effortless glam.<br /><span>Timeless grace.</span></h3>
            <p>A bouncy blowout for your week. A radiant bridal trial for your wedding day. A warm consultation before every session.</p>
            <p>We shape every look around your face, your hair texture, and what makes you feel most confident.</p>
            <div className="meet-salon__craft">
              {CRAFT_POINTS.map(({ icon: Icon, title, detail }) => <div key={title}><span><Icon size={17} strokeWidth={1.5} /></span><div><strong>{title}</strong><p>{detail}</p></div></div>)}
            </div>
          </div>
          <div
            ref={stageRef}
            className="meet-salon__stage"
            onPointerMove={handleStageMove}
            onPointerLeave={resetStageTilt}
          >
            <div className="meet-salon__rig">
              <div className="meet-salon__arch" aria-hidden="true">
                <div className="meet-salon__arch-rim" />
              </div>
              <div className="meet-salon__pedestal" aria-hidden="true" />
              <div className="meet-salon__floor" aria-hidden="true" />
              <div className="meet-salon__model">
                <SkeletonImage skeletonClassName="image-skeleton--portrait" src="/assets/characters/women-salon-3d.webp" alt="Three stylish 3D women characters with freshly styled hair, glowing skin, and festive bridal elegance standing together" loading="lazy" decoding="async" width="1024" height="1024" />
              </div>
              <span className="meet-salon__sticker"><Scissors size={14} aria-hidden="true" /> A little radiance<br /><strong>feels good every day.</strong></span>
            </div>
            <span className="meet-salon__stage-caption">HAIR · SKIN <span>·</span> BRIDAL STUDIO</span>
          </div>
        </div>

        <div className="meet-salon__planner">
          <div className="meet-salon__services">
            <div className="meet-salon__planner-title"><span className="meet-salon__step">01</span><div><h3>What look are we crafting?</h3><p>Pick one or more services. We’ll take it from here.</p></div></div>
            <div className="meet-salon__topics" role="group" aria-label="Choose services">
              {CONSULTATION_TOPICS.map(topic => <button type="button" key={topic.id} aria-pressed={selectedTopics.includes(topic.id)} onClick={() => toggleTopic(topic.id)}><span className="meet-salon__checkbox">{selectedTopics.includes(topic.id) && <Check size={12} />}</span>{topic.label}</button>)}
            </div>
            <span className="meet-salon__selected" aria-live="polite">{selectedTopics.length ? `${selectedTopics.length} ${selectedTopics.length === 1 ? 'service' : 'services'} selected` : 'Not sure? Start a conversation with us.'}</span>
          </div>
          <div className="meet-salon__booking">
            <div className="meet-salon__planner-title"><span className="meet-salon__step">02</span><div><h3>Let’s save you a chair.</h3><p>Your message is ready to go.</p></div></div>
            <p className="meet-salon__note">“{bookingNote}”</p>
            <div className="meet-salon__actions"><button type="button" onClick={copyNote} aria-label="Copy booking note">{copyStatus === 'copied' ? <Check size={15} /> : <Copy size={15} />}{copyStatus === 'copied' ? 'Copied' : 'Copy note'}</button><a href={bookingUrl} target="_blank" rel="noopener noreferrer"><Calendar size={16} /> Booking <ArrowUpRight size={15} /></a></div>
            {copyStatus === 'error' && <p className="meet-salon__copy-error" role="status">Couldn’t copy. Your message will still open on WhatsApp.</p>}
          </div>
        </div>
      </div>
    </section>
  );
};
