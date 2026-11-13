import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Clock3, Crown, Scissors, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import './BookingPlanner.css';

const MODES = [
  { id: 'salon', title: 'The salon chair', caption: 'Your everyday refresh', icon: Scissors },
  { id: 'wedding', title: 'The wedding edit', caption: 'Groom & wedding party', icon: Crown },
  { id: 'event', title: 'Beyond the salon', caption: 'Barber for your event', icon: Sparkles },
] as const;
type Mode = typeof MODES[number]['id'];
const SERVICES: Record<Mode, string[]> = {
  salon: ['Haircut & styling', 'Fade & taper', 'Beard & shave', 'Haircut + beard', 'Kids haircut', 'Skin & grooming'],
  wedding: ['Groom makeover', 'Wedding party grooming', 'Groom + wedding party', 'Pre-wedding grooming'],
  event: ['Event barber service', 'Family function grooming', 'Group grooming', 'Other occasion'],
};
function indiaNow() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const part = (name: string) => parts.find(p => p.type === name)?.value ?? '';
  return { date: `${part('year')}-${part('month')}-${part('day')}`, time: `${part('hour')}:${part('minute')}` };
}
function readableDate(date: string) {
  return date ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`)) : 'Choose your date';
}

export function BookingPlanner() {
  const [mode, setMode] = useState<Mode>('salon');
  const [service, setService] = useState(SERVICES.salon[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [today, setToday] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState('1');
  const [venue, setVenue] = useState('');
  const [location, setLocation] = useState('At your venue');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);
  useEffect(() => { setToday(indiaNow().date); }, []);
  const special = mode !== 'salon';
  const selectedMode = MODES.find(item => item.id === mode)!;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = indiaNow();
    setToday(now.date);
    if (date < now.date || (date === now.date && time <= now.time)) {
      setError('Please choose a future date and time (India time).');
      return;
    }
    if (!/^[+\d\s()-]+$/.test(phone) || phone.replace(/\D/g, '').length < 10 || phone.replace(/\D/g, '').length > 15) {
      setError('Please enter a valid contact number with at least 10 digits.');
      return;
    }
    setError('');
    const message = [
      'Hi Classic Cut Salon! I would like to request a booking.',
      '', `Booking: ${selectedMode.title}`, `Service: ${service}`,
      `Preferred date: ${readableDate(date)}`, `Preferred time: ${time} IST`,
      `Name: ${name.trim()}`, `Contact: ${phone.trim()}`,
      ...(special ? [`People: ${guests}`, `Location: ${location}`, ...(location === 'At your venue' ? [`Venue / address: ${venue.trim()}`] : [])] : []),
      ...(notes.trim() ? [`Notes: ${notes.trim()}`] : []),
      '', 'Please confirm availability and pricing. Thank you!',
    ].join('\n');
    window.open(`${BUSINESS_INFO.bookingUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setOpened(true);
  }
  return (
    <div className="booking-planner" id="booking" aria-labelledby="booking-heading">
      <div className="booking-planner__intro">
        <p className="salon-visit__eyebrow">A FRESH CUT. A BIG DAY. YOUR MOMENT.</p>
        <h3 id="booking-heading">Good looks.<br /><em>Great plans.</em></h3>
        <p>From your favourite chair to your wedding venue. Let’s plan a little time to look your best.</p>
        <div className="booking-planner__ticket" aria-live="polite">
          <span className="booking-planner__ticket-label">YOUR GROOMING ITINERARY <Scissors size={16} /></span>
          <strong>{service}</strong>
          <span>{selectedMode.title}</span>
          <div className="booking-planner__ticket-rule" />
          <div><span>WHEN</span><b>{readableDate(date)}</b><small>{time ? `${time} · India time` : 'Your preferred time'}</small></div>
          <div><span>WHERE</span><b>{special && location === 'At your venue' ? venue || 'Your event venue' : 'Classic Cut Salon'}</b><small>{special ? `${guests} ${guests === '1' ? 'person' : 'people'} · By arrangement` : 'Arya Nagar, Rajkot'}</small></div>
          <span className="booking-planner__ticket-foot"><Clock3 size={13} /> A request today. A fresh look ahead.</span>
        </div>
        <a className="salon-visit__link" href={BUSINESS_INFO.phoneHref}>Prefer a conversation? {BUSINESS_INFO.phoneDisplay} <ArrowUpRight size={14} /></a>
      </div>
      <form className="booking-planner__form" onSubmit={submit} onChange={() => { setOpened(false); setError(''); }}>
        <fieldset className="booking-planner__modes">
          <legend><span>01</span> What are we planning?</legend>
          <div>{MODES.map(({ id, title, caption, icon: Icon }) => <label key={id} className={mode === id ? 'is-selected' : ''}>
            <input type="radio" name="booking-kind" value={id} checked={mode === id} onChange={() => { setMode(id); setService(SERVICES[id][0]); }} />
            <Icon size={21} strokeWidth={1.5} /><strong>{title}</strong><small>{caption}</small><Check className="booking-planner__mode-check" size={13} />
          </label>)}</div>
        </fieldset>
        <fieldset>
          <legend><span>02</span> Make it yours</legend>
          <div className="booking-planner__fields">
            <label className="booking-planner__wide">{special ? 'Grooming experience' : 'Choose your service'}<select value={service} onChange={e => setService(e.target.value)}>{SERVICES[mode].map(item => <option key={item}>{item}</option>)}</select></label>
            <label>Preferred date<input aria-label="Preferred date" type="date" required min={today || undefined} value={date} onChange={e => setDate(e.target.value)} /></label>
            <label>Preferred time · IST<input aria-label="Preferred time in India" type="time" required value={time} onChange={e => setTime(e.target.value)} /></label>
            {special && <>
              <label>Number of people<input type="number" required min="1" max="500" value={guests} onChange={e => setGuests(e.target.value)} /></label>
              <label>Where should we meet?<select value={location} onChange={e => setLocation(e.target.value)}><option>At your venue</option><option>At the salon</option></select></label>
              {location === 'At your venue' && <label className="booking-planner__wide">Venue / full address<input required maxLength={300} placeholder="Venue name, area and city" value={venue} onChange={e => setVenue(e.target.value)} /></label>}
            </>}
          </div>
          <p className="booking-planner__hint"><Clock3 size={12} /> Pick your preference. We’ll confirm timing{special ? ', travel and the package' : ' and pricing'} with you.</p>
        </fieldset>
        <fieldset>
          <legend><span>03</span> A little about you</legend>
          <div className="booking-planner__fields">
            <label>Your name<input autoComplete="name" required maxLength={80} pattern=".*\S.*" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} /></label>
            <label>Contact number<input type="tel" autoComplete="tel" required maxLength={20} placeholder="Your mobile number" value={phone} onChange={e => setPhone(e.target.value)} /></label>
            <label className="booking-planner__wide">Anything else? <span className="booking-planner__optional">(optional)</span><textarea rows={2} maxLength={800} placeholder={special ? 'Event details, ready-by time or a special request…' : 'A style you love or a special request…'} value={notes} onChange={e => setNotes(e.target.value)} /></label>
          </div>
        </fieldset>
        {error && <p className="booking-planner__error" role="alert">{error}</p>}
        <button className="booking-planner__submit" type="submit">Let’s plan your look <ArrowUpRight size={19} /></button>
        <p className="booking-planner__disclaimer">Continue on WhatsApp · Your booking is confirmed after the salon replies.</p>
        {opened && <p className="booking-planner__success" role="status"><Check size={15} /> WhatsApp opened with your details. Send the message to request your booking.</p>}
      </form>
    </div>
  );
}
