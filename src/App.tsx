import { Show, SignInButton, UserButton, useAuth, useUser } from "@clerk/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { allSessionIds, weeks } from "./data";
import {
  arc,
  areaKey,
  contacts,
  facilities,
  packing,
  recreation,
  support,
  travel,
} from "./content";
import WhatWeDo from "./components/WhatWeDo";
import Videos from "./components/Videos";
import Places from "./components/Places";
import DosDonts from "./components/DosDonts";
import EgpVsTrainee from "./components/EgpVsTrainee";

type Msg = {
  role: "user" | "assistant";
  text: string;
};

const setup = [
  ["Outlook", "Official communication, announcements and company email."],
  ["Microsoft Teams", "Team collaboration, chat and meetings."],
  [
    "Zoho People",
    "Attendance, leave, holidays, directory, KRA/goals, HR policies and feedback.",
  ],
];

const docs = [
  "Permanent/current address and emergency contact",
  "Academic background and graduation details",
  "PF, gratuity and insurance nominee details",
  "PAN, UAN (if available), Aadhaar and passport (if available)",
  "Bank details via cancelled cheque or passbook",
  "10th/12th marksheets and certificates",
  "Graduation/post-graduation certificates and consolidated marksheets",
  "For experienced hires: experience certificate, relieving letter, last 3 payslips and Form 16/tax certificate",
];

const suggestions = [
  "Tell me about onboarding.",
  "What database will I learn?",
  "Which documents do I need?",
];

