import { MapPin } from 'lucide-react';

const routes = [
  { landmark: 'Akashvani Chowk', path: 'M400 44 Q185 28 144 172', side: 'left' },
  { landmark: 'Crystal Mall', path: 'M400 44 Q615 28 656 172', side: 'right' },
] as const;

export function SalonCrowdScene() {
  return (
    <div className="joie-route-scene" aria-hidden="true">
      <div className="joie-hero__crowd">
        {Array.from({ length: 8 }, (_, index) => (
          <img key={index} src={`/assets/joie-crowd/person-${index % 3}.svg`} alt="" width={175} height={225} decoding="async" />
        ))}
      </div>
      <div className="joie-hero__beacon">
        <span className="joie-hero__icon"><img src="/assets/brand/joie-salon-icon-gold.webp" alt="" width={52} height={52} /></span>
      </div>
      <div className="joie-route-scene__dispatch">
        <span><MapPin size={13} /> Directions</span>
        <i>Pedak Cross Road, Arya Nagar</i>
      </div>
      {routes.map(({ landmark, path, side }) => (
        <div key={landmark} className={`joie-route-cycle joie-route-cycle--${side}`}>
          <svg className="joie-route-cycle__beam" viewBox="0 0 800 275" preserveAspectRatio="none">
            <path d={path} pathLength="1" />
            <circle r="6">
              <animateMotion dur="16s" repeatCount="indefinite" path={path}
                keyPoints="0;0;1;1;0;0" keyTimes={side === 'left' ? '0;.18;.24;.34;.39;1' : '0;.68;.74;.84;.89;1'} calcMode="linear" />
            </circle>
          </svg>
          <div className="joie-route-cycle__visitor">
            <div className="joie-route-cycle__bubble">
              <span className="joie-route-cycle__question"><b>{landmark}</b> Where is Joie Salon?</span>
              <span className="joie-route-cycle__answer"><b>Route found</b> See you at Joie!</span>
            </div>
            <div className="joie-route-cycle__person">
              <img src={`/assets/joie-crowd/person-${side === 'left' ? 0 : 1}.svg`} alt="" width={175} height={225} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

