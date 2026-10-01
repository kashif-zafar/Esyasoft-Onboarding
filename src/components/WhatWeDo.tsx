import { businessHeads, coreValues } from '../content';
import GlobalPresence from './GlobalPresence';

function Anim({ k }: { k: string }) {
  if (k === 'metering') {
    return (
      <svg viewBox="0 0 240 130" className="anim" role="img" aria-label="A smart meter sending readings to the cloud">
        <rect x="20" y="30" width="80" height="80" rx="14" className="a-body" />
        <circle cx="60" cy="68" r="26" className="a-dial" />
        <line x1="60" y1="68" x2="60" y2="47" className="a-needle" />
        <rect x="42" y="98" width="36" height="6" rx="3" className="a-ink" />
        <path d="M100 60 C 130 60, 140 40, 170 40" className="a-path" />
        <circle r="5" className="a-dot d1"><animateMotion dur="2.4s" repeatCount="indefinite" path="M100 60 C 130 60, 140 40, 170 40" /></circle>
        <circle r="5" className="a-dot d2"><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M100 60 C 130 60, 140 40, 170 40" /></circle>
        <g className="a-cloud">
          <ellipse cx="195" cy="45" rx="30" ry="16" />
          <ellipse cx="178" cy="50" rx="16" ry="11" />
          <ellipse cx="212" cy="50" rx="15" ry="10" />
        </g>
        <text x="195" y="85" textAnchor="middle" className="a-label">Utility</text>
        <text x="195" y="100" textAnchor="middle" className="a-label">every few minutes</text>
      </svg>
    );
  }
  if (k === 'ev') {
    return (
      <svg viewBox="0 0 240 130" className="anim" role="img" aria-label="An electric car charging">
        <rect x="14" y="30" width="34" height="70" rx="8" className="a-body" />
        <rect x="22" y="40" width="18" height="12" rx="3" className="a-screen" />
        <path d="M48 75 C 70 75, 70 95, 92 95" className="a-cable" />
        <path d="M48 75 C 70 75, 70 95, 92 95" className="a-flow" />
        <g className="a-car">
          <rect x="92" y="70" width="130" height="34" rx="12" className="a-carbody" />
          <path d="M112 70 L128 48 H184 L202 70 Z" className="a-carbody" />
          <path d="M122 68 L134 53 H154 V68 Z M160 68 V53 H180 L192 68 Z" className="a-glass" />
          <circle cx="122" cy="104" r="12" className="a-wheel" />
          <circle cx="196" cy="104" r="12" className="a-wheel" />
        </g>
        <rect x="112" y="12" width="90" height="16" rx="8" className="a-battery" />
        <rect x="114" y="14" width="86" height="12" rx="6" className="a-fill" />
        <text x="157" y="8" textAnchor="middle" className="a-label">battery filling up</text>
      </svg>
    );
  }
  if (k === 'bess') {
    return (
      <svg viewBox="0 0 240 130" className="anim" role="img" aria-label="Solar energy stored in a battery and used by a house">
        <g className="a-sun">
          <circle cx="32" cy="30" r="14" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="32" y1="8" x2="32" y2="2" transform={`rotate(${a} 32 30)`} />
          ))}
        </g>
        <path d="M46 42 C 70 60, 80 70, 96 76" className="a-path" />
        <circle r="5" className="a-dot d1"><animateMotion dur="2s" repeatCount="indefinite" path="M46 42 C 70 60, 80 70, 96 76" /></circle>
        <rect x="96" y="50" width="70" height="56" rx="10" className="a-body" />
        <rect x="126" y="44" width="10" height="7" className="a-ink" />
        <rect x="104" y="92" width="54" height="8" rx="3" className="a-cell c1" />
        <rect x="104" y="80" width="54" height="8" rx="3" className="a-cell c2" />
        <rect x="104" y="68" width="54" height="8" rx="3" className="a-cell c3" />
        <rect x="104" y="56" width="54" height="8" rx="3" className="a-cell c4" />
        <path d="M166 78 C 186 78, 190 84, 200 84" className="a-path" />
        <circle r="5" className="a-dot d2"><animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M166 78 C 186 78, 190 84, 200 84" /></circle>
        <path d="M200 96 V70 L218 56 L236 70 V96 Z" className="a-house" />
        <rect x="212" y="80" width="12" height="16" className="a-ink" />
        <text x="130" y="122" textAnchor="middle" className="a-label">store now, use later</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 130" className="anim" role="img" aria-label="Gas flowing through a pipe and a gas meter">
      <rect x="0" y="78" width="240" height="16" className="a-pipe" />
      <rect x="0" y="78" width="240" height="16" className="a-gasflow" />
      <rect x="92" y="34" width="56" height="52" rx="10" className="a-body" />
      <circle cx="120" cy="58" r="16" className="a-dial" />
      <line x1="120" y1="58" x2="120" y2="46" className="a-needle" />
      <rect x="106" y="22" width="8" height="14" className="a-ink" />
      <rect x="126" y="22" width="8" height="14" className="a-ink" />
      <g className="a-flame" transform="translate(196 48)">
        <path d="M0 30 C -16 22, -10 6, 0 -14 C 4 -2, 16 6, 12 22 C 10 28, 4 32, 0 30 Z" />
        <path d="M2 30 C -6 26, -4 16, 2 8 C 6 14, 10 20, 6 26 Z" className="inner" />
      </g>
      <g className="a-wifi">
        <path d="M40 40 a24 24 0 0 1 34 0" />
        <path d="M48 48 a12 12 0 0 1 18 0" />
        <circle cx="57" cy="56" r="2.5" />
      </g>
      <text x="120" y="118" textAnchor="middle" className="a-label">measure · send · alert</text>
    </svg>
  );
}

export default function WhatWeDo() {
  return (
    <section className="section" id="what">
      <div className="sectionHead">
        <span>START HERE</span>
        <h2>What Esyasoft does</h2>
        <p>
          Esyasoft works in the energy and utility space: making electricity,
          gas and energy storage smarter and easier to measure, manage and
          bill. Four main heads cover it. Hover or tap any card to see the
          idea in motion.
        </p>
      </div>

      <GlobalPresence />

      <div className="headGrid">
        {businessHeads.map((h, i) => (
          <article className={`headCard panel ${h.key}`} key={h.key} tabIndex={0}>
            <div className="headNo">
              {h.icon} <b>{String(i + 1).padStart(2, '0')}</b>
            </div>
            <h3>{h.name}</h3>
            <p className="tagline">{h.tagline}</p>
            <div className="animBox">
              <Anim k={h.key} />
            </div>
            <p>{h.plain}</p>
            <p className="analogy">{h.analogy}</p>
            <ol className="flow">
              {h.flow.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="see">
              <b>You will see:</b> {h.youWillSee}
            </p>
          </article>
        ))}
      </div>

      <div className="valuesBox">
        <h3>Our 3 core values</h3>
        <ul className="valuesList">
          {coreValues.map((v, i) => (
            <li key={v} className="panel">
              <b>{String(i + 1).padStart(2, '0')}</b> {v}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
