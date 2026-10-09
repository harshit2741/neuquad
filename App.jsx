import React, { useReducer, useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import Phone from "./Phone.jsx";
import Portrait from "./Portrait.jsx";
import Icon, { Avatar, inr } from "./Icon.jsx";
import { reducer, ledger, questSpent, jarPct, P } from "./store.js";
import { PERSONAS, PERSONA_ORDER, LAYERS, HOOK, DAYS, UNIVERSAL } from "./personas.js";
import { scriptFor, preState, defaultState, makeWait, runBeat, Cancelled } from "./demo.js";

const PHONE_W = 418, PHONE_H = 872;

function usePhoneScale(ref, shot) {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    if (shot) { setScale(1); return; }
    const el = ref.current;
    if (!el) return;
    const calc = () => {
      const w = el.clientWidth;
      const top = Math.min(el.getBoundingClientRect().top + window.scrollY, 140);
      const h = window.innerHeight - top - 46;
      const byW = (w - 8) / PHONE_W;
      const byH = window.innerWidth > 860 ? h / PHONE_H : 10;
      setScale(Math.max(0.6, Math.min(1, byW, byH)));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    window.addEventListener("resize", calc);
    return () => { ro.disconnect(); window.removeEventListener("resize", calc); };
  }, [shot]);
  return scale;
}

/* ---------- Persona switch ---------- */

