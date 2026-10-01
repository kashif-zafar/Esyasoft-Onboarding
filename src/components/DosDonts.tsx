import { seniorDonts, seniorDos } from '../content';

export default function DosDonts() {
  return (
    <section className="section" id="advice">
      <div className="sectionHead">
        <span>SENIOR ADVICE</span>
        <h2>Do&rsquo;s and Don&rsquo;ts during your stay</h2>
        <p>
          Daily timings, house rules and etiquette for your accommodation,
          from seniors who were in your seat not long ago.
        </p>
      </div>
      <div className="helpGrid">
        <div className="panel pad dos">
          <h3>Do: Daily routine &amp; etiquette</h3>
          <ul>
            {seniorDos.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="panel pad donts">
          <h3>Don&rsquo;t: House rules to respect</h3>
          <ul>
            {seniorDonts.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
