import { PERSONAS, UNIVERSAL } from "./personas.js";

export const P = (s) => PERSONAS[s.pid];
const r2 = (n) => Math.round(n * 100) / 100;
const STREAK = { rohan: 6, ananya: 4 };

// Net balance of each friend relative to me: positive = they owe me.
export function ledger(s) {
  const p = P(s);
  const ME = p.me;
  const net = {};
  Object.keys(p.members).forEach((m) => { if (m !== ME) net[m] = 0; });
  s.expenses.forEach((e) => {
    const share = e.amount / e.among.length;
    e.among.forEach((m) => {
      if (m === e.paidBy) return;
      if (e.paidBy === ME) net[m] += share;
      else if (m === ME) net[e.paidBy] -= share;
    });
  });
  s.settlements.forEach((x) => {
    if (x.from === ME) net[x.to] += x.amount;
    else if (x.to === ME) net[x.from] -= x.amount;
  });
  let owe = 0, get = 0;
  Object.keys(net).forEach((m) => {
    net[m] = r2(net[m]);
    if (net[m] < 0) owe += -net[m]; else get += net[m];
  });
  return { net, owe: r2(owe), get: r2(get) };
}

export function myShare(s, e) {
  return e.among.includes(P(s).me) ? e.amount / e.among.length : 0;
}

export function questSpent(s) {
  const q = P(s).quest;
  return Math.round(q.soloTracked + s.expenses.filter((e) => q.cats.includes(e.cat)).reduce((a, e) => a + myShare(s, e), 0));
}

export function jarTotal(s) {
  return Object.values(s.jar).reduce((a, b) => a + b, 0);
}
export function jarPct(s) {
  return Math.min(100, Math.round((jarTotal(s) / P(s).jar.target) * 100));
}

export function ev(t, name, payload) {
  return { id: Math.random().toString(36).slice(2), t, name, payload };
}

// The week's starting point: Monday, before the first beat.
export function startState(pid) {
  const p = PERSONAS[pid];
  const first = p.steps[0];
  return {
    pid,
    sheet: null,
    sheetData: null,
    push: null,
    toast: null,
    lock: false,
    questDone: false,
    poll: { ...p.poll, options: p.poll.options.map((o) => ({ ...o })), voted: null },
    joined: true,
    screen: "home",
    coins: UNIVERSAL.coinsStart,
    coinsWeek: 0,
    splitCoinsUsed: 0,
    nudges: 0,
    streak: STREAK[pid],
    jar: { ...p.jar.before },
    jarCoins: p.jar.coinsBefore,
    badges: [...p.badgesStart],
    expenses: p.expensesStart.map((e) => ({ ...e })),
    settlements: [],
    opens: [0, 0, 0, 0, 0, 0, 0],
    events: p.expensesStart.slice().reverse().map((e) => ev(`${e.day} ${e.time}`, "split_logged", { id: e.id, amount: e.amount, by: e.paidBy })),
    lastUpi: "",
    hook: "trigger",
    layer: "S",
    day: first.day,
    time: first.time,
    stepIndex: -1,
  };
}

const DAY_IDX = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

