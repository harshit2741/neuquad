import React from "react";
import Portrait from "./Portrait.jsx";

// Small line-icon set drawn for the prototype (24×24 grid, stroke-based).
const P = {
  home: "M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  users: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8",
  crown: "M3 8l4 4 5-7 5 7 4-4-2 11H5z",
  user: "M20 21v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-3.5-3.5",
  bell: "M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0",
  cart: "M3 4h2l2.4 11h11L21 7H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
  shirt: "M8 3 3 6l2 5 3-1v11h8V10l3 1 2-5-5-3a4 4 0 0 1-8 0",
  tv: "M3 6h18v11H3zM8 21h8M12 17v4",
  plane: "M10.5 13.5 3 11l1.5-1.5 8 1L17 6a2 2 0 0 1 3 3l-4.5 4.5 1 8L15 23l-2.5-7.5L9 19v3l-1.5 1-1-3.5L3 18.5 4 17h3z",
  bed: "M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3M7 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  pill: "M10.5 3.5a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7-7zM7 7l7 7",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  receipt: "M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6M9 16h3",
  plus: "M12 5v14M5 12h14",
  check: "M5 12.5 10 17 19 7",
  close: "M6 6l12 12M18 6 6 18",
  chev: "M9 6l6 6-6 6",
  back: "M15 6l-6 6 6 6",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8M12 12h.01",
  jar: "M8 3h8M9 3v3a5 5 0 0 0-3 4.5V19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8.5A5 5 0 0 0 15 6V3",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4",
  lock: "M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3",
  shield: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  flame: "M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8a7 7 0 0 0 7 7",
  speaker: "M7 3h10v18H7zM12 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6M12 7h.01",
  share: "M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5",
  chat: "M4 5h16v11H9l-5 4z",
  wallet: "M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-4v4M16 14h2",
  coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M9 9h6M9 12h6M12 9c2 0 3 1 3 3s-3 3-3 3l3 3",
  poll: "M5 20V10M12 20V4M19 20v-7",
  qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z",
  play: "M7 4v16l13-8z",
  pause: "M7 4h3v16H7zM14 4h3v16h-3z",
  next: "M5 4v16l10-8zM17 4h2v16h-2z",
  prev: "M19 4v16L9 12zM5 4h2v16H5z",
  reset: "M4 12a8 8 0 1 0 3-6.2M4 4v5h5",
  wifi: "M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 11v5M12 8h.01",
};

export default function Icon({ name, size = 20, stroke = 1.8, className = "", style }) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={P[name] || P.info} />
    </svg>
  );
}

export function Avatar({ m, size = 30, ring = false }) {
  if (m.look || m.photo) {
    return (
      <span className={"avatar avatar-img" + (ring ? " avatar-ring" : "")} style={{ width: size, height: size }} title={m.full || m.name}>
        <Portrait look={m.look} photo={m.photo} size={size} title={m.full || m.name} />
      </span>
    );
  }
  return (
    <span className={"avatar" + (ring ? " avatar-ring" : "")} style={{ width: size, height: size, background: m.color, fontSize: size * 0.42 }} title={m.name}>
      {m.name[0]}
    </span>
  );
}

export function Coin({ size = 16 }) {
  return (
    <span className="coin" style={{ width: size, height: size, fontSize: size * 0.56 }} aria-hidden="true">N</span>
  );
}

export const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