function apiHeaders(token: string | null) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function App() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [done, setDone] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("esy_sessions_done") || "{}");
    } catch {
      return {};
    }
  });

  const [open, setOpen] = useState("01");
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("esy_sessions_done", JSON.stringify(done));
  }, [done]);

  const completedCount = allSessionIds.filter((id) => done[id]).length;

  const progress = allSessionIds.length
    ? Math.round((completedCount / allSessionIds.length) * 100)
    : 0;

  // First unfinished session across the entire journey.
  const nextSessionId = useMemo(
    () => allSessionIds.find((id) => !done[id]),
    [done],
  );

  // Every week's contents can be viewed at any time (even at 0% progress).
  // Only the PDF learning pack is gated: it opens once that week is complete.
  function isWeekComplete(weekIndex: number) {
    return weeks[weekIndex].sessions.every((session) => !!done[session.id]);
  }

  // Only ONE new session at a time can be completed.
  function canComplete(sessionId: string) {
    if (done[sessionId]) return true;
    return sessionId === nextSessionId;
  }

  // Unchecking an earlier completion resets all progress after that point.
  function toggleSession(sessionId: string, checked: boolean) {
    if (checked && !canComplete(sessionId)) return;

    if (!checked) {
      const index = allSessionIds.indexOf(sessionId);
      const updated = { ...done };

      allSessionIds.slice(index).forEach((id) => {
        delete updated[id];
      });

      setDone(updated);
      return;
    }

    setDone({ ...done, [sessionId]: true });
  }

  // UI helper: details of the next session to complete.
  const next = useMemo(() => {
    if (!nextSessionId) return null;

    for (const week of weeks) {
      const index = week.sessions.findIndex((s) => s.id === nextSessionId);
      if (index >= 0) return { week, session: week.sessions[index], index };
    }

    return null;
  }, [nextSessionId]);

  return (
    <div className="app">
      <a className="skip" href="#journey">
        Skip to the journey
      </a>

      <Header menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />

      {menuOpen && (
        <div className="mobileNav" onClick={() => setMenuOpen(false)}>
          <a href="#what">What we do</a>
          <a href="#setup">Setup</a>
          <a href="#journey">90 Days</a>
          <a href="#stay">Stay</a>
          <a href="#advice">Advice</a>
          <a href="#help">Help</a>
          <a href="#feedback">Feedback</a>
        </div>
      )}

      <main>
        <section className="hero panel" id="home">
          <div className="heroCopy">
            <div className="kicker">GREEN ENERGY / FIRST 90 DAYS</div>

            <h1>
              Your first <span>90 days</span>
              <br />
              at Esyasoft.
            </h1>

            <p>
              A guided onboarding journey from arrival and workplace setup to
              domain learning, technical depth, practical work and team
              transition.
            </p>

            <div className="actions">
              <a className="btn lime" href="#journey">
                Explore the journey
              </a>

              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="btn ink">
                    Sign in to unlock learning packs
                  </button>
                </SignInButton>
              </Show>

              <Show when="signed-in">
                <a className="btn ink" href="#journey">
                  Continue at {progress}%
                </a>
              </Show>
            </div>

            <div className="stats">
              <div className="stat">
                <b>{weeks.length}</b>
                <span>Weeks</span>
              </div>
              <div className="stat">
                <b>{allSessionIds.length}</b>
                <span>Sessions</span>
              </div>
              <div className="stat">
                <b>{progress}%</b>
                <span>Charged</span>
              </div>
            </div>
          </div>

          <EnergyArt />
        </section>

        <WhatWeDo />

        <EgpVsTrainee />

        <Videos />

        <section className="storyGrid" id="start">
          <ComicCard
            no="1"
            title="Arrive ready"
            text="Receive official credentials from Admin, settle into the training environment and know where to get help."
          />
          <ComicCard
            no="2"
            title="Connect your workplace"
            text="Activate Outlook, Teams and Zoho People. Complete your profile and joining records."
          />
          <ComicCard
            no="3"
            title="Build momentum"
            text="Move through domain, professional and technical learning before role-specific practice."
          />
        </section>

        <section className="section" id="setup">
          <SectionHead
            tag="SETUP ARC"
            title="Your first workplace systems"
            sub="Three tools anchor communication, collaboration and HR workflows."
          />

          <div className="cards">
            {setup.map((item, index) => (
              <div className="tool panel" key={item[0]}>
                <b>0{index + 1}</b>
                <h3>{item[0]}</h3>
                <p>{item[1]}</p>
              </div>
            ))}
          </div>

          <div className="split">
            <div className="panel pad">
              <h3>Zoho People quick map</h3>
              <p>
                Use it for daily check-in/check-out, leave and approvals,
                holidays, organization/team details, birthdays/events, KRA and
                goals, HR policies and feedback.
              </p>
            </div>

            <div className="panel pad">
              <h3>Joining document checklist</h3>
              {docs.map((document) => (
                <label className="check" key={document}>
                  <input type="checkbox" />
                  <span>{document}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="journey">
          <SectionHead
            tag="THE MAIN STORY"
            title="13 weeks. 52 sessions. One clear progression."
            sub="Browse any week's contents at any time. Complete every session in order; a week's PDF learning pack opens once all of that week's sessions are done."
          />

          <div className="arc">
            {arc.map((a) => (
              <div className={a.key} key={a.key}>
                <small>{a.label}</small>
                <b>{a.name}</b>
              </div>
            ))}
          </div>

          <div className="progress panel">
            <div>
              <b>{progress}% charged</b>
              <span>
                {completedCount} of {allSessionIds.length} sessions complete
              </span>
            </div>

            <div className="bar">
              <i style={{ width: progress + "%" }} />
            </div>
          </div>

          {next ? (
            <div className="nextUp panel">
              <div>
                <small>NEXT UP - WEEK {next.week.n}</small>
                <b>{next.session.title}</b>
                <span>{next.session.detail}</span>
              </div>

              <button
                className="btn ink small"
                onClick={() => {
                  setOpen(next.week.n);
                  document
                    .getElementById("journey")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Open week {next.week.n}
              </button>
            </div>
          ) : (
            <div className="nextUp panel">
              <div>
                <small>MISSION COMPLETE</small>
                <b>You are fully charged!</b>
                <span>
                  All {allSessionIds.length} sessions are complete. Welcome to
                  the team.
                </span>
              </div>
            </div>
          )}

          <div className="weeks">
            {weeks.map((week, weekIndex) => {
              const weekComplete = isWeekComplete(weekIndex);
              const weekDone = week.sessions.filter((s) => done[s.id]).length;

              return (
                <article
                  data-area={areaKey(week.area)}
                  className={
                    "week panel " +
                    (open === week.n ? "active " : "") +
                    (weekComplete ? "completedWeek" : "")
                  }
                  key={week.n}
                >
                  <button
                    className="weekTop"
                    aria-expanded={open === week.n}
                    onClick={() => setOpen(open === week.n ? "" : week.n)}
                  >
                    <span className="issue">W{week.n}</span>

                    <span>
                      <span className="areaTag">{week.area}</span>
                      <b>{week.title}</b>
                      <small>{week.desc}</small>
                      <small className="sessionCount">
                        {`${weekDone}/${week.sessions.length} sessions complete`}
                      </small>
                    </span>

                    <span className="plus">
                      {weekComplete ? "DONE" : open === week.n ? "−" : "+"}
                    </span>
                  </button>

                  {open === week.n && (
                    <div className="weekBody">
                      <div className="sessionList">
                        {week.sessions.map((session, sessionIndex) => {
                          const enabled = canComplete(session.id);
                          const completed = !!done[session.id];

                          return (
                            <label
                              className={
                                "sessionItem " +
                                (completed ? "done " : "") +
                                (!enabled ? "lockedSession" : "")
                              }
                              key={session.id}
                            >
                              <input
                                type="checkbox"
                                checked={completed}
                                disabled={!enabled}
                                onChange={(event) =>
                                  toggleSession(
                                    session.id,
                                    event.target.checked,
                                  )
                                }
                              />

                              <span className="sessionNo">
                                S{sessionIndex + 1}
                              </span>

                              <span>
                                <b>{session.title}</b>
                                <small>{session.detail}</small>

                                {!enabled && !completed && (
                                  <em>Complete the previous session first.</em>
                                )}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      <textarea
                        placeholder={`My notes for Week ${Number(week.n)}...`}
                        defaultValue={
                          localStorage.getItem("note_" + week.n) || ""
                        }
                        onBlur={(event) =>
                          localStorage.setItem(
                            "note_" + week.n,
                            event.target.value,
                          )
                        }
                      />

                      <div className="learningPackArea">
                        {!weekComplete ? (
                          <div className="locked">
                            Learning pack locked. Complete all{" "}
                            {week.sessions.length} sessions of Week{" "}
                            {Number(week.n)} ({weekDone}/{week.sessions.length}{" "}
                            done) to open the PDF.
                          </div>
                        ) : (
                          <>
                            <Show when="signed-out">
                              <div className="locked">
                                Week {Number(week.n)} is complete. Sign in to
                                open the PDF learning pack.
                              </div>
                            </Show>

                            <Show when="signed-in">
                              <a
                                className="btn lime"
                                href={week.pdf}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open Week {Number(week.n)} learning pack
                              </a>
                            </Show>
                          </>
                        )}
                      </div>

                      {weekComplete && (
                        <div className="locked">
                          Week {Number(week.n)} complete.
                          {weekIndex < weeks.length - 1
                            ? ` Continue with Week ${weekIndex + 2}.`
                            : " You have completed the full 90-day onboarding journey."}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="section" id="stay">
          <SectionHead
            tag="BASE CAMP"
            title="Stay, travel and reset"
            sub="Practical information for the training period."
          />

          <div className="cards">
            <ComicCard
              no="A"
              title="Accommodation"
              text="Room furniture, basic kitchen utensils and appliances including AC, TV, refrigerator, microwave/oven, kettle, induction, toaster, washing machine, geyser and ironing facilities."
            />
            <ComicCard
              no="B"
              title="Recreation"
              text="Gymnasium, table tennis, foosball and library. Bring toiletries, towels, medicines, hygiene items, mosquito repellent and an umbrella."
            />
            <ComicCard
              no="C"
              title="Training centre"
              text="Esyasoft Global Capability Center, Kolambe Proper, Karnataka 574142. Supplied guidance asks participants to reach by 5:00 PM."
            />
          </div>

          <div className="helpGrid">
            <div className="panel pad">
              <h3>What is in your room</h3>
              <div className="chips">
                {facilities.map((f) => (
                  <span className="chip lime" key={f}>
                    {f}
                  </span>
                ))}
              </div>

              <h4>Recreation</h4>
              <div className="chips">
                {recreation.map((f) => (
                  <span className="chip sky" key={f}>
                    {f}
                  </span>
                ))}
              </div>

              <h4>Pack these yourself</h4>
              <div className="chips">
                {packing.map((f) => (
                  <span className="chip sun" key={f}>
                    {f}
                  </span>
                ))}
              </div>
              <p className="note">
                🛒 Shops are under 500 mtr (for daily essentials)
              </p>
            </div>

            <div className="panel pad">
              <h3>Getting to the training centre</h3>
              <p>Arrive by 5:00 PM. Approximate distances:</p>

              <div className="route">
                {travel.map((t) => (
                  <div className="stop" key={t.place}>
                    <i />
                    <span>{t.place}</span>
                    <b>~{t.km} km</b>
                  </div>
                ))}
              </div>

              <p className="note">
                Approximate references from the supplied onboarding material,
                not live navigation data.
              </p>

              {/* <h4>Weekend places</h4> */}
              {/* <p className="note">See photos and tips for all 12 places below.</p> */}
            </div>
          </div>
        </section>

        <DosDonts />

        <section className="section" id="weekend">
          <Places />
        </section>

        <section className="section" id="help">
          <SectionHead
            tag="SIDEKICKS"
            title="Who to call for help"
            sub="Onboarding support, accommodation and travel contacts from the supplied information."
          />

          <div className="helpGrid">
            <div className="panel pad">
              <h3>Onboarding support</h3>
              <div className="contactList">
                {support.map((s) => (
                  <div className="contact" key={s.name}>
                    <b>{s.name}</b>
                    {s.role} - {s.note}
                    {s.contact && (
                      <>
                        <br />
                        <a href={`tel:${s.contact.replace(/\s/g, "")}`}>
                          {s.contact}
                        </a>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <p className="note">
                If the portal does not cover your question, contact HR, Admin,
                your trainer, mentor or reporting manager.
              </p>
            </div>

            <div className="panel pad">
              <h3>Accommodation and travel contacts</h3>
              <div className="contactList">
                {contacts.map((c) => (
                  <div className="contact" key={c.name}>
                    <b>{c.name}</b>
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
                    {c.email && (
                      <>
                        {" "}
                        <br />
                        <a href={`mailto:${c.email}`}>{c.email}</a>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Feedback getToken={getToken} user={user} />
      </main>

      <button
        className="chatFab"
        aria-label="Ask the onboarding assistant"
        onClick={() => setChatOpen(!chatOpen)}
      >
        <img src="/volt.png" alt="" width={72} height={72} />
      </button>

      {chatOpen && (
        <Chat
          getToken={getToken}
          isSignedIn={!!isSignedIn}
          close={() => setChatOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}

function Header({
  menuOpen,
  toggleMenu,
}: {
  menuOpen: boolean;
  toggleMenu: () => void;
}) {
  return (
    <header>
      <a className="brand" href="#home">
        <img
          className="brandLogo"
          src="/esyasoft-logo.png"
          alt="Esyasoft logo"
          width={46}
          height={46}
        />

        <span>
          <b>Esyasoft</b>
          <small>90-DAY ONBOARDING</small>
        </span>
      </a>

      <nav>
        <a href="#what">What we do</a>
        <a href="#setup">Setup</a>
        <a href="#journey">90 Days</a>
        <a href="#stay">Stay</a>
        <a href="#advice">Advice</a>
        <a href="#help">Help</a>
        <a href="#feedback">Feedback</a>
      </nav>

      <div className="headRight">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="btn ink small">Sign in</button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <UserButton showName />
        </Show>
      </div>

      <button
        className="menuBtn"
        aria-label="Menu"
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </header>
  );
}

function EnergyArt() {
  return (
    <div className="energy">
      <div className="ring r1" />
      <div className="ring r2" />

      <div className="core">
        POWER
        <br />
        <b>UP</b>
      </div>

      <span className="zap z1" />
      <span className="zap z2" />

      <span className="bubble b1">Day 1!</span>
      <span className="bubble b2">Zap! Learn!</span>
    </div>
  );
}

function SectionHead({
  tag,
  title,
  sub,
}: {
  tag: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="sectionHead">
      <span>{tag}</span>
      <h2>{title}</h2>
      <p>{sub}</p>
    </div>
  );
}

function ComicCard({
  no,
  title,
  text,
}: {
  no: string;
  title: string;
  text: string;
}) {
  return (
    <article className="comic panel">
      <i>{no}</i>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Feedback({ getToken, user }: any) {
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Onboarding content",
    message: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm((current) => ({
      ...current,
      name: current.name || user.fullName || "",
      email: current.email || user.primaryEmailAddress?.emailAddress || "",
    }));
  }, [user]);

  async function send(event: React.FormEvent) {
    event.preventDefault();

    setStatus("Sending...");

    try {
      const token = await getToken();

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: apiHeaders(token),
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to send feedback.");
      }

      setStatus("Feedback delivered successfully.");

      setForm((current) => ({
        ...current,
        message: "",
      }));
    } catch (error: any) {
      setStatus(error.message || "Could not send feedback.");
    }
  }

  return (
    <section className="section" id="feedback">
      <SectionHead
        tag="SEND THE SIGNAL"
        title="Make the next onboarding better"
        sub="Send structured feedback directly through the portal."
      />

      <form className="feedback panel" onSubmit={send}>
        <div className="two">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />

          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </div>

        <select
          value={form.category}
          onChange={(event) =>
            setForm({ ...form, category: event.target.value })
          }
        >
          <option>Onboarding content</option>
          <option>Training plan</option>
          <option>Accommodation / travel</option>
          <option>Portal experience</option>
          <option>Other</option>
        </select>

        <textarea
          required
          placeholder="Tell us what worked, what was unclear, and what would make the experience better..."
          value={form.message}
          onChange={(event) =>
            setForm({ ...form, message: event.target.value })
          }
        />

        <button className="btn lime">Send feedback</button>

        <span className="status" role="status">
          {status}
        </span>
      </form>
    </section>
  );
}

function Chat({ getToken, isSignedIn, close }: any) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Ask me anything related to your Esyasoft onboarding journey, training topics, workplace setup, documents, accommodation, travel or learning packs.",
    },
  ]);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send() {
    if (!input.trim() || busy || !isSignedIn) return;

    const question = input.trim();
    const history = messages
      .filter((m) => !m.text.startsWith("The onboarding assistant could not"))
      .slice(-6);

    setInput("");

    setMessages((current) => [...current, { role: "user", text: question }]);

    setBusy(true);

    try {
      const token = await getToken();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: apiHeaders(token),
        body: JSON.stringify({
          message: question,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to contact the assistant.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", text: data.answer },
      ]);
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: error.message || "The assistant is unavailable.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="chat panel">
      <div className="chatHead">
        <div className="chatTitle">
          <img
            className="chatAvatar"
            src="/volt.png"
            alt=""
            width={48}
            height={48}
          />
          <div>
            <b>Onboarding Assistant</b>
            <small>
              {isSignedIn ? "AI connected" : "Sign in to use the AI assistant"}
            </small>
          </div>
        </div>

        <button onClick={close} aria-label="Close chat">
          x
        </button>
      </div>

      <div className="msgs">
        {messages.map((message, index) => (
          <div className={"msg " + message.role} key={index}>
            {message.role === "assistant" ? (
              <MessageText text={message.text} />
            ) : (
              message.text
            )}
          </div>
        ))}

        {messages.length === 1 && isSignedIn && (
          <div className="suggest">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setInput(s);
                  inputRef.current?.focus();
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {busy && <div className="msg assistant typing">Thinking...</div>}

        <div ref={endRef} />
      </div>

      <div className="chatInput">
        <input
          ref={inputRef}
          value={input}
          disabled={!isSignedIn}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") send();
          }}
          placeholder={
            isSignedIn ? "Ask about onboarding..." : "Sign in first..."
          }
        />

        <button onClick={send} disabled={!isSignedIn || busy}>
          Send
        </button>
      </div>
    </aside>
  );
}

// Renders a plain-text reply as tidy paragraphs and bullet lists.
function MessageText({ text }: { text: string }) {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.split("\n").filter((l) => l.trim()))
    .filter((lines) => lines.length);

  return (
    <div className="msgBody">
      {blocks.map((lines, i) => {
        const isBullet = (l: string) => /^\s*[•\-]\s+/.test(l);
        const bullets = lines.filter(isBullet);

        // Whole block is a list
        if (bullets.length === lines.length) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^\s*[•\-]\s+/, "")}</li>
              ))}
            </ul>
          );
        }

        // Intro line(s) followed by a list, or plain paragraph
        const firstBullet = lines.findIndex(isBullet);
        if (firstBullet > 0) {
          return (
            <div key={i}>
              <p>{lines.slice(0, firstBullet).join("\n")}</p>
              <ul>
                {lines.slice(firstBullet).map((l, j) => (
                  <li key={j}>{l.replace(/^\s*[•\-]\s+/, "")}</li>
                ))}
              </ul>
            </div>
          );
        }

        return <p key={i}>{lines.join("\n")}</p>;
      })}
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <b>Esyasoft 90-Day Onboarding</b>
      <span>Explore Grow Prosper</span>
    </footer>
  );
}
