// "Play the week": each persona's Monday to Sunday, written as a list of operations.
// The same list drives the animated run and the instant jump-to-day states.
import { PERSONAS } from "./personas.js";
import { reducer, startState, ledger, questSpent, jarTotal, P } from "./store.js";

export class Cancelled extends Error {}

export function makeWait(token) {
  return (ms) => new Promise((res, rej) => setTimeout(() => (token.cancelled ? rej(new Cancelled()) : res()), ms));
}

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const addMin = (t, m) => {
  const [h, mm] = t.split(":").map(Number);
  const tot = h * 60 + mm + m;
  return `${String(Math.floor(tot / 60) % 24).padStart(2, "0")}:${String(tot % 60).padStart(2, "0")}`;
};

export function scriptFor(pid) {
  const p = PERSONAS[pid];
  const [mon, wed, fri, sat, sun] = p.steps;
  const name = (id) => p.members[id].name;
  const share = (e) => e.amount / e.among.length;
  return [
    // Monday: a friend's split is the trigger; settling is the action.
    [
      { t: "clock", day: mon.day, time: mon.time },
      { t: "hook", hook: "trigger", layer: "S" },
      { t: "nav", screen: "home", silent: true },
      { t: "wait", ms: 700 },
      { t: "add", expense: p.exp.mon },
      {
        t: "push", kind: "friend", target: "squad",
        title: `${name(p.exp.mon.paidBy)} split ${p.exp.mon.title}, ${inr(p.exp.mon.amount)}`,
        body: (s) => {
          const owe = -ledger(s).net[p.exp.mon.paidBy];
          const sh = share(p.exp.mon);
          return owe < sh - 0.5
            ? `Your share is ${inr(sh)}. ${name(p.exp.mon.paidBy)} owes you ${inr(sh - owe)}, so you pay ${inr(owe)}.`
            : `Your share is ${inr(sh)}. Settle in one tap.`;
        },
      },
      { t: "wait", ms: 2600 },
      { t: "open", screen: "squad" },
      { t: "hook", hook: "action" },
      { t: "wait", ms: 1300 },
      { t: "settle", to: p.exp.mon.paidBy },
      { t: "hook", hook: "reward" },
      { t: "wait", ms: 1600 },
      { t: "hook", hook: "investment" },
      { t: "wait", ms: 900 },
    ],
    // Wednesday: the quest nudge brings them back without a purchase.
    [
      { t: "clock", day: wed.day, time: wed.time },
      { t: "hook", hook: "trigger", layer: "Q" },
      { t: "add", expense: p.exp.wed },
      {
        t: "push", kind: "nudge", target: "quest",
        title: (s) => `${inr(p.quest.cap - questSpent(s))} left in this week's ${p.quest.label.toLowerCase()}`,
        body: `${name(p.exp.wed.paidBy)} split ${p.exp.wed.title}, ${inr(p.exp.wed.amount)}. Your share is ${inr(share(p.exp.wed))}.`,
      },
      { t: "wait", ms: 2600 },
      { t: "open", screen: "quest" },
      { t: "hook", hook: "action" },
      { t: "wait", ms: 1900 },
      { t: "hook", hook: "reward" },
      { t: "toast", toast: { text: `Stay under ${inr(p.quest.cap)} to win +${p.quest.reward} NeuCoins`, tone: "gold", coin: true } },
      { t: "wait", ms: 1800 },
      { t: "hook", hook: "investment" },
      { t: "wait", ms: 900 },
    ],
    // Friday: they log a shared cost, then the squad auto-save fills the jar.
    [
      { t: "clock", day: fri.day, time: fri.time },
      { t: "hook", hook: "trigger", layer: "S" },
      { t: "nav", screen: "squad", countOpen: true },
      { t: "wait", ms: 900 },
      { t: "addSheet", expense: p.exp.fri },
      { t: "wait", ms: 1600 },
      { t: "clock", day: fri.day, time: addMin(fri.time, 11) },
      { t: "autosave", each: p.jar.autosave },
      { t: "hook", hook: "reward", layer: "U" },
      {
        t: "push", kind: "nudge", target: "jar",
        title: (s) => `${p.jar.short} jar hit ${Math.round((jarTotal(s) / p.jar.target) * 100)}%`,
        body: (s) => `Friday auto-save: ${inr(p.jar.autosave)} each. ${inr(p.jar.target - jarTotal(s))} to go.`,
      },
      { t: "wait", ms: 2300 },
      { t: "open", screen: "jar" },
      { t: "hook", hook: "investment" },
      { t: "wait", ms: 1800 },
    ],
    // Saturday: a friend's poll surfaces Tata brands at the moment of need.
    [
      { t: "clock", day: sat.day, time: sat.time },
      { t: "hook", hook: "trigger", layer: "D" },
      { t: "push", kind: "friend", target: "squad", title: `${name(p.poll.by)} started a poll`, body: `${p.poll.q} Picks from Tata CLiQ and Westside.` },
      { t: "wait", ms: 2300 },
      { t: "open", screen: "squad" },
      { t: "wait", ms: 800 },
      { t: "hook", hook: "action" },
      { t: "poll", option: p.poll.vote },
      { t: "toast", toast: { text: "Badge earned: Style Squad", tone: "magenta" } },
      { t: "hook", hook: "investment" },
      { t: "wait", ms: 1200 },
    ],
    // Sunday: the scorecard closes the loop and sets next week's quest.
    [
      { t: "clock", day: sun.day, time: sun.time },
      { t: "hook", hook: "trigger", layer: "A" },
      { t: "lock" },
      { t: "wait", ms: 2800 },
      { t: "open", screen: "scorecard" },
      { t: "hook", hook: "reward" },
      { t: "wait", ms: 2200 },
      { t: "toast", toast: (s) => ({ text: `+${p.quest.reward} NeuCoins · streak now ${s.questDone ? s.streak : s.streak + 1} weeks`, tone: "gold", coin: true }) },
      { t: "hook", hook: "investment" },
      { t: "wait", ms: 1500 },
    ],
  ];
}