export function reducer(s, a) {
  const p = P(s);
  const stamp = `${s.day} ${s.time}`;
  const log = (name, payload) => [ev(stamp, name, payload), ...s.events].slice(0, 40);
  switch (a.type) {
    case "RESET":
      return a.state;
    case "NAV": {
      const opens = [...s.opens];
      if (a.countOpen) opens[DAY_IDX[s.day]] += 1;
      return { ...s, screen: a.screen, lock: false, sheet: null, opens, events: a.silent ? s.events : log("screen_view", { screen: a.screen }) };
    }
    case "CLOCK":
      return { ...s, day: a.day, time: a.time };
    case "HOOK":
      return { ...s, hook: a.hook, layer: a.layer ?? s.layer };
    case "STEP":
      return { ...s, stepIndex: a.index };
    case "PUSH":
      return { ...s, push: a.push, nudges: s.nudges + (a.push.kind === "nudge" ? 1 : 0), events: log("push_sent", { kind: a.push.kind, title: a.push.title }) };
    case "PUSH_CLEAR":
      return { ...s, push: null };
    case "OPEN_FROM_PUSH": {
      const opens = [...s.opens];
      opens[DAY_IDX[s.day]] += 1;
      return { ...s, push: null, lock: false, sheet: null, screen: a.screen, opens, events: log("push_opened", { to: a.screen }) };
    }
    case "TOAST":
      return { ...s, toast: a.toast };
    case "SHEET":
      return { ...s, sheet: a.sheet, sheetData: a.data ?? null };
    case "ADD_EXPENSE": {
      const e = { ...a.expense, day: s.day, time: s.time };
      return { ...s, sheet: null, expenses: [e, ...s.expenses], events: log("split_logged", { id: e.id, amount: e.amount, by: e.paidBy, among: e.among.length }) };
    }
    case "SETTLE": {
      const left = Math.max(0, UNIVERSAL.splitCoinCap - s.splitCoinsUsed);
      const earned = Math.min(2, left);
      const to = p.members[a.to];
      return {
        ...s,
        sheet: null,
        settlements: [...s.settlements, { from: p.me, to: a.to, amount: a.amount, day: s.day, time: s.time }],
        coins: s.coins + earned,
        coinsWeek: s.coinsWeek + earned,
        splitCoinsUsed: s.splitCoinsUsed + earned,
        lastUpi: `upi://pay?pa=${to.vpa}&am=${a.amount}&tn=${a.ref}`,
        events: [
          ev(stamp, "coins_awarded", { coins: earned, cap: `${s.splitCoinsUsed + earned}/${UNIVERSAL.splitCoinCap}` }),
          ev(stamp, "split_settled", { to: a.to, amount: a.amount, via: "neu_upi" }),
          ...s.events,
        ].slice(0, 40),
      };
    }
    case "AUTOSAVE": {
      const jar = { ...s.jar };
      Object.keys(jar).forEach((m) => { jar[m] += a.each; });
      const pct = Math.round((Object.values(jar).reduce((x, y) => x + y, 0) / p.jar.target) * 100);
      return { ...s, jar, jarCoins: p.jar.coinsAfter, events: log("jar_contributed", { jar: p.jar.short.toLowerCase(), each: a.each, pct }) };
    }
    case "TOPUP": {
      const jar = { ...s.jar, [p.me]: s.jar[p.me] + a.amount };
      return { ...s, jar, events: log("jar_contributed", { jar: p.jar.short.toLowerCase(), by: p.me, amount: a.amount }) };
    }
    case "VOTE": {
      if (s.poll.voted) return s;
      const poll = { ...s.poll, voted: a.option, options: s.poll.options.map((o) => (o.id === a.option ? { ...o, votes: o.votes + 1 } : o)) };
      const badges = s.badges.includes("Style Squad") ? s.badges : [...s.badges, "Style Squad"];
      return { ...s, poll, badges, events: log("poll_voted", { option: a.option }) };
    }
    case "LOCK":
      return { ...s, lock: a.on, sheet: null, nudges: s.nudges + (a.on ? 1 : 0), events: a.on ? log("push_sent", { kind: "nudge", title: "Sunday Scorecard" }) : s.events };
    case "QUEST_DONE":
      if (s.questDone) return s;
      return {
        ...s,
        questDone: true,
        coins: s.coins + p.quest.reward,
        coinsWeek: s.coinsWeek + p.quest.reward,
        streak: s.streak + 1,
        events: [ev(stamp, "streak_extended", { weeks: s.streak + 1 }), ev(stamp, "quest_completed", { coins: p.quest.reward }), ...s.events].slice(0, 40),
      };
    case "JOIN":
      return { ...s, joined: true, events: log("invite_accepted", { squad: p.squad.name }) };
    case "BRAND":
      return { ...s, events: log("brand_clickthrough", { brand: a.brand }) };
    default:
      return s;
  }
}
