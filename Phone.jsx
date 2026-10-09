import React, { useEffect } from "react";
import Icon from "./Icon.jsx";
import {
  HomeScreen, InviteScreen, SquadScreen, QuestScreen, JarScreen, ScorecardScreen, LockScreen,
  AddExpenseSheet, SettleSheet, UnlockSheet, PollSheet,
} from "./Screens.jsx";

const SCREENS = {
  home: HomeScreen,
  invite: InviteScreen,
  squad: SquadScreen,
  quest: QuestScreen,
  jar: JarScreen,
  scorecard: ScorecardScreen,
};

export default function Phone({ s, d, go, phoneRef }) {
  const Screen = SCREENS[s.screen] || SquadScreen;
  const close = () => d({ type: "SHEET", sheet: null });

  useEffect(() => {
    if (!s.toast) return;
    const t = setTimeout(() => d({ type: "TOAST", toast: null }), 2600);
    return () => clearTimeout(t);
  }, [s.toast]);

  useEffect(() => {
    if (!s.push || s.push.sticky) return;
    const t = setTimeout(() => d({ type: "PUSH_CLEAR" }), 5200);
    return () => clearTimeout(t);
  }, [s.push]);

  const darkStatus = s.lock || ["squad", "quest", "jar", "scorecard"].includes(s.screen);
  const navOn = (k) => (k === "squad" ? ["squad", "quest", "jar", "scorecard"].includes(s.screen) : s.screen === k);

  return (
    <div className="phone" ref={phoneRef}>
      <div className="phone-btn b1" /><div className="phone-btn b2" /><div className="phone-btn b3" />
      <div className="phone-screen">
        <div className={"status" + (darkStatus ? " on-dark" : "")}>
          <span className="status-time">{s.lock ? "" : s.time}</span>
          <span className="island" />
          <span className="status-ic"><Icon name="wifi" size={15} stroke={2.2} /><span className="batt"><span /></span></span>
        </div>

        {s.lock ? (
          <LockScreen s={s} d={d} open={() => d({ type: "OPEN_FROM_PUSH", screen: "scorecard" })} />
        ) : (
          <div className="viewport" key={s.screen}>
            <Screen s={s} go={go} d={d} />
          </div>
        )}

        {!s.lock && (
          <nav className="tabbar" aria-label="Tata Neu app navigation">
            <button className={navOn("home") ? "on" : ""} onClick={() => go("home")}><Icon name="home" size={21} /><span>Home</span></button>
            <button><Icon name="grid" size={21} /><span>Categories</span></button>
            <button className={"tab-squad" + (navOn("squad") ? " on" : "")} onClick={() => go("squad", true)}>
              <span className="tab-squad-disc"><Icon name="users" size={22} /></span><span>NeuSquad</span>
            </button>
            <button><Icon name="crown" size={21} /><span>NeuPass</span></button>
            <button><Icon name="user" size={21} /><span>Account</span></button>
          </nav>
        )}

        {s.push && (
          <button className="push" onClick={() => d({ type: "OPEN_FROM_PUSH", screen: s.push.target })}>
            <span className="app-badge">N</span>
            <span className="push-txt">
              <span className="push-top"><strong>NeuSquad</strong><span>now</span></span>
              <strong className="push-title">{s.push.title}</strong>
              <span>{s.push.body}</span>
            </span>
          </button>
        )}

        {s.toast && (
          <div className={"toast tone-" + (s.toast.tone || "teal")} role="status">
            {s.toast.coin && <span className="coin" style={{ width: 16, height: 16, fontSize: 9 }}>N</span>}
            {s.toast.text}
          </div>
        )}

        <div className={"scrim" + (s.sheet ? " on" : "")} onClick={close} />
        <div className={"sheet" + (s.sheet ? " on" : "")} aria-hidden={!s.sheet}>
          <span className="grabber" />
          {s.sheet === "add" && <AddExpenseSheet s={s} d={d} prefill={s.sheetData} close={close} />}
          {s.sheet === "settle" && s.sheetData && <SettleSheet s={s} d={d} data={s.sheetData} auto={s.sheetData.auto} close={close} />}
          {s.sheet === "unlock" && <UnlockSheet s={s} d={d} close={close} />}
          {s.sheet === "poll" && <PollSheet s={s} d={d} close={close} />}
        </div>

        <span className="home-ind" />
      </div>
    </div>
  );
}
