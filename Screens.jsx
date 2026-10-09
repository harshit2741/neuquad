import React, { useState, useEffect } from "react";
import Icon, { Avatar, Coin, inr } from "./Icon.jsx";
import { CATS } from "./personas.js";
import { P, ledger, questSpent, myShare, jarTotal, jarPct } from "./store.js";

const friendsOf = (p) => Object.values(p.members).filter((m) => m.id !== p.me);

/* ---------- shared bits ---------- */

function SquadTabs({ s, go }) {
  const tabs = [
    { k: "squad", label: "Split", c: "teal" },
    { k: "quest", label: "Quest", c: "gold" },
    { k: "jar", label: "Goal Jar", c: "violet" },
  ];
  return (
    <div className="seg" role="tablist">
      {tabs.map((t) => (
        <button key={t.k} role="tab" aria-selected={s.screen === t.k} className={"seg-btn seg-" + t.c + (s.screen === t.k ? " on" : "")} onClick={() => go(t.k)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function SquadHeader({ s, go, title, sub }) {
  const p = P(s);
  return (
    <header className="sq-head">
      <div className="sq-head-row">
        <button className="icon-btn light" onClick={() => go("home")} aria-label="Back to Tata Neu home"><Icon name="back" /></button>
        <div className="sq-head-title">
          <span className="eyebrow light">NeuSquad · {p.squad.college}</span>
          <strong>{title}</strong>
        </div>
        <button className="icon-btn light" onClick={() => go("scorecard")} aria-label="Open this week's scorecard"><Icon name="trophy" /></button>
      </div>
      <div className="sq-head-meta">
        <div className="avatar-stack">
          {Object.values(p.members).map((m) => <Avatar key={m.id} m={m} size={28} ring />)}
        </div>
        <span className="streak-pill"><Icon name="flame" size={14} /> Week {s.streak} streak</span>
        <span className="coin-pill"><Coin size={14} /> {s.coins}</span>
      </div>
      {sub}
      <SquadTabs s={s} go={go} />
    </header>
  );
}

/* ---------- 0 · Tata Neu style home ---------- */

export function HomeScreen({ s, go }) {
  const p = P(s);
  const L = ledger(s);
  const me = p.members[p.me];
  const cats = [["cart", "Groceries"], ["shirt", "Fashion"], ["tv", "Electronics"], ["plane", "Flights"], ["bed", "Hotels"], ["pill", "Pharmacy"], ["spark", "Beauty"], ["receipt", "Bills"]];
  return (
    <div className="scr home">
      <div className="home-top">
        <div className="home-me">
          <Avatar m={me} size={42} />
          <div className="home-hello">
            <span className="muted-s">{p.squad.campusLine.split(" · ")[0]}</span>
            <strong>Hi {me.name}</strong>
          </div>
        </div>
        <span className="coin-pill dark"><Coin size={15} /> {s.coins}</span>
      </div>
      <div className="search"><Icon name="search" size={18} /> Search groceries, flights, gadgets</div>

      <button className="squad-hero" onClick={() => go("squad", true)}>
        <div className="squad-hero-glow" />
        <div className="squad-hero-top"><span className="new-chip">NEW</span><span className="eyebrow light">NeuSquad</span></div>
        <strong className="squad-hero-h">Plan, split and earn with your friends</strong>
        <div className="squad-hero-row">
          <div className="avatar-stack">{Object.values(p.members).map((m) => <Avatar key={m.id} m={m} size={30} ring />)}</div>
          <div className="squad-hero-stats">
            <span>{L.owe > 0 ? `You owe ${inr(L.owe)}` : "All settled"}</span>
            <span>{p.jar.short} jar {jarPct(s)}%</span>
          </div>
        </div>
        <span className="squad-hero-cta">Open {p.squad.name} <Icon name="chev" size={16} /></span>
      </button>

      <div className="cat-grid">
        {cats.map(([i, l]) => (
          <div className="cat" key={l}><span className="cat-ic"><Icon name={i} size={20} /></span><span>{l}</span></div>
        ))}
      </div>

      <div className="strip-h">Brands on Neu</div>
      <div className="brand-row">
        {["BigBasket", "Croma", "Tata CLiQ", "Air India Express", "IHCL", "Tata 1mg", "Westside"].map((b) => <span className="brand-pill" key={b}>{b}</span>)}
      </div>

      <div className="neupass">
        <div><span className="eyebrow">NeuPass</span><strong>Earn NeuCoins on every Tata brand</strong><span className="muted-s">1 NeuCoin = ₹1</span></div>
        <Coin size={36} />
      </div>

      <button className="invite-link" onClick={() => go("invite", true)}><Icon name="chat" size={16} /> See how {p.members[p.squad.inviteBy].name}'s invite looks</button>
    </div>
  );
}

/* ---------- 1 · Invite and join ---------- */

export function InviteScreen({ s, go, d }) {
  const p = P(s);
  const [joined, setJoined] = useState(false);
  const inviter = p.members[p.squad.inviteBy];
  return (
    <div className="scr invite">
      <div className="chat-head">
        <button className="icon-btn" onClick={() => go("home")} aria-label="Back"><Icon name="back" /></button>
        <div className="avatar-stack">{friendsOf(p).slice(0, 2).map((m) => <Avatar key={m.id} m={m} size={30} />)}</div>
        <div><strong>{p.squad.whatsapp}</strong><span className="muted-s">WhatsApp group · 4 members</span></div>
      </div>
      <div className="chat-body">
        {p.squad.chat.map((c, i) => (
          <div className="bubble them" key={i}>
            <span className="bubble-name" style={{ color: p.members[c.by].color }}>{p.members[c.by].name}</span>
            {c.text}
            <span className="bubble-time">{c.time}</span>
          </div>
        ))}
        <div className="bubble them">
          <span className="bubble-name" style={{ color: inviter.color }}>{inviter.name}</span>
          <div className="link-card">
            <div className="link-card-art">
              <div className="avatar-stack">{Object.values(p.members).map((m) => <Avatar key={m.id} m={m} size={34} ring />)}</div>
            </div>
            <strong>Join {p.squad.name} on NeuSquad</strong>
            <span className="muted-s">Split bills, weekly quests and a shared {p.jar.short} jar. 3 friends already in.</span>
            <span className="link-domain">tataneu · NeuSquad invite</span>
          </div>
          <span className="bubble-time">{p.squad.chat[p.squad.chat.length - 1].time}</span>
        </div>
        <div className="bubble me">{p.squad.myReply}<span className="bubble-time">✓✓</span></div>
      </div>

      <div className="join-card">
        <strong>Before you join</strong>
        <ul className="tick-list">
          <li><Icon name="shield" size={16} /> Your squad sees only the expenses you add. Your other spending stays private.</li>
          <li><Icon name="lock" size={16} /> Every payment goes through Neu UPI and needs your PIN.</li>
          <li><Icon name="coin" size={16} /> NeuCoins are capped each week. Missing a week costs nothing.</li>
        </ul>
        <button
          className={"btn btn-magenta wide" + (joined ? " done" : "")}
          onClick={() => { setJoined(true); d({ type: "JOIN" }); setTimeout(() => go("squad", true), 650); }}
        >
          {joined ? <><Icon name="check" size={18} /> Joined</> : `Join ${p.squad.name}`}
        </button>
      </div>
    </div>
  );
}

/* ---------- 2 · Squad home / Split ---------- */

export function SquadScreen({ s, go, d }) {
  const p = P(s);
  const L = ledger(s);
  const firstOwe = friendsOf(p).find((m) => L.net[m.id] < 0);
  const settled = (e) => e.paidBy !== p.me && e.among.includes(p.me) && s.settlements.some((x) => x.to === e.paidBy) && L.net[e.paidBy] >= 0;
  return (
    <div className="scr squad">
      <SquadHeader
        s={s} go={go} title={p.squad.name}
        sub={
          <div className="balance">
            <div className="bal-cell"><span className="muted-l">You owe</span><strong className="bal-owe">{inr(L.owe)}</strong></div>
            <div className="bal-div" />
            <div className="bal-cell"><span className="muted-l">You get</span><strong className="bal-get">{inr(L.get)}</strong></div>
          </div>
        }
      />
      <div className="sq-body">
        <div className="member-row">
          {friendsOf(p).map((m) => {
            const n = L.net[m.id];
            return (
              <div className="member" key={m.id}>
                <Avatar m={m} size={40} />
                <span className="member-name">{m.name}</span>
                <span className={"member-bal " + (n < 0 ? "neg" : n > 0 ? "pos" : "zero")}>{n < 0 ? `You owe ${inr(-n)}` : n > 0 ? `Owes ${inr(n)}` : "Settled"}</span>
              </div>
            );
          })}
        </div>

        <div className="actions-2">
          <button className="btn btn-teal" disabled={!firstOwe} onClick={() => firstOwe && d({ type: "SHEET", sheet: "settle", data: { to: firstOwe.id, amount: -L.net[firstOwe.id] } })}>
            <Icon name="bolt" size={17} /> {firstOwe ? `Settle ${inr(-L.net[firstOwe.id])}` : "All settled"}
          </button>
          <button className="btn btn-ghost" onClick={() => d({ type: "SHEET", sheet: "add" })}><Icon name="plus" size={17} /> Add expense</button>
        </div>

        <div className="list-h"><span>This week's splits</span><span className="muted-s">{s.expenses.length} items</span></div>
        <ul className="split-list">
          {s.expenses.map((e) => {
            const share = myShare(s, e);
            const mine = e.paidBy === p.me;
            const c = CATS[e.cat];
            return (
              <li key={e.id} className="split">
                <span className="split-ic" style={{ background: c.color + "22", color: c.color }}><Icon name={c.icon} size={18} /></span>
                <div className="split-main">
                  <strong>{e.title}</strong>
                  <span className="muted-s">{inr(e.amount)} ÷ {e.among.length} · {mine ? "you paid" : `${p.members[e.paidBy].name} paid`} · {e.day}</span>
                </div>
                <div className="split-amt">
                  {mine ? <span className="pos">+{inr(e.amount - share)}</span>
                    : settled(e) ? <span className="settled-tag"><Icon name="check" size={13} /> settled</span>
                    : <span className="neg">−{inr(share)}</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <button className="poll-card" onClick={() => d({ type: "SHEET", sheet: "poll" })}>
          <Avatar m={p.members[s.poll.by]} size={36} />
          <div>
            <strong>{p.members[s.poll.by].name}'s poll: {s.poll.q}</strong>
            <span className="muted-s">{s.poll.voted ? "You voted · see results" : "Tap to vote · picks from Tata CLiQ and Westside"}</span>
          </div>
          <Icon name="chev" size={16} />
        </button>

        <p className="privacy-note"><Icon name="shield" size={14} /> Only expenses added to this squad are visible to members.</p>
      </div>
    </div>
  );
}

/* ---------- 3 · Weekly Quest ---------- */

export function QuestScreen({ s, go }) {
  const p = P(s);
  const q = p.quest;
  const spent = questSpent(s);
  const pct = Math.min(1, spent / q.cap);
  const left = q.cap - spent;
  const R = 62, C = 2 * Math.PI * R;
  const rows = [{ m: p.members[p.me], v: spent }, ...Object.entries(q.others).map(([k, v]) => ({ m: p.members[k], v }))];
  const daysLeft = { Mon: 7, Tue: 6, Wed: 5, Thu: 4, Fri: 3, Sat: 2, Sun: 1 }[s.day];
  return (
    <div className="scr quest">
      <SquadHeader s={s} go={go} title="This week's quest" />
      <div className="sq-body">
        <div className="quest-card">
          <div className="quest-ring">
            <svg viewBox="0 0 160 160" width="160" height="160" role="img" aria-label={`Spend ${inr(spent)} of ${inr(q.cap)}`}>
              <circle cx="80" cy="80" r={R} fill="none" stroke="var(--app-line)" strokeWidth="14" />
              <circle cx="80" cy="80" r={R} fill="none" stroke="var(--gold)" strokeWidth="14" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 80 80)" className="ring-anim" />
            </svg>
            <div className="quest-ring-in"><strong>{inr(spent)}</strong><span>of {inr(q.cap)}</span></div>
          </div>
          <div className="quest-side">
            <span className="eyebrow gold">{q.label}</span>
            <strong className="quest-left">{left >= 0 ? `${inr(left)} left` : `${inr(-left)} over`}</strong>
            <span className="muted-s">{s.questDone ? "Quest complete" : `${daysLeft} days left`}</span>
            <span className="reward-chip"><Coin size={14} /> +{q.reward} NeuCoins if the squad finishes</span>
          </div>
        </div>

        <div className="breakdown">
          <div><span className="dot" style={{ background: "var(--gold)" }} /> Shared {q.label === "Café cap" ? "café and food" : "food"} {inr(spent - q.soloTracked)}</div>
          <div><span className="dot" style={{ background: "var(--violet)" }} /> Solo spends you chose to track {inr(q.soloTracked)}</div>
        </div>

        <div className="list-h"><span>Squad progress</span><span className="muted-s">cap {inr(q.cap)} each</span></div>
        <ul className="bars">
          {rows.map(({ m, v }) => (
            <li key={m.id}>
              <Avatar m={m} size={26} />
              <span className="bar-name">{m.id === p.me ? "You" : m.name}</span>
              <span className="bar-track"><span className="bar-fill" style={{ width: Math.min(100, (v / q.cap) * 100) + "%", background: m.color }} /></span>
              <span className="bar-val">{inr(v)}</span>
            </li>
          ))}
        </ul>

        <div className="list-h"><span>Campus leaderboard</span><span className="muted-s">{p.squad.squadsOnCampus} squads at {p.squad.college.split(",")[0]}</span></div>
        <ol className="board">
          {p.leaderboard.map((r, i) => (
            <li key={r.name} className={r.me ? "me" : ""}>
              <span className="rank">{i + 1}</span>
              <span className="board-name">{r.name}{r.me ? " (you)" : ""}</span>
              <span className="board-xp">{(r.xp + (r.me && s.questDone ? 200 : 0)).toLocaleString("en-IN")} XP</span>
            </li>
          ))}
        </ol>

        <div className="bonus">
          <Icon name="bolt" size={16} />
          <div><strong>Bonus: settle every split within 24 hours</strong><span className="track-mini"><span style={{ width: "83%" }} /></span><span className="muted-s">5 of 6 done</span></div>
        </div>

        <details className="how">
          <summary><Icon name="info" size={14} /> How this quest was built</summary>
          <p>{q.basis} No one at Tata writes these by hand. The quest engine reads the squad's own shared spending.</p>
        </details>

        <button className="btn btn-gold wide" disabled={s.questDone} onClick={() => go("scorecard", true)}>
          {s.questDone ? <><Icon name="check" size={17} /> Quest complete</> : "See Sunday's scorecard"}
        </button>
      </div>
    </div>
  );
}

/* ---------- 4 · Goal Jar ---------- */

export function JarScreen({ s, go, d }) {
  const p = P(s);
  const total = jarTotal(s);
  const pct = jarPct(s);
  const max = Math.max(...Object.values(s.jar));
  return (
    <div className="scr jar">
      <SquadHeader s={s} go={go} title={p.jar.name} />
      <div className="sq-body">
        <div className="jar-card">
          <div className="jar-vis" aria-label={`Jar ${pct}% full`}>
            <svg viewBox="0 0 140 180" width="132" height="170">
              <defs>
                <clipPath id="jarClip"><path d="M38 22h64v18c18 8 26 22 26 40v76a16 16 0 0 1-16 16H28a16 16 0 0 1-16-16V80c0-18 8-32 26-40z" /></clipPath>
                <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B98AF0" /><stop offset="1" stopColor="#5B1FA8" /></linearGradient>
              </defs>
              <g clipPath="url(#jarClip)">
                <rect x="0" y="0" width="140" height="180" fill="var(--app-soft)" />
                <g className="liquid" style={{ transform: `translateY(${172 - (150 * pct) / 100}px)` }}>
                  <path className="wave" d="M-140 6 Q-105 -4 -70 6 T0 6 T70 6 T140 6 T210 6 T280 6 V200 H-140Z" fill="url(#liq)" />
                  <circle cx="44" cy="40" r="7" fill="var(--gold)" opacity=".9" />
                  <circle cx="86" cy="62" r="6" fill="var(--gold)" opacity=".85" />
                  <circle cx="64" cy="92" r="7" fill="var(--gold)" opacity=".8" />
                </g>
              </g>
              <path d="M38 22h64v18c18 8 26 22 26 40v76a16 16 0 0 1-16 16H28a16 16 0 0 1-16-16V80c0-18 8-32 26-40z" fill="none" stroke="var(--violet)" strokeWidth="3" />
              <rect x="32" y="10" width="76" height="14" rx="6" fill="var(--violet)" />
            </svg>
            <span className="jar-pct">{pct}%</span>
          </div>
          <div className="jar-side">
            <span className="eyebrow violet">Squad goal jar</span>
            <strong className="jar-total">{inr(total)}</strong>
            <span className="muted-s">of {inr(p.jar.target)} · 4 friends</span>
            <span className="reward-chip violet"><Coin size={14} /> includes {s.jarCoins} NeuCoins</span>
            <span className="muted-s">Auto-save every Friday: {inr(p.jar.autosave)} each</span>
          </div>
        </div>

        <div className="list-h"><span>Who put in what</span></div>
        <ul className="bars">
          {Object.entries(s.jar).map(([k, v]) => (
            <li key={k}>
              <Avatar m={p.members[k]} size={26} />
              <span className="bar-name">{k === p.me ? "You" : p.members[k].name}</span>
              <span className="bar-track"><span className="bar-fill" style={{ width: (v / max) * 100 + "%", background: "var(--violet)" }} /></span>
              <span className="bar-val">{inr(v)}</span>
            </li>
          ))}
        </ul>

        <div className="actions-2">
          <button className="btn btn-violet" onClick={() => d({ type: "TOPUP", amount: 200 })}><Icon name="plus" size={16} /> Add ₹200</button>
          <button className="btn btn-ghost" onClick={() => d({ type: "SHEET", sheet: "unlock" })}><Icon name="target" size={16} /> What it books</button>
        </div>

        <div className="list-h"><span>When the jar is full, book on Neu</span></div>
        <div className="unlock-grid">
          {p.unlocks.map((u) => (
            <button className="unlock" key={u.brand} onClick={() => { d({ type: "BRAND", brand: u.brand }); d({ type: "SHEET", sheet: "unlock" }); }}>
              <span className="unlock-ic"><Icon name={u.icon} size={18} /></span>
              <strong>{u.brand}</strong><span>{u.what}</span><span className="muted-s">{u.note}</span>
            </button>
          ))}
        </div>

        <div className="jar-mini">
          <Icon name="jar" size={18} />
          <div><strong>{p.jar.personal.name}</strong><span className="track-mini"><span style={{ width: p.jar.personal.pct + "%" }} /></span><span className="muted-s">Your personal jar · {p.jar.personal.pct}%</span></div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 5 · Lock screen + Sunday Scorecard ---------- */

export function LockScreen({ s, open }) {
  const p = P(s);
  const ord = ["", "1st", "2nd", "3rd"][p.scorecard.rank] || `${p.scorecard.rank}th`;
  return (
    <div className="lock">
      <div className="lock-glow" />
      <div className="lock-time"><span>{p.scorecard.date}</span><strong>{s.time}</strong></div>
      <button className="lock-notif" onClick={open}>
        <div className="lock-notif-top"><span className="app-badge">N</span><span>NEUSQUAD</span><span className="muted-l">now</span></div>
        <strong>{p.squad.name} came {ord} this week</strong>
        <span>Quest "{p.quest.label} {inr(p.quest.cap)}" done · {p.jar.short} jar {jarPct(s)}% · New quest unlocked</span>
      </button>
      <span className="lock-hint">Tap the notification</span>
    </div>
  );
}

export function ScorecardScreen({ s, go, d }) {
  const p = P(s);
  const total = jarTotal(s);
  const rank = p.scorecard.rank;
  const ord = ["", "1st", "2nd", "3rd"][rank] || `${rank}th`;
  useEffect(() => {
    if (!s.questDone) { const t = setTimeout(() => d({ type: "QUEST_DONE" }), 700); return () => clearTimeout(t); }
  }, [s.questDone]);
  return (
    <div className="scr score">
      <div className="score-head">
        <button className="icon-btn light" onClick={() => go("squad")} aria-label="Back to squad"><Icon name="back" /></button>
        <span className="eyebrow light">Sunday Scorecard · Week {s.streak}</span>
      </div>
      <div className="medal">
        <div className={"medal-disc r" + rank}><span>{rank}</span></div>
        <strong>{ord} of {p.squad.squadsOnCampus} squads at {p.squad.college.split(",")[0]}</strong>
        <div className="avatar-stack">{Object.values(p.members).map((m) => <Avatar key={m.id} m={m} size={30} ring />)}</div>
        <span className="muted-l">{p.squad.name}</span>
      </div>
      <div className="score-grid">
        <div className="score-tile"><span className="muted-s">Quest</span><strong>{s.questDone ? "Done" : "Checking…"}</strong><span className="muted-s">{p.quest.label} {inr(p.quest.cap)}</span></div>
        <div className="score-tile"><span className="muted-s">Streak</span><strong>{s.streak} weeks</strong><span className="muted-s">no penalty if missed</span></div>
        <div className="score-tile"><span className="muted-s">NeuCoins this week</span><strong>+{s.coinsWeek}</strong><span className="muted-s">cap: 20 from splits</span></div>
        <div className="score-tile"><span className="muted-s">{p.jar.short} jar</span><strong>{jarPct(s)}%</strong><span className="muted-s">{inr(p.jar.target - total)} to go</span></div>
      </div>
      <div className="badge-row">{s.badges.map((b) => <span className="badge" key={b}><Icon name="trophy" size={13} /> {b}</span>)}</div>
      <div className="next-quest">
        <span className="eyebrow gold">Next week's quest</span>
        <strong>{p.quest.next}</strong>
        <span className="muted-s">{p.quest.nextBasis}</span>
      </div>
      <div className="actions-2">
        <button className="btn btn-magenta" onClick={() => go("quest")}>Start next quest</button>
        <button className="btn btn-ghost light"><Icon name="share" size={16} /> Share card</button>
      </div>
    </div>
  );
}

/* ---------- Sheets ---------- */

export function AddExpenseSheet({ s, d, prefill, close }) {
  const p = P(s);
  const [title, setTitle] = useState(prefill?.title ?? "");
  const [amount, setAmount] = useState(prefill?.amount ?? "");
  const [cat, setCat] = useState(prefill?.cat ?? "food");
  const [among, setAmong] = useState(prefill?.among ?? Object.keys(p.members));
  useEffect(() => {
    setTitle(prefill?.title ?? ""); setAmount(prefill?.amount ?? ""); setCat(prefill?.cat ?? "food"); setAmong(prefill?.among ?? Object.keys(p.members));
  }, [prefill, s.pid]);
  const amt = Number(amount) || 0;
  const per = among.length ? amt / among.length : 0;
  const toggle = (id) => setAmong((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  const submit = (e) => {
    e.preventDefault();
    if (!amt || !title || among.length < 2) return;
    d({ type: "ADD_EXPENSE", expense: { id: "NSQ-" + (5300 + s.expenses.length), title, amount: amt, paidBy: p.me, among, cat } });
    d({ type: "TOAST", toast: { text: `Split sent to ${among.length - 1} friends`, tone: "teal" } });
  };
  return (
    <form className="sheet-body" onSubmit={submit}>
      <div className="sheet-h"><strong>Add a shared expense</strong><button type="button" className="icon-btn" onClick={close} aria-label="Close"><Icon name="close" /></button></div>
      <label className="field"><span>What was it?</span><input id="exp-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Auto to Hudson Lane" /></label>
      <label className="field"><span>Amount</span>
        <div className="amount-in"><span>₹</span><input id="exp-amount" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} placeholder="120" /></div>
      </label>
      <div className="chips">
        {Object.entries(CATS).map(([k, c]) => <button type="button" key={k} className={"chip" + (cat === k ? " on" : "")} style={{ "--c": c.color }} onClick={() => setCat(k)}>{c.label}</button>)}
      </div>
      <span className="field-l">Split between</span>
      <div className="split-who">
        {Object.values(p.members).map((m) => (
          <button type="button" key={m.id} className={"who" + (among.includes(m.id) ? " on" : "")} onClick={() => toggle(m.id)}>
            <Avatar m={m} size={34} /><span>{m.id === p.me ? "You" : m.name}</span>
          </button>
        ))}
      </div>
      <div className="per-head"><span>Each person pays</span><strong>{inr(per)}</strong></div>
      <button className="btn btn-teal wide" type="submit" disabled={!amt || !title || among.length < 2}>Split {amt ? inr(amt) : ""} with squad</button>
    </form>
  );
}

export function SettleSheet({ s, d, data, close, auto }) {
  const p = P(s);
  const [stage, setStage] = useState("confirm");
  const to = p.members[data.to];
  const ref = "NSQ-" + (4900 + s.settlements.length);
  const pay = () => {
    setStage("pin");
    setTimeout(() => setStage("done"), 1100);
    setTimeout(() => {
      d({ type: "SETTLE", to: data.to, amount: data.amount, ref });
      d({ type: "TOAST", toast: { text: "+2 NeuCoins for settling", tone: "gold", coin: true } });
    }, 2000);
  };
  useEffect(() => { if (auto) { const t = setTimeout(pay, 900); return () => clearTimeout(t); } }, [auto]);
  return (
    <div className="sheet-body">
      <div className="sheet-h"><strong>Settle with {to.name}</strong><button className="icon-btn" onClick={close} aria-label="Close"><Icon name="close" /></button></div>
      <div className="upi-card">
        <Avatar m={to} size={46} />
        <div><strong>{to.full}</strong><span className="muted-s mono">{to.vpa}</span></div>
        <strong className="upi-amt">{inr(data.amount)}</strong>
      </div>
      <div className="upi-from"><span className="muted-s">Pay using</span><strong>Neu UPI · HDFC ••4821</strong></div>
      {stage === "confirm" && <button className="btn btn-teal wide" onClick={pay}>Pay {inr(data.amount)}</button>}
      {stage === "pin" && (
        <div className="pin"><span className="muted-s">Enter UPI PIN</span><div className="pin-dots">{[0, 1, 2, 3, 4, 5].map((i) => <span key={i} style={{ animationDelay: i * 0.12 + "s" }} />)}</div></div>
      )}
      {stage === "done" && (
        <div className="paid">
          <span className="paid-check"><Icon name="check" size={30} stroke={3} /></span>
          <strong>Paid {inr(data.amount)} to {to.name}</strong>
          <span className="muted-s mono">Ref {ref} · split ID sent in UPI note</span>
        </div>
      )}
      <p className="demo-note">Demo only. No money moves.</p>
    </div>
  );
}

export function UnlockSheet({ s, close }) {
  const p = P(s);
  return (
    <div className="sheet-body">
      <div className="sheet-h"><strong>What the jar can book</strong><button className="icon-btn" onClick={close} aria-label="Close"><Icon name="close" /></button></div>
      <p className="muted-s">At 100% the squad books inside Tata Neu. The jar pays first, NeuCoins cover the rest, and each friend approves their share.</p>
      <ul className="unlock-list">
        {p.unlocks.map((u) => (
          <li key={u.brand}><span className="unlock-ic"><Icon name={u.icon} size={18} /></span><div><strong>{u.brand}</strong><span className="muted-s">{u.what}</span></div><span className="soon">at 100%</span></li>
        ))}
      </ul>
      <div className="per-head"><span>Still to save</span><strong>{inr(p.jar.target - jarTotal(s))}</strong></div>
      <button className="btn btn-violet wide" onClick={close}>Keep saving</button>
    </div>
  );
}

export function PollSheet({ s, d, close }) {
  const p = P(s);
  const total = s.poll.options.reduce((a, o) => a + o.votes, 0);
  return (
    <div className="sheet-body">
      <div className="sheet-h"><strong>{s.poll.q}</strong><button className="icon-btn" onClick={close} aria-label="Close"><Icon name="close" /></button></div>
      <span className="muted-s">Poll by {p.members[s.poll.by].name} · picks under ₹1,500</span>
      <div className="poll-opts">
        {s.poll.options.map((o) => {
          const pc = total ? Math.round((o.votes / total) * 100) : 0;
          return (
            <button key={o.id} className={"poll-opt" + (s.poll.voted === o.id ? " on" : "")} onClick={() => d({ type: "VOTE", option: o.id })} disabled={!!s.poll.voted}>
              <span className="poll-fill" style={{ width: (s.poll.voted ? pc : 0) + "%" }} />
              <span className="poll-txt"><strong>{o.label}</strong><span className="muted-s">{o.src}</span></span>
              {s.poll.voted && <span className="poll-p">{pc}%</span>}
            </button>
          );
        })}
      </div>
      {s.poll.voted && <div className="badge-earned"><Icon name="trophy" size={16} /> Badge earned: Style Squad</div>}
    </div>
  );
}