function PersonaSwitch({ s, onSwitch, disabled }) {
  return (
    <div className="pswitch" role="tablist" aria-label="Choose a persona">
      {PERSONA_ORDER.map((pid) => {
        const p = PERSONAS[pid];
        const me = p.members[p.me];
        return (
          <button key={pid} role="tab" aria-selected={s.pid === pid} className={"pswitch-btn" + (s.pid === pid ? " on" : "")} onClick={() => onSwitch(pid)} disabled={disabled}>
            <Portrait look={me.look} photo={me.photo} size={40} title={me.full} />
            <span>
              <strong>{me.full}</strong>
              <small>{p.squad.college.split(",")[0]} · {p.label.split(" · ")[1]}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Left: the week ---------- */

function WeekPanel({ s, playing, running, onPlay, onPause, onStep, onPrev, onNext, onReset, onSwitch, go, d }) {
  const p = P(s);
  const active = s.stepIndex;
  const me = p.members[p.me];
  return (
    <aside className="panel week glass" aria-label="Play the week">
      <div className="panel-sub">
        <span className="kicker">Persona</span>
        <PersonaSwitch s={s} onSwitch={onSwitch} disabled={running} />
      </div>

      <div className="panel-h">
        <span className="kicker">{me.name}'s week</span>
        <span className="day-now">{s.day} · {s.time}</span>
      </div>

      <div className="controls">
        {playing
          ? <button className="ctl ctl-main" onClick={onPause}><Icon name="pause" size={16} /> Pause</button>
          : <button className="ctl ctl-main" onClick={onPlay}><Icon name="play" size={16} /> Play the week</button>}
        <button className="ctl" onClick={onPrev} disabled={running} aria-label="Previous day"><Icon name="prev" size={15} /></button>
        <button className="ctl" onClick={onNext} disabled={running} aria-label="Next day"><Icon name="next" size={15} /></button>
        <button className="ctl" onClick={onReset} aria-label="Reset to the deck view"><Icon name="reset" size={15} /></button>
      </div>

      <ol className="steps">
        {p.steps.map((st, i) => {
          const state = i === active ? "now" : i < active ? "done" : "todo";
          return (
            <li key={st.key}>
              <button className={"step " + state} onClick={() => onStep(i)} disabled={running && i !== active}>
                <span className="step-day">{st.day}<small>{st.time}</small></span>
                <span className="step-main">
                  <strong>{st.moment}</strong>
                  <span className="step-flow">
                    <span>{st.trigger}</span><Icon name="chev" size={12} />
                    <span>{st.action}</span><Icon name="chev" size={12} />
                    <span className="step-reward">{st.reward}</span>
                  </span>
                  <span className="step-tata">Tata touchpoint: {st.tata}</span>
                </span>
                <span className={"step-layer L-" + st.layer}>{st.layer}</span>
                {state === "now" && running && <span className="step-progress" />}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="panel-sub">
        <span className="kicker">The SQUAD model</span>
        <ul className="layers">
          {LAYERS.map((l) => (
            <li key={l.k} className={s.layer === l.k ? "on" : ""} style={{ "--lc": l.color }}>
              <span className="layer-k">{l.k}</span>
              <span><strong>{l.name}</strong><span>{l.line}</span></span>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel-sub">
        <span className="kicker">Jump to a screen</span>
        <div className="jumps">
          {[["home", "Neu home"], ["invite", "Invite"], ["squad", "Split"], ["quest", "Quest"], ["jar", "Goal jar"], ["scorecard", "Scorecard"]].map(([k, l]) => (
            <button key={k} className={"jump" + (!s.lock && s.screen === k ? " on" : "")} onClick={() => go(k, true)} disabled={running}>{l}</button>
          ))}
          <button className={"jump" + (s.lock ? " on" : "")} onClick={() => { d({ type: "CLOCK", day: "Sun", time: p.steps[4].time }); d({ type: "LOCK", on: true }); }} disabled={running}>Lock screen</button>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Right: under the hood ---------- */

function HookRing({ s }) {
  const idx = Math.max(0, HOOK.findIndex((h) => h.k === s.hook));
  const pos = [[110, 26], [194, 110], [110, 194], [26, 110]];
  const layer = LAYERS.find((l) => l.k === s.layer);
  return (
    <div className="hook">
      <svg viewBox="0 0 220 220" width="100%" style={{ maxWidth: 250 }} role="img" aria-label={`Hook loop: ${HOOK[idx].label}`}>
        <defs>
          <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9B5DE5" /><stop offset="1" stopColor="#E4007C" /></linearGradient>
        </defs>
        <circle cx="110" cy="110" r="84" fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="3 6" />
        <circle cx="110" cy="110" r="84" fill="none" stroke="url(#ringG)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${(2 * Math.PI * 84) / 4} ${2 * Math.PI * 84}`} style={{ transform: `rotate(${-135 + idx * 90}deg)` }} className="hook-arc" />
        {pos.map(([x, y], i) => (
          <g key={i} className={"hook-node" + (i === idx ? " on" : "")}>
            <circle cx={x} cy={y} r={i === idx ? 15 : 11} />
            <text x={x} y={y + 4} textAnchor="middle">{i + 1}</text>
          </g>
        ))}
        <text x="110" y="102" textAnchor="middle" className="hook-c1">{HOOK[idx].label}</text>
        <text x="110" y="122" textAnchor="middle" className="hook-c2">{HOOK[idx].sub}</text>
        <text x="110" y="146" textAnchor="middle" className="hook-c3" style={{ fill: layer?.color }}>Layer {s.layer} · {layer?.name}</text>
      </svg>
      <ul className="hook-legend">{HOOK.map((h, i) => <li key={h.k} className={i === idx ? "on" : ""}><span>{i + 1}</span>{h.label}</li>)}</ul>
    </div>
  );
}

function HoodPanel({ s }) {
  const p = P(s);
  const L = ledger(s);
  const spent = questSpent(s);
  const opens = s.opens.reduce((a, b) => a + b, 0);
  return (
    <aside className="panel hood glass" aria-label="Under the hood">
      <div className="panel-h"><span className="kicker">Under the hood</span><span className="live"><span className="live-dot" /> live</span></div>
      <HookRing s={s} />
      <div className="metrics">
        <div className="metric">
          <span className="m-l">App opens this week</span>
          <strong className="m-v">{opens}</strong>
          <div className="heat" aria-label="Opens by day">
            {DAYS.map((dn, i) => <span key={dn} className={"heat-c h" + Math.min(3, s.opens[i])} title={`${dn}: ${s.opens[i]}`}>{dn[0]}</span>)}
          </div>
          <span className="m-s">Before NeuSquad: 1–2 a month</span>
        </div>
        <div className="metric">
          <span className="m-l">NeuCoins this week</span>
          <strong className="m-v gold">+{s.coinsWeek}</strong>
          <span className="cap"><span style={{ width: (s.splitCoinsUsed / UNIVERSAL.splitCoinCap) * 100 + "%" }} /></span>
          <span className="m-s">Split coins {s.splitCoinsUsed} of {UNIVERSAL.splitCoinCap} cap</span>
        </div>
        <div className="metric">
          <span className="m-l">{p.quest.label}</span>
          <strong className="m-v">{inr(spent)}</strong>
          <span className="cap gold"><span style={{ width: Math.min(100, (spent / p.quest.cap) * 100) + "%" }} /></span>
          <span className="m-s">of {inr(p.quest.cap)} cap</span>
        </div>
        <div className="metric">
          <span className="m-l">{p.jar.short} jar</span>
          <strong className="m-v violet">{jarPct(s)}%</strong>
          <span className="cap violet"><span style={{ width: jarPct(s) + "%" }} /></span>
          <span className="m-s">You owe {inr(L.owe)} · get {inr(L.get)}</span>
        </div>
      </div>
      <div className="guards">
        <span className={"guard" + (s.nudges > UNIVERSAL.nudgeCap ? " warn" : "")}><Icon name="bell" size={13} /> System nudges {s.nudges} of {UNIVERSAL.nudgeCap}</span>
        <span className="guard"><Icon name="coin" size={13} /> Coins capped per pair</span>
        <span className="guard"><Icon name="shield" size={13} /> Shared expenses only</span>
      </div>
      <div className="panel-sub">
        <span className="kicker">Event stream</span>
        <ul className="events" aria-live="polite">
          {s.events.slice(0, 9).map((e) => (
            <li key={e.id}><span className="ev-t">{e.t}</span><span className="ev-n">{e.name}</span><span className="ev-p">{JSON.stringify(e.payload).replace(/"/g, "").replace(/,/g, ", ")}</span></li>
          ))}
        </ul>
      </div>
      <div className="panel-sub">
        <span className="kicker">Last Neu UPI intent</span>
        <code className="upi-line">{s.lastUpi || "upi://pay?pa=…&am=…&tn=NSQ-…"}</code>
      </div>
      <details className="rule">
        <summary>Quest engine rule</summary>
        <pre>{`avg = squad.${p.quest.cats[0]}_spend_per_person(last 4 weeks)
cap = round_to_100(0.9 × avg)      # ${inr(p.quest.cap)} this week
reward = min(${p.quest.reward}, weekly_coin_budget)
quest = "${p.quest.title}"`}</pre>
      </details>
    </aside>
  );
}

/* ---------- Floating glass chips around the phone ---------- */

function Orbit({ s }) {
  const p = P(s);
  const L = ledger(s);
  const chips = [
    { c: "teal", k: "Split", v: L.owe > 0 ? `You owe ${inr(L.owe)}` : "All settled" },
    { c: "gold", k: "Quest", v: `${inr(questSpent(s))} / ${inr(p.quest.cap)}` },
    { c: "violet", k: "Jar", v: `${p.jar.short} ${jarPct(s)}%` },
    { c: "magenta", k: "Streak", v: `Week ${s.streak}` },
  ];
  return (
    <div className="orbit" aria-hidden="true">
      {chips.map((ch, i) => <span key={ch.k} className={"orb-chip oc" + i + " c-" + ch.c}><small>{ch.k}</small>{ch.v}</span>)}
    </div>
  );
}

/* ---------- Persona profile cards ---------- */

function PersonaCard({ pid, active, onPlay }) {
  const p = PERSONAS[pid];
  const me = p.members[p.me];
  const f = p.profile;
  return (
    <article className={"pcard" + (active ? " active" : "")} id={"persona-" + pid}>
      <div className="pcard-left">
        <div className="pcard-id">
          <Portrait look={me.look} photo={me.photo} size={112} title={me.full} />
          <div>
            <span className="pchip">{p.label}</span>
            <h3>{me.full}</h3>
            <p className="arche">{f.archetype}</p>
          </div>
        </div>
        <dl className="facts">
          <div><dt>Age</dt><dd>{f.age}</dd></div>
          <div><dt>Course</dt><dd>{f.course}</dd></div>
          <div><dt>College</dt><dd>{f.college}</dd></div>
          <div><dt>Lives</dt><dd>{f.lives}</dd></div>
          <div><dt>Money</dt><dd><strong>{f.money}</strong> · {f.moneySplit}</dd></div>
          <div><dt>On Tata Neu today</dt><dd>{f.neuToday}</dd></div>
        </dl>
        <div className="spend">
          <span className="plabel">Where the money goes</span>
          <div className="spend-bar">{f.spend.map((x) => <span key={x.k} style={{ width: x.v + "%", background: x.c }} title={`${x.k} ${x.v}%`} />)}</div>
          <ul className="spend-legend">{f.spend.map((x) => <li key={x.k}><i style={{ background: x.c }} />{x.k} {x.v}%</li>)}</ul>
        </div>
        <div className="apps"><span className="plabel">Opens every day</span>{f.apps.map((a) => <span className="app-chip" key={a}>{a}</span>)}</div>
      </div>
      <div className="pcard-right">
        <blockquote className="pquote">
          <p>"{f.quote}"</p>
          <footer>{f.quoteEn}</footer>
        </blockquote>
        <div className="pblock">
          <span className="plabel">Pain points</span>
          <ul className="plist pain">{f.pains.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="pblock">
          <span className="plabel">Goals</span>
          <ul className="plist goal">{f.goals.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="pblock">
          <span className="plabel">Squad: {p.squad.name}</span>
          <ul className="mates">
            {Object.values(p.members).filter((m) => m.id !== p.me).map((m) => (
              <li key={m.id}><Avatar m={m} size={34} /><span><strong>{m.full}</strong><small>{m.line}</small></span></li>
            ))}
          </ul>
        </div>
        <div className="pfoot">
          <span className="fit">NeuSquad fit: {f.fit.map((x) => <b key={x}>{x}</b>)}</span>
          {onPlay && <button className="ctl ctl-main small" onClick={onPlay}><Icon name="play" size={14} /> Play {me.name}'s week</button>}
        </div>
      </div>
    </article>
  );
}

/* ---------- App ---------- */

export default function App() {
  const [s, d] = useReducer(reducer, "rohan", defaultState);
  const [playing, setPlaying] = useState(false);
  const [running, setRunning] = useState(false);
  const [shot, setShot] = useState(false);
  const token = useRef({ cancelled: false });
  const stageRef = useRef(null);
  const scale = usePhoneScale(stageRef, shot);
  const stateRef = useRef(s);
  stateRef.current = s;

  const go = useCallback((screen, countOpen) => d({ type: "NAV", screen, countOpen }), []);
  const cancel = () => { token.current.cancelled = true; };

  const beat = async (i, opts = {}) => {
    cancel();
    const t = { cancelled: false };
    token.current = t;
    const pid = opts.pid || stateRef.current.pid;
    if (opts.reset) { const st = preState(pid, i); stateRef.current = st; d({ type: "RESET", state: st }); }
    d({ type: "STEP", index: i });
    setRunning(true);
    try {
      await runBeat(scriptFor(pid)[i], d, makeWait(t), () => stateRef.current);
      return !t.cancelled;
    } catch (e) {
      if (!(e instanceof Cancelled)) console.error(e);
      return false;
    } finally {
      if (token.current === t) setRunning(false);
    }
  };

  const play = async (pidArg) => {
    const pid = typeof pidArg === "string" ? pidArg : stateRef.current.pid;
    setPlaying(true);
    let i = pid !== stateRef.current.pid ? 0 : stateRef.current.stepIndex;
    i = i < 0 || i >= 4 ? 0 : i + 1;
    let first = true;
    for (; i < 5; i++) {
      const ok = await beat(i, { reset: first, pid });
      first = false;
      if (!ok) break;
      if (i < 4) {
        const t = token.current;
        await new Promise((r) => setTimeout(r, 1400));
        if (t.cancelled) break;
      }
    }
    setPlaying(false);
  };

  const pause = () => { cancel(); setPlaying(false); setRunning(false); };
  const step = (i) => { setPlaying(false); beat(i, { reset: true }); };
  const next = () => step(Math.min(4, s.stepIndex + 1));
  const prev = () => step(Math.max(0, s.stepIndex - 1));
  const reset = () => { pause(); d({ type: "RESET", state: defaultState(stateRef.current.pid) }); };
  const switchTo = (pid) => { pause(); d({ type: "RESET", state: defaultState(pid) }); };
  const playPersona = (pid) => {
    pause();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => play(pid), 350);
  };

  // Hook for exporting screenshots: window.__neusquad
  useEffect(() => {
    window.__neusquad = {
      persona: (pid) => switchTo(pid),
      go: (screen) => { pause(); d({ type: "NAV", screen, silent: true }); },
      lock: (on) => { pause(); d({ type: "LOCK", on }); },
      sheet: (sheet, data) => d({ type: "SHEET", sheet, data }),
      clock: (day, time) => d({ type: "CLOCK", day, time }),
      reset: () => reset(),
      state: () => stateRef.current,
      shot: (on) => { setShot(on); document.documentElement.classList.toggle("shot", on); },
    };
  });

  return (
    <div className={"app" + (shot ? " is-shot" : "")}>
      <div className="aurora" aria-hidden="true"><span className="blob b1" /><span className="blob b2" /><span className="blob b3" /><span className="blob b4" /><span className="grain" /></div>

      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-t"><strong>NeuSquad</strong><span>a squad layer inside Tata Neu</span></span>
        </div>
        <p className="tagline">Plan. Split. Earn. <em>Together.</em></p>
        <a className="proto-pill" href="#personas"><Icon name="users" size={14} /> Meet the personas</a>
        <span className="proto-pill"><Icon name="info" size={14} /> Concept prototype</span>
      </header>

      <main className="layout">
        <WeekPanel
          s={s} playing={playing} running={running}
          onPlay={play} onPause={pause} onStep={step} onPrev={prev} onNext={next} onReset={reset} onSwitch={switchTo}
          go={(k, c) => { pause(); go(k, c); }} d={d}
        />
        <section className="stage" ref={stageRef} aria-label="NeuSquad app prototype">
          <div className="stage-inner" style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
            <div className="halo" aria-hidden="true"><span className="halo-ring" /><span className="halo-core" /></div>
            <Orbit s={s} />
            <div className="phone-scale" style={{ transform: `scale(${scale})` }}>
              <Phone s={s} d={d} go={go} />
            </div>
          </div>
          <p className="stage-hint">Tap anything on the phone. It works.</p>
        </section>
        <HoodPanel s={s} />
      </main>

      <section className="personas" id="personas" aria-labelledby="personas-h">
        <div className="personas-h">
          <span className="kicker">Who we designed for</span>
          <h2 id="personas-h">Two students, one gap: no reason to open Neu between purchases</h2>
          <p>Illustrative personas built from the case brief. Names and details are fictional; colleges are real places used for context.</p>
        </div>
        <div className="pgrid">
          {PERSONA_ORDER.map((pid) => <PersonaCard key={pid} pid={pid} active={s.pid === pid} onPlay={() => playPersona(pid)} />)}
        </div>
      </section>

      <footer className="foot">
        <p>Concept prototype built for a case competition on Tata Neu student engagement. Not affiliated with or endorsed by Tata Digital. Brand names only show where a booking would happen. Personas are fictional. No real payments, accounts or personal data.</p>
      </footer>
    </div>
  );
}
