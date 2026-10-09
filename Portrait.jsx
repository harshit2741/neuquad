import React from "react";

// Flat illustrated portraits, drawn in SVG so they ship with the page (no stock photos needed).
// look: { skin, hair, style: short|side|curly|long|braid|bun|hijab, top, collar, bg, glasses, beard, bindi, earrings, scarf }

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v));
  const r = c((n >> 16) + amt), g = c(((n >> 8) & 255) + amt), b = c((n & 255) + amt);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

export default function Portrait({ look, photo, size = 64, ring = false, title }) {
  const id = React.useId ? React.useId().replace(/:/g, "") : Math.random().toString(36).slice(2);
  // A real photo (imported image or data URI) replaces the drawing when provided.
  if (photo) {
    return <img src={photo} alt={title || ""} width={size} height={size} className={"portrait" + (ring ? " portrait-ring" : "")} style={{ objectFit: "cover" }} />;
  }
  const L = look;
  const skinD = shade(L.skin, -22);
  const hairHi = shade(L.hair, 28);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={"portrait" + (ring ? " portrait-ring" : "")}
      role="img"
      aria-label={title || "Illustrated portrait"}
    >
      <defs>
        <clipPath id={"pc" + id}><circle cx="60" cy="60" r="60" /></clipPath>
      </defs>
      <g clipPath={`url(#pc${id})`}>
        <rect width="120" height="120" fill={L.bg} />
        <circle cx="96" cy="22" r="26" fill="#ffffff" opacity=".35" />

        {/* hair behind the head */}
        {(L.style === "long" || L.style === "braid") && (
          <path d="M31 54C28 28 44 15 60 15s32 13 29 39l4 46c-12 6-54 6-66 0z" fill={L.hair} />
        )}
        {L.style === "hijab" && (
          <path d="M28 60C26 30 42 14 60 14s34 16 32 46l8 44c-16 10-64 10-80 0z" fill={L.scarf} />
        )}

        {/* shoulders and top */}
        <path d="M14 120c2-26 20-36 46-36s44 10 46 36z" fill={L.top} />
        {L.collar === "kurta" && <path d="M54 86l6 14 6-14" fill="none" stroke={shade(L.top, 50)} strokeWidth="2.4" strokeLinecap="round" />}
        {L.collar === "shirt" && <path d="M46 86l14 10 14-10-6 12h-16z" fill="#ffffff" opacity=".9" />}
        {L.collar === "hoodie" && <path d="M40 90c6 10 34 10 40 0" fill="none" stroke={shade(L.top, 40)} strokeWidth="5" strokeLinecap="round" />}
        {L.collar === "tee" && <path d="M48 87c4 6 20 6 24 0" fill="none" stroke={shade(L.top, 45)} strokeWidth="3" strokeLinecap="round" />}
        {L.style === "braid" && (
          <g fill={L.hair}>
            <ellipse cx="84" cy="88" rx="5" ry="7" /><ellipse cx="86" cy="100" rx="4.5" ry="6.5" /><ellipse cx="87" cy="111" rx="4" ry="6" />
          </g>
        )}

        {/* neck */}
        <path d="M51 66h18v18c-3 5-15 5-18 0z" fill={skinD} />

        {/* ears */}
        {L.style !== "hijab" && (
          <g fill={L.skin}>
            <ellipse cx="37.5" cy="52" rx="4.5" ry="6" /><ellipse cx="82.5" cy="52" rx="4.5" ry="6" />
          </g>
        )}
        {L.earrings && L.style !== "hijab" && (
          <g fill="#F5B700"><circle cx="37" cy="61" r="2.6" /><circle cx="83" cy="61" r="2.6" /></g>
        )}

        {/* face */}
        <ellipse cx="60" cy="50" rx="22" ry="25.5" fill={L.skin} />
        {L.beard && <path d="M39 52c1 18 10 25 21 25s20-7 21-25c-4 9-10 13-21 13s-17-4-21-13z" fill={L.hair} opacity=".92" />}

        {/* hair front */}
        {L.style === "short" && <path d="M37 47c-2-20 9-29 23-29 15 0 25 9 23 29-3-9-9-13-15-14-6 4-17 4-25 2-3 3-5 7-6 12z" fill={L.hair} />}
        {L.style === "side" && <path d="M37 48c-3-21 10-31 25-30 14 1 24 10 21 30-2-8-6-12-11-14-10 5-24 2-29-1-3 4-5 9-6 15z" fill={L.hair} />}
        {L.style === "curly" && (
          <g fill={L.hair}>
            <circle cx="42" cy="36" r="8" /><circle cx="51" cy="28" r="9" /><circle cx="62" cy="25" r="9.5" /><circle cx="73" cy="29" r="9" /><circle cx="80" cy="38" r="7.5" />
            <circle cx="38" cy="45" r="5.5" /><circle cx="83" cy="46" r="5" />
          </g>
        )}
        {(L.style === "long" || L.style === "braid") && <path d="M36 52c-2-23 10-33 24-33s26 10 24 33c-4-12-13-19-24-19-6 6-17 9-24 19z" fill={L.hair} />}
        {L.style === "bun" && (
          <g fill={L.hair}>
            <circle cx="60" cy="17" r="10" />
            <path d="M36 50c-2-21 10-31 24-31s26 10 24 31c-3-10-12-16-24-16s-21 6-24 16z" />
          </g>
        )}
        {L.style === "hijab" && <path d="M34 52c0-20 11-31 26-31s26 11 26 31c-6-13-15-18-26-18s-20 5-26 18z" fill={L.scarf} />}
        {L.style !== "hijab" && <path d="M48 24c6-3 14-3 20 0" stroke={hairHi} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".55" />}

        {/* brows, eyes, nose, mouth */}
        <path d="M45 43c3-2 7-2 10 0M65 43c3-2 7-2 10 0" stroke={L.hair === "#120c08" ? "#120c08" : shade(L.hair, -5)} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="50" rx="2.6" ry="3" fill="#1b120c" />
        <ellipse cx="70" cy="50" rx="2.6" ry="3" fill="#1b120c" />
        <circle cx="51" cy="49" r=".9" fill="#fff" /><circle cx="71" cy="49" r=".9" fill="#fff" />
        <path d="M60 52c-1 4-2 7 1 8" stroke={skinD} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M52 64c5 4 11 4 16 0" stroke="#7a2e2e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <ellipse cx="45" cy="59" rx="4" ry="2.4" fill="#e0607e" opacity=".18" /><ellipse cx="75" cy="59" rx="4" ry="2.4" fill="#e0607e" opacity=".18" />
        {L.bindi && <circle cx="60" cy="38.5" r="2" fill="#c8102e" />}
        {L.glasses && (
          <g fill="none" stroke="#1c1235" strokeWidth="2">
            <rect x="41.5" y="44" width="15" height="12" rx="5" /><rect x="63.5" y="44" width="15" height="12" rx="5" /><path d="M56.5 49h7" />
          </g>
        )}
      </g>
    </svg>
  );
}
