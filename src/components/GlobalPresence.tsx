import { useState } from 'react';
import { globalPresence } from '../content';
import { LAND_DOTS, MAP_H, MAP_W, project } from './worldMapData';

/** Dot-matrix world map with Esyasoft office locations. */
export default function GlobalPresence() {
  const [active, setActive] = useState<number | null>(null);

  const pins = globalPresence.offices.map((o) => {
    const [x, y] = project(o.lon, o.lat);
    return { ...o, x, y };
  });
  const hq = pins.find((p) => p.hq) ?? pins[0];

  /* Curved connection lines from the HQ to every other office */
  const arcs = pins
    .filter((p) => p !== hq)
    .map((p) => {
      const mx = (hq.x + p.x) / 2;
      const my = (hq.y + p.y) / 2;
      const dist = Math.hypot(p.x - hq.x, p.y - hq.y);
      return { name: p.name, d: `M${hq.x} ${hq.y} Q${mx} ${my - dist * 0.28} ${p.x} ${p.y}` };
    });

  return (
    <div className="presenceBox panel pad">
      <h3>{globalPresence.title}</h3>
      <p>{globalPresence.text}</p>

      <ul className="presenceStats">
        <li><b>10+</b> countries</li>
        <li><b>HQ</b> in the UAE</li>
        <li><b>Power · Gas · Water</b> utilities</li>
      </ul>

      <div className="presenceGrid">
        <div className="mapWrap">
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            role="img"
            aria-label={`World map showing Esyasoft offices in ${pins.map((p) => p.name).join(', ')}`}
          >
            <path className="mapLand" d={LAND_DOTS} />

            {arcs.map((a) => (
              <path
                key={a.name}
                d={a.d}
                className={`mapArc${active !== null && pins[active].name === a.name ? ' on' : ''}`}
              />
            ))}

            {pins.map((p, i) => (
              <g
                key={p.name}
                className={`mapPin${p.hq ? ' hq' : ''}${active === i ? ' on' : ''}`}
                transform={`translate(${p.x} ${p.y})`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {p.hq && <circle className="pulse" r="14" />}
                <circle className="dot" r={p.hq ? 14 : 11} />
                <text y="1" textAnchor="middle" dominantBaseline="middle">
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <ol className="presenceList">
          {pins.map((p, i) => (
            <li
              key={p.name}
              className={active === i ? 'on' : ''}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <b>{i + 1}</b>
              <span>{p.name}</span>
              {p.hq && <em>HQ</em>}
            </li>
          ))}
        </ol>
      </div>

      <p className="presenceNote">The map shows a selection of locations.</p>
    </div>
  );
}