const val = (x, s) => (typeof x === "function" ? x(s) : x);

// Apply a beat instantly (no animation) to a state object.
function applyInstant(s, ops) {
  const run = (a) => { s = reducer(s, a); };
  ops.forEach((op) => {
    switch (op.t) {
      case "clock": run({ type: "CLOCK", day: op.day, time: op.time }); break;
      case "nav": run({ type: "NAV", screen: op.screen, countOpen: op.countOpen, silent: true }); break;
      case "add": run({ type: "ADD_EXPENSE", expense: op.expense }); break;
      case "addSheet": run({ type: "ADD_EXPENSE", expense: op.expense }); break;
      case "push": run({ type: "PUSH", push: { kind: op.kind, title: val(op.title, s), body: val(op.body, s), target: op.target } }); run({ type: "PUSH_CLEAR" }); break;
      case "open": run({ type: "OPEN_FROM_PUSH", screen: op.screen }); break;
      case "settle": run({ type: "SETTLE", to: op.to, amount: -ledger(s).net[op.to], ref: "NSQ-" + (4900 + s.settlements.length) }); break;
      case "autosave": run({ type: "AUTOSAVE", each: op.each }); break;
      case "poll": run({ type: "VOTE", option: op.option }); break;
      default: break;
    }
  });
  return s;
}

export function preState(pid, i) {
  const beats = scriptFor(pid);
  let s = startState(pid);
  for (let k = 0; k < i; k++) s = applyInstant(s, beats[k]);
  return { ...s, push: null, toast: null, sheet: null, stepIndex: i - 1 };
}

// The page's resting view: the end of Friday, matching the deck numbers.
export function defaultState(pid = "rohan") {
  const p = PERSONAS[pid];
  const s = preState(pid, 3);
  return { ...s, screen: "squad", day: p.defaultClock.day, time: p.defaultClock.time, badges: [...p.badgesAfter], hook: "investment", layer: "U", stepIndex: -1 };
}

// Animated run of one beat.
export async function runBeat(ops, d, wait, getState) {
  let local = getState();
  const dd = (a) => { local = reducer(local, a); d(a); };
  for (const op of ops) {
    switch (op.t) {
      case "clock": dd({ type: "CLOCK", day: op.day, time: op.time }); break;
      case "hook": dd({ type: "HOOK", hook: op.hook, layer: op.layer }); break;
      case "nav": dd({ type: "NAV", screen: op.screen, countOpen: op.countOpen, silent: op.silent }); break;
      case "add": dd({ type: "ADD_EXPENSE", expense: op.expense }); break;
      case "push": dd({ type: "PUSH", push: { kind: op.kind, title: val(op.title, local), body: val(op.body, local), target: op.target, sticky: true } }); break;
      case "open": dd({ type: "OPEN_FROM_PUSH", screen: op.screen }); break;
      case "wait": await wait(op.ms); break;
      case "toast": dd({ type: "TOAST", toast: val(op.toast, local) }); break;
      case "autosave": dd({ type: "AUTOSAVE", each: op.each }); break;
      case "lock": dd({ type: "LOCK", on: true }); dd({ type: "PUSH_CLEAR" }); break;
      case "settle": {
        const amount = -ledger(local).net[op.to];
        dd({ type: "SHEET", sheet: "settle", data: { to: op.to, amount, auto: true } });
        await wait(3400);
        local = getState();
        break;
      }
      case "addSheet": {
        dd({ type: "SHEET", sheet: "add", data: { ...op.expense } });
        await wait(2600);
        dd({ type: "ADD_EXPENSE", expense: op.expense });
        dd({ type: "TOAST", toast: { text: `Split sent to ${op.expense.among.length - 1} friends`, tone: "teal" } });
        break;
      }
      case "poll": {
        dd({ type: "SHEET", sheet: "poll" });
        await wait(1700);
        dd({ type: "VOTE", option: op.option });
        dd({ type: "HOOK", hook: "reward" });
        await wait(2200);
        dd({ type: "SHEET", sheet: null });
        break;
      }
      default: break;
    }
  }
}
