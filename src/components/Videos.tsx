import { useEffect, useRef, useState } from 'react';
import { videos } from '../content';

function AutoVideo({ id, title }: { id: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  // Only start loading/playing once the video scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // autoplay + mute are required together for browsers to allow autoplay.
  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1`;

  return (
    <div className="videoCard panel" ref={ref}>
      <div className="videoFrame">
        {show ? (
          <iframe
            src={src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="videoWait">Loading video…</div>
        )}
      </div>
    </div>
  );
}

export default function Videos() {
  return (
    <section className="section" id="watch">
      <div className="sectionHead">
        <span>WATCH</span>
        <h2>See it in action</h2>
        <p>Two short videos to get a feel for the work.</p>
      </div>
      <div className="videoGrid">
        {videos.map((v) => (
          <AutoVideo key={v.id} id={v.id} title={v.title} />
        ))}
      </div>
    </section>
  );
}
