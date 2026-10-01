import { useEffect, useState } from "react";
import { places, tripTips, type Place } from "../content";

/* ------------------------------------------------------------------ */
/* Photo lookup                                                        */
/*                                                                     */
/* Each place lists exact Wikipedia article titles. We only accept an  */
/* article's own lead photo (no fuzzy search, which used to return the */
/* wrong page). Every photo is identified by its file name, and a file */
/* is never assigned to two places. If nothing usable is found we fall */
/* back to a Wikimedia Commons photo search, then to the emoji tile.   */
/* ------------------------------------------------------------------ */

type Photo = { key: string; url: string };

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

// Maps, logos, flags and diagrams are not photos of the place.
const NOT_A_PHOTO =
  /\.svg|\.gif|\.png|map|logo|flag|locator|coat[_ ]of|emblem|diagram|symbol|icon/i;

const articleCache = new Map<string, Promise<Photo | null>>();
const commonsCache = new Map<string, Promise<Photo[]>>();
const fileCache = new Map<string, Promise<Photo | null>>();

function articlePhoto(title: string): Promise<Photo | null> {
  let hit = articleCache.get(title);
  if (!hit) {
    hit = (async () => {
      try {
        const url =
          `${WIKI_API}?action=query&prop=pageimages&piprop=thumbnail|name` +
          `&pithumbsize=640&redirects=1&format=json&origin=*` +
          `&titles=${encodeURIComponent(title)}`;
        const data = await (await fetch(url)).json();
        const pages = Object.values(data?.query?.pages || {}) as any[];
        const page = pages.find((p) => p.thumbnail?.source && p.pageimage);
        if (!page || NOT_A_PHOTO.test(page.pageimage)) return null;
        return { key: String(page.pageimage), url: page.thumbnail.source };
      } catch {
        return null;
      }
    })();
    articleCache.set(title, hit);
  }
  return hit;
}

function commonsFile(file: string): Promise<Photo | null> {
  const cacheKey = "file:" + file;
  let hit = fileCache.get(cacheKey);
  if (!hit) {
    hit = (async () => {
      try {
        const url =
          `${COMMONS_API}?action=query&prop=imageinfo&iiprop=url|mime&iiurlwidth=640` +
          `&format=json&origin=*&titles=${encodeURIComponent("File:" + file)}`;
        const data = await (await fetch(url)).json();
        const page = (Object.values(data?.query?.pages || {}) as any[])[0];
        const info = page?.imageinfo?.[0];
        if (!info?.thumburl) return null;
        return { key: file.replace(/ /g, "_"), url: info.thumburl };
      } catch {
        return null;
      }
    })();
    fileCache.set(cacheKey, hit);
  }
  return hit;
}

function commonsPhotos(query: string): Promise<Photo[]> {
  let hit = commonsCache.get(query);
  if (!hit) {
    hit = (async () => {
      try {
        const url =
          `${COMMONS_API}?action=query&generator=search&gsrnamespace=6&gsrlimit=8` +
          `&gsrsearch=${encodeURIComponent(query)}` +
          `&prop=imageinfo&iiprop=url|mime&iiurlwidth=640&format=json&origin=*`;
        const data = await (await fetch(url)).json();
        const pages = Object.values(data?.query?.pages || {}) as any[];
        pages.sort((a, b) => (a.index || 0) - (b.index || 0));
        return pages
          .filter((p) => {
            const info = p.imageinfo?.[0];
            return (
              info?.mime === "image/jpeg" &&
              info.thumburl &&
              !NOT_A_PHOTO.test(p.title || "")
            );
          })
          .map((p) => ({ key: String(p.title), url: p.imageinfo[0].thumburl }));
      } catch {
        return [];
      }
    })();
    commonsCache.set(query, hit);
  }
  return hit;
}

// Resolves photos for all places in order so no two places share a photo.
async function resolveAllPhotos(
  list: Place[],
): Promise<Record<string, string | null>> {
  const used = new Set<string>();
  const result: Record<string, string | null> = {};

  // Start every article lookup in parallel; assign results in list order.
  const lookups = list.map((p) =>
    Promise.all([
      ...(p.photoFile ? [commonsFile(p.photoFile)] : []),
      ...p.photoTitles.map(articlePhoto),
    ]),
  );

  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    const candidates = (await lookups[i]).filter((c): c is Photo => !!c);

    let pick = candidates.find((c) => !used.has(c.key));
    if (!pick) {
      const fallback = await commonsPhotos(p.commonsQuery);
      pick = fallback.find((c) => !used.has(c.key));
    }

    if (pick) used.add(pick.key);
    result[p.name] = pick ? pick.url : null;
  }

  return result;
}

function PlaceCard({ p, img }: { p: Place; img: string | null | undefined }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [img]);

  const map = `https://www.google.com/maps/search/${encodeURIComponent(p.name + " " + (p.zone === "Mangaluru" ? "Mangaluru" : p.zone === "Udupi side" ? "Udupi" : "Karkala"))}`;

  return (
    <article className="placeCard panel">
      <div className="placePhoto">
        {img && !failed ? (
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="placeFallback" aria-hidden="true">
            {p.emoji}
          </div>
        )}
        <span className="zoneTag">{p.zone}</span>
      </div>
      <div className="placeBody">
        <h3>{p.name}</h3>
        <small>{p.kind}</small>
        <p>{p.why}</p>
        <p className="ptip">
          <b>Tip:</b> {p.tip}
        </p>
        <a href={map} target="_blank" rel="noreferrer" className="mapLink">
          Open in Maps ↗
        </a>
      </div>
    </article>
  );
}

export default function Places() {
  const [photos, setPhotos] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let live = true;
    resolveAllPhotos(places).then((r) => live && setPhotos(r));
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className="placesWrap">
      <h3 className="subhead">Weekend places to explore</h3>
      <div className="placeGrid">
        {places.map((p) => (
          <PlaceCard key={p.name} p={p} img={photos[p.name]} />
        ))}
      </div>
      <p className="note">Photos load from Wikipedia/Wikimedia Commons.</p>

      {/* <div className="panel pad tripTips">
        <h3>Before you go</h3>
        <ul>
          {tripTips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
