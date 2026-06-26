import { useState, useMemo, useEffect } from "react";

// Country flag emoji helper
const FLAGS = {
  "Mexico":"🇲🇽","South Africa":"🇿🇦","South Korea":"🇰🇷","Czechia":"🇨🇿",
  "Switzerland":"🇨🇭","Canada":"🇨🇦","Bosnia":"🇧🇦","Qatar":"🇶🇦",
  "Brazil":"🇧🇷","Morocco":"🇲🇦","Scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Haiti":"🇭🇹",
  "USA":"🇺🇸","Australia":"🇦🇺","Paraguay":"🇵🇾","Turkey":"🇹🇷",
  "Ivory Coast":"🇨🇮","Germany":"🇩🇪","Ecuador":"🇪🇨","Curaçao":"🇨🇼",
  "Netherlands":"🇳🇱","Japan":"🇯🇵","Sweden":"🇸🇪","Tunisia":"🇹🇳",
  "Egypt":"🇪🇬","Iran":"🇮🇷","Belgium":"🇧🇪","New Zealand":"🇳🇿",
  "Spain":"🇪🇸","Uruguay":"🇺🇾","Cape Verde":"🇨🇻","Saudi Arabia":"🇸🇦",
  "France":"🇫🇷","Norway":"🇳🇴","Senegal":"🇸🇳","Iraq":"🇮🇶",
  "Argentina":"🇦🇷","Austria":"🇦🇹","Algeria":"🇩🇿","Jordan":"🇯🇴",
  "Colombia":"🇨🇴","Portugal":"🇵🇹","DR Congo":"🇨🇩","Uzbekistan":"🇺🇿",
  "England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Ghana":"🇬🇭","Croatia":"🇭🇷","Panama":"🇵🇦",
};
const flag = (name) => FLAGS[name] || "🏳️";

const CONFIRMED = [
  { name:"Mexico",       group:"A", pos:"Winner"    },
  { name:"South Africa", group:"A", pos:"Runner-up" },
  { name:"Switzerland",  group:"B", pos:"Winner"    },
  { name:"Canada",       group:"B", pos:"Runner-up" },
  { name:"Brazil",       group:"C", pos:"Winner"    },
  { name:"Morocco",      group:"C", pos:"Runner-up" },
  { name:"USA",          group:"D", pos:"Winner"    },
  { name:"Australia",    group:"D", pos:"Runner-up" },
  { name:"Ivory Coast",  group:"E", pos:"Winner"    },
  { name:"Germany",      group:"E", pos:"Runner-up" },
  { name:"Ecuador",      group:"E", pos:"3rd place" },
  { name:"Netherlands",  group:"F", pos:"Winner"    },
  { name:"Japan",        group:"F", pos:"Runner-up" },
  { name:"Sweden",       group:"F", pos:"3rd place" },
  { name:"Spain",        group:"H", pos:"Winner"    },
  { name:"France",       group:"I", pos:"Winner"    },
  { name:"Norway",       group:"I", pos:"Runner-up" },
  { name:"Argentina",    group:"J", pos:"Winner"    },
  { name:"Austria",      group:"J", pos:"Runner-up" },
  { name:"Colombia",     group:"K", pos:"Winner"    },
];

const ELIMINATED = [
  { name:"Haiti",      group:"C" },
  { name:"Turkey",     group:"D" },
  { name:"Curaçao",    group:"E" },
  { name:"Tunisia",    group:"F" },
  { name:"Jordan",     group:"J" },
  { name:"Panama",     group:"L" },
  { name:"Qatar",      group:"B" },
  { name:"Czechia",    group:"A" },
];

const ALL_TEAMS = [
  { name:"Mexico",       group:"A", pos:1, pts:9, status:"confirmed",  prob:null, note:"Won all 3 — Group winner" },
  { name:"South Africa", group:"A", pos:2, pts:6, status:"confirmed",  prob:null, note:"Runner-up · upset S.Korea 1–0" },
  { name:"South Korea",  group:"A", pos:3, pts:3, status:"bubble",     prob:45,   note:"3 pts · 3rd place battle" },
  { name:"Czechia",      group:"A", pos:4, pts:1, status:"eliminated", prob:0,    note:"Lost 0–3 to Mexico" },
  { name:"Switzerland",  group:"B", pos:1, pts:7, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Canada",       group:"B", pos:2, pts:4, status:"confirmed",  prob:null, note:"Runner-up confirmed" },
  { name:"Bosnia",       group:"B", pos:3, pts:4, status:"likely_in",  prob:80,   note:"W 3–1 vs Qatar · strong 3rd" },
  { name:"Qatar",        group:"B", pos:4, pts:1, status:"eliminated", prob:0,    note:"Confirmed out" },
  { name:"Brazil",       group:"C", pos:1, pts:7, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Morocco",      group:"C", pos:2, pts:7, status:"confirmed",  prob:null, note:"Runner-up confirmed" },
  { name:"Scotland",     group:"C", pos:3, pts:3, status:"bubble",     prob:83,   note:"L 0–3 Brazil · GD –3 · needs help" },
  { name:"Haiti",        group:"C", pos:4, pts:0, status:"eliminated", prob:0,    note:"Confirmed out" },
  { name:"USA",          group:"D", pos:1, pts:6, status:"confirmed",  prob:null, note:"Group winner · L 2–3 vs Turkey (already qualified)" },
  { name:"Australia",    group:"D", pos:2, pts:5, status:"confirmed",  prob:null, note:"Runner-up · D 0–0 vs Paraguay" },
  { name:"Paraguay",     group:"D", pos:3, pts:4, status:"likely_in",  prob:75,   note:"D 0–0 vs Australia · strong 3rd place" },
  { name:"Turkey",       group:"D", pos:4, pts:3, status:"eliminated", prob:0,    note:"W 2–3 vs USA but eliminated on tiebreaker" },
  { name:"Ivory Coast",  group:"E", pos:1, pts:7, status:"confirmed",  prob:null, note:"Group winner · W 2–0 vs Curaçao" },
  { name:"Germany",      group:"E", pos:2, pts:6, status:"confirmed",  prob:null, note:"Runner-up · shocked by Ecuador 1–2" },
  { name:"Ecuador",      group:"E", pos:3, pts:4, status:"confirmed",  prob:null, note:"🚨 W 2–1 vs Germany · confirmed 3rd" },
  { name:"Curaçao",      group:"E", pos:4, pts:1, status:"eliminated", prob:0,    note:"L 0–2 vs Ivory Coast" },
  { name:"Netherlands",  group:"F", pos:1, pts:7, status:"confirmed",  prob:null, note:"Group winner · W 3–1 vs Tunisia" },
  { name:"Japan",        group:"F", pos:2, pts:5, status:"confirmed",  prob:null, note:"Runner-up · D 1–1 vs Sweden" },
  { name:"Sweden",       group:"F", pos:3, pts:4, status:"confirmed",  prob:null, note:"D 1–1 vs Japan · confirmed 3rd" },
  { name:"Tunisia",      group:"F", pos:4, pts:0, status:"eliminated", prob:0,    note:"L 1–3 vs Netherlands" },
  { name:"Egypt",        group:"G", pos:1, pts:4, status:"likely_in",  prob:78,   note:"Playing Iran Jun 26" },
  { name:"Iran",         group:"G", pos:2, pts:2, status:"bubble",     prob:33,   note:"Playing Egypt Jun 26" },
  { name:"Belgium",      group:"G", pos:3, pts:2, status:"bubble",     prob:96,   note:"3rd place contender · vs NZ Jun 27" },
  { name:"New Zealand",  group:"G", pos:4, pts:1, status:"likely_out", prob:11,   note:"Playing Belgium Jun 27" },
  { name:"Spain",        group:"H", pos:1, pts:7, status:"confirmed",  prob:null, note:"Confirmed through" },
  { name:"Uruguay",      group:"H", pos:2, pts:3, status:"bubble",     prob:44,   note:"Playing Spain Jun 27" },
  { name:"Cape Verde",   group:"H", pos:3, pts:2, status:"bubble",     prob:40,   note:"3rd place contender · vs S.Arabia" },
  { name:"Saudi Arabia", group:"H", pos:4, pts:1, status:"likely_out", prob:10,   note:"Playing Cape Verde Jun 26" },
  { name:"France",       group:"I", pos:1, pts:6, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Norway",       group:"I", pos:2, pts:6, status:"confirmed",  prob:null, note:"Runner-up confirmed" },
  { name:"Senegal",      group:"I", pos:3, pts:0, status:"bubble",     prob:20,   note:"3rd place long shot · vs Iraq Jun 26" },
  { name:"Iraq",         group:"I", pos:4, pts:0, status:"likely_out", prob:8,    note:"Playing Senegal Jun 26" },
  { name:"Argentina",    group:"J", pos:1, pts:6, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Austria",      group:"J", pos:2, pts:6, status:"confirmed",  prob:null, note:"Runner-up confirmed" },
  { name:"Algeria",      group:"J", pos:3, pts:3, status:"bubble",     prob:86,   note:"3rd place contender · vs Austria" },
  { name:"Jordan",       group:"J", pos:4, pts:1, status:"eliminated", prob:0,    note:"Confirmed out" },
  { name:"Colombia",     group:"K", pos:1, pts:6, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Portugal",     group:"K", pos:2, pts:4, status:"likely_in",  prob:98,   note:"Virtual lock · vs Colombia" },
  { name:"DR Congo",     group:"K", pos:3, pts:1, status:"likely_out", prob:14,   note:"Need win + help" },
  { name:"Uzbekistan",   group:"K", pos:4, pts:1, status:"likely_out", prob:9,    note:"Need win + help" },
  { name:"England",      group:"L", pos:1, pts:4, status:"likely_in",  prob:99,   note:"Playing Panama Jun 27" },
  { name:"Ghana",        group:"L", pos:2, pts:4, status:"likely_in",  prob:75,   note:"Playing Croatia Jun 28" },
  { name:"Croatia",      group:"L", pos:3, pts:3, status:"bubble",     prob:29,   note:"3rd place contender · vs Ghana" },
  { name:"Panama",       group:"L", pos:4, pts:0, status:"eliminated", prob:0,    note:"Confirmed out" },
];

const STATUS_CONFIG = {
  confirmed:  { label:"Confirmed through", short:"In",        bg:"#dcfce7", text:"#166534", border:"#86efac", dot:"#16a34a" },
  likely_in:  { label:"Likely through",    short:"Likely in", bg:"#d1fae5", text:"#065f46", border:"#6ee7b7", dot:"#059669" },
  bubble:     { label:"On the bubble",     short:"Bubble",    bg:"#fef9c3", text:"#854d0e", border:"#fde047", dot:"#ca8a04" },
  likely_out: { label:"Likely out",        short:"At risk",   bg:"#fee2e2", text:"#991b1b", border:"#fca5a5", dot:"#dc2626" },
  eliminated: { label:"Confirmed out",     short:"Out",       bg:"#f1f5f9", text:"#64748b", border:"#cbd5e1", dot:"#94a3b8" },
};

const THIRD_TEAMS = [
  { team:"Bosnia",      group:"B", pts:4, gf:5, ga:6, done:true,  result:"W 3–1 vs Qatar" },
  { team:"Sweden",      group:"F", pts:4, gf:7, ga:7, done:true,  result:"D 1–1 vs Japan · confirmed" },
  { team:"Ecuador",     group:"E", pts:4, gf:2, ga:2, done:true,  result:"🚨 W 2–1 vs Germany" },
  { team:"Paraguay",    group:"D", pts:4, gf:2, ga:4, done:true,  result:"D 0–0 vs Australia" },
  { team:"Scotland",    group:"C", pts:3, gf:1, ga:4, done:true,  result:"L 0–3 vs Brazil" },
  { team:"South Africa",group:"A", pts:3, gf:1, ga:2, done:true,  result:"W 1–0 vs S.Korea" },
  { team:"Croatia",     group:"L", pts:3, gf:3, ga:4, done:false, opp:"Ghana",         date:"Sat Jun 28", w:27.7, d:30.3, l:42.1 },
  { team:"Algeria",     group:"J", pts:3, gf:2, ga:4, done:false, opp:"Austria",       date:"Sat Jun 28", w:44.2, d:26.8, l:29.0 },
  { team:"Cape Verde",  group:"H", pts:2, gf:2, ga:2, done:false, opp:"Saudi Arabia",  date:"Fri Jun 27", w:31.0, d:29.2, l:39.7 },
  { team:"Belgium",     group:"G", pts:2, gf:1, ga:1, done:false, opp:"New Zealand",   date:"Sat Jun 27", w:70.0, d:17.8, l:12.2 },
  { team:"DR Congo",    group:"K", pts:1, gf:1, ga:2, done:false, opp:"Uzbekistan",    date:"Sun Jun 29", w:32.2, d:29.2, l:38.6 },
  { team:"Senegal",     group:"I", pts:0, gf:3, ga:6, done:false, opp:"Iraq",          date:"Fri Jun 27", w:26.8, d:28.5, l:44.7 },
];

// Only UPCOMING group stage matches + confirmed knockout fixtures
// Scores shown for completed matches in knockout data
const SCHEDULE = [
  // ── REMAINING GROUP STAGE (all UTC, converted to local in UI) ─────────────
  // Jun 26 ET = Jun 27 PHT
  { stage:"Group", home:"Norway",      away:"France",        group:"I", utc:"2026-06-26T19:00:00Z", venue:"Gillette Stadium, Boston",    durationMins:105 },
  { stage:"Group", home:"Senegal",     away:"Iraq",          group:"I", utc:"2026-06-26T19:00:00Z", venue:"BMO Field, Toronto",           durationMins:105 },
  { stage:"Group", home:"Cape Verde",  away:"Saudi Arabia",  group:"H", utc:"2026-06-27T00:00:00Z", venue:"NRG Stadium, Houston",         durationMins:105 },
  // Jun 26 late ET = Jun 27 PHT
  { stage:"Group", home:"Egypt",       away:"Iran",          group:"G", utc:"2026-06-27T03:00:00Z", venue:"Lumen Field, Seattle",         durationMins:105 },
  { stage:"Group", home:"New Zealand", away:"Belgium",       group:"G", utc:"2026-06-27T03:00:00Z", venue:"BC Place, Vancouver",          durationMins:105 },
  // Jun 27 ET = Jun 28 PHT
  { stage:"Group", home:"Uruguay",     away:"Spain",         group:"H", utc:"2026-06-28T00:00:00Z", venue:"Estadio Akron, Guadalajara",   durationMins:105 },
  { stage:"Group", home:"Panama",      away:"England",       group:"L", utc:"2026-06-28T02:00:00Z", venue:"MetLife Stadium, NJ",          durationMins:105 },
  { stage:"Group", home:"Croatia",     away:"Ghana",         group:"L", utc:"2026-06-28T02:00:00Z", venue:"Lincoln Financial, Philly",    durationMins:105 },
  { stage:"Group", home:"Algeria",     away:"Austria",       group:"J", utc:"2026-06-28T02:00:00Z", venue:"Arrowhead Stadium, KC",        durationMins:105 },
  { stage:"Group", home:"Jordan",      away:"Argentina",     group:"J", utc:"2026-06-28T02:00:00Z", venue:"AT&T Stadium, Dallas",         durationMins:105 },
  // Jun 28 ET = Jun 29 PHT
  { stage:"Group", home:"Colombia",    away:"Portugal",      group:"K", utc:"2026-06-29T02:00:00Z", venue:"Hard Rock Stadium, Miami",     durationMins:105 },
  { stage:"Group", home:"DR Congo",    away:"Uzbekistan",    group:"K", utc:"2026-06-29T02:00:00Z", venue:"Mercedes-Benz, Atlanta",       durationMins:105 },

  // ── ROUND OF 32 ───────────────────────────────────────────────────────────
  // Jun 28 ET (Jun 29 PHT)
  { stage:"R32", home:"South Africa",  away:"Canada",        group:"", utc:"2026-06-29T00:00:00Z", venue:"SoFi Stadium, LA",             durationMins:120, note:"M73" },
  // Jun 29 ET (Jun 30 PHT)
  { stage:"R32", home:"Brazil",        away:"Japan",         group:"", utc:"2026-06-29T17:00:00Z", venue:"NRG Stadium, Houston",         durationMins:120, note:"M76" },
  { stage:"R32", home:"Germany",       away:"Paraguay",      group:"", utc:"2026-06-29T20:30:00Z", venue:"Gillette Stadium, Boston",     durationMins:120, note:"M74 · Grp E W vs Grp D 3rd" },
  { stage:"R32", home:"Netherlands",   away:"Morocco",       group:"", utc:"2026-06-30T01:00:00Z", venue:"Estadio BBVA, Monterrey",      durationMins:120, note:"M75 · Grp F W vs Grp C RU" },
  // Jun 30 ET (Jul 1 PHT)
  { stage:"R32", home:"Ivory Coast",   away:"Norway",        group:"", utc:"2026-06-30T17:00:00Z", venue:"AT&T Stadium, Arlington",      durationMins:120, note:"M78 · Grp E RU vs Grp I RU" },
  { stage:"R32", home:"France",        away:"Sweden",        group:"", utc:"2026-06-30T21:00:00Z", venue:"MetLife Stadium, NJ",          durationMins:120, note:"M77 · Grp I W vs Grp F 3rd" },
  { stage:"R32", home:"Mexico",        away:"Scotland",      group:"", utc:"2026-07-01T01:00:00Z", venue:"Estadio Azteca, Mexico City",  durationMins:120, note:"M79 · Grp A W vs Grp C 3rd 🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  // Jul 1 ET (Jul 2 PHT)
  { stage:"R32", home:"England",       away:"TBD Grp H 3rd", group:"", utc:"2026-07-01T17:00:00Z", venue:"Mercedes-Benz, Atlanta",       durationMins:120, note:"M80 · Grp L W vs 3rd E/H/I/J/K" },
  { stage:"R32", home:"TBD Grp G W",   away:"TBD Grp A 3rd", group:"", utc:"2026-07-01T21:00:00Z", venue:"Lumen Field, Seattle",         durationMins:120, note:"M82 · Egypt/Iran vs 3rd A/E/H/I/J" },
  { stage:"R32", home:"USA",           away:"Bosnia",        group:"", utc:"2026-07-02T00:00:00Z", venue:"Levi's Stadium, SF",           durationMins:120, note:"M81" },
  // Jul 2 ET (Jul 3 PHT)
  { stage:"R32", home:"TBD Grp H W",   away:"TBD Grp J RU",  group:"", utc:"2026-07-02T19:00:00Z", venue:"SoFi Stadium, LA",             durationMins:120, note:"M84 · Spain/Uruguay vs Austria/Algeria" },
  { stage:"R32", home:"TBD Grp K RU",  away:"TBD Grp L RU",  group:"", utc:"2026-07-02T23:00:00Z", venue:"BMO Field, Toronto",           durationMins:120, note:"M83 · Portugal vs Ghana/Croatia" },
  { stage:"R32", home:"Switzerland",   away:"TBD 3rd",       group:"", utc:"2026-07-03T03:00:00Z", venue:"BC Place, Vancouver",          durationMins:120, note:"M85 · vs 3rd E/F/G/I/J" },
  // Jul 3 ET (Jul 4 PHT)
  { stage:"R32", home:"TBD Grp D RU",  away:"TBD Grp G RU",  group:"", utc:"2026-07-03T18:00:00Z", venue:"AT&T Stadium, Dallas",         durationMins:120, note:"M88 · Australia vs Iran/Egypt RU" },
  { stage:"R32", home:"Argentina",     away:"TBD Grp H RU",  group:"", utc:"2026-07-03T22:00:00Z", venue:"Hard Rock Stadium, Miami",     durationMins:120, note:"M86 · vs Uruguay/Cape Verde" },
  { stage:"R32", home:"TBD Grp K W",   away:"TBD 3rd",       group:"", utc:"2026-07-04T01:30:00Z", venue:"Arrowhead Stadium, KC",        durationMins:120, note:"M87 · Colombia vs 3rd D/E/I/J/L" },

  // ── ROUND OF 16 ───────────────────────────────────────────────────────────
  { stage:"R16", home:"W M73",         away:"W M75",         group:"", utc:"2026-07-04T17:00:00Z", venue:"NRG Stadium, Houston",         durationMins:120, note:"M90 · S.Africa/Canada vs Netherlands/Morocco" },
  { stage:"R16", home:"W M74",         away:"W M77",         group:"", utc:"2026-07-04T21:00:00Z", venue:"Lincoln Financial, Philly",    durationMins:120, note:"M89 · Germany/Paraguay vs France/Sweden" },
  { stage:"R16", home:"W M76",         away:"W M78",         group:"", utc:"2026-07-05T20:00:00Z", venue:"MetLife Stadium, NJ",          durationMins:120, note:"M91 · Brazil/Japan vs Ivory Coast/Norway" },
  { stage:"R16", home:"W M79",         away:"W M80",         group:"", utc:"2026-07-06T00:00:00Z", venue:"Estadio Azteca, Mexico City",  durationMins:120, note:"M92 · Mexico/Scotland vs England path" },
  { stage:"R16", home:"W M83",         away:"W M84",         group:"", utc:"2026-07-06T19:00:00Z", venue:"AT&T Stadium, Dallas",         durationMins:120, note:"M93" },
  { stage:"R16", home:"W M81",         away:"W M82",         group:"", utc:"2026-07-07T00:00:00Z", venue:"Lumen Field, Seattle",         durationMins:120, note:"M94 · USA/Bosnia path" },
  { stage:"R16", home:"W M86",         away:"W M88",         group:"", utc:"2026-07-07T16:00:00Z", venue:"Mercedes-Benz, Atlanta",       durationMins:120, note:"M95 · Argentina path" },
  { stage:"R16", home:"W M85",         away:"W M87",         group:"", utc:"2026-07-07T20:00:00Z", venue:"BC Place, Vancouver",          durationMins:120, note:"M96 · Switzerland path" },

  // ── QUARTERFINALS ─────────────────────────────────────────────────────────
  { stage:"QF",  home:"TBD",           away:"TBD",           group:"", utc:"2026-07-09T20:00:00Z", venue:"Gillette Stadium, Boston",     durationMins:120, note:"M97 · W89 vs W90" },
  { stage:"QF",  home:"TBD",           away:"TBD",           group:"", utc:"2026-07-10T21:00:00Z", venue:"Hard Rock Stadium, Miami",     durationMins:120, note:"M98 · W91 vs W92" },
  { stage:"QF",  home:"TBD",           away:"TBD",           group:"", utc:"2026-07-11T21:00:00Z", venue:"Levi's Stadium, SF",           durationMins:120, note:"M99 · W95 vs W96" },
  { stage:"QF",  home:"TBD",           away:"TBD",           group:"", utc:"2026-07-12T01:00:00Z", venue:"Arrowhead Stadium, KC",        durationMins:120, note:"M100 · W93 vs W94" },

  // ── SEMIFINALS ────────────────────────────────────────────────────────────
  { stage:"SF",  home:"TBD",           away:"TBD",           group:"", utc:"2026-07-14T23:00:00Z", venue:"AT&T Stadium, Dallas",         durationMins:120, note:"M101 · W97 vs W98" },
  { stage:"SF",  home:"TBD",           away:"TBD",           group:"", utc:"2026-07-15T23:00:00Z", venue:"Mercedes-Benz, Atlanta",       durationMins:120, note:"M102 · W99 vs W100" },

  // ── THIRD PLACE + FINAL ───────────────────────────────────────────────────
  { stage:"3rd", home:"TBD",           away:"TBD",           group:"", utc:"2026-07-18T21:00:00Z", venue:"Hard Rock Stadium, Miami",     durationMins:120, note:"3rd place playoff" },
  { stage:"Final",home:"TBD",          away:"TBD",           group:"", utc:"2026-07-19T19:00:00Z", venue:"🏆 MetLife Stadium, NJ",       durationMins:120, note:"World Cup Final" },
];

const ptsDelta = { Win:3, Draw:1, Loss:0 };
const gdDelta  = { Win:1, Draw:0, Loss:-2 };
const TABS = ["All 48 teams", "3rd place race", "Schedule"];

const STAGE_CONFIG = {
  "Group": { label:"Group Stage",    color:"#2563eb", bg:"#eff6ff" },
  "R32":   { label:"Round of 32",    color:"#7c3aed", bg:"#f5f3ff" },
  "R16":   { label:"Round of 16",    color:"#db2777", bg:"#fdf2f8" },
  "QF":    { label:"Quarterfinals",  color:"#d97706", bg:"#fffbeb" },
  "SF":    { label:"Semifinals",     color:"#dc2626", bg:"#fef2f2" },
  "3rd":   { label:"3rd Place",      color:"#64748b", bg:"#f8fafc" },
  "Final": { label:"🏆 FINAL",       color:"#b45309", bg:"#fef9c3" },
};

function probColor(prob) {
  if (prob >= 80) return { color:"#166534", bg:"#dcfce7" };
  if (prob >= 50) return { color:"#854d0e", bg:"#fef9c3" };
  if (prob >= 20) return { color:"#9a3412", bg:"#ffedd5" };
  return { color:"#991b1b", bg:"#fee2e2" };
}

function groupMatchesByDate(matches) {
  const groups = {};
  matches.forEach(m => {
    const d = new Date(m.utc);
    const key = d.toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

function ConfirmedRow({ name, group, pos }) {
  const badgeStyle =
    pos === "Winner"    ? { bg:"#dcfce7", color:"#166534", border:"#86efac" } :
    pos === "Runner-up" ? { bg:"#dbeafe", color:"#1e40af", border:"#93c5fd" } :
                          { bg:"#fef9c3", color:"#854d0e", border:"#fde047" };
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 10px", borderRadius:"6px", background:"#f8fafc", marginBottom:"3px", border:"1px solid #e2e8f0" }}>
      <span style={{ fontSize:"14px" }}>{flag(name)}</span>
      <span style={{ fontSize:"12px", fontWeight:"600", color:"#1e293b", flex:1 }}>{name}</span>
      <span style={{ fontSize:"10px", color:"#94a3b8" }}>Grp {group}</span>
      <span style={{ fontSize:"9px", fontWeight:"600", padding:"2px 7px", borderRadius:"20px", background:badgeStyle.bg, color:badgeStyle.color, border:`1px solid ${badgeStyle.border}`, whiteSpace:"nowrap" }}>{pos}</span>
    </div>
  );
}

function EliminatedRow({ name, group }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 10px", borderRadius:"6px", background:"#f8fafc", marginBottom:"3px", border:"1px solid #e2e8f0" }}>
      <span style={{ fontSize:"14px", opacity:0.4 }}>{flag(name)}</span>
      <span style={{ fontSize:"12px", color:"#94a3b8", flex:1, textDecoration:"line-through" }}>{name}</span>
      <span style={{ fontSize:"10px", color:"#94a3b8" }}>Grp {group}</span>
      <span style={{ fontSize:"9px", fontWeight:"600", padding:"2px 7px", borderRadius:"20px", background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5" }}>Out</span>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [now, setNow] = useState(new Date());
  const [selections, setSelections] = useState(() => {
    const init = {};
    THIRD_TEAMS.forEach(t => {
      if (!t.done) {
        const best = t.w > t.d && t.w > t.l ? "Win" : t.d > t.w && t.d > t.l ? "Draw" : "Loss";
        init[t.team] = best;
      }
    });
    return init;
  });
  const [showOdds, setShowOdds] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pick = (team, outcome) => setSelections(prev => ({ ...prev, [team]: outcome }));

  const computed = useMemo(() => {
    return THIRD_TEAMS.map(t => {
      const s = selections[t.team];
      const addPts = t.done ? 0 : (s ? ptsDelta[s] : 0);
      const addGD  = t.done ? 0 : (s ? gdDelta[s]  : 0);
      return { ...t, finalPts: t.pts + addPts, finalGD: (t.gf - t.ga) + addGD };
    })
    .sort((a, b) => b.finalPts - a.finalPts || b.finalGD - a.finalGD)
    .map((t, i) => ({ ...t, rank: i + 1 }));
  }, [selections]);

  const groupedTeams = useMemo(() => {
    const filtered = filter === "all" ? ALL_TEAMS : ALL_TEAMS.filter(t => t.status === filter);
    const groups = {};
    filtered.forEach(t => {
      if (!groups[t.group]) groups[t.group] = [];
      groups[t.group].push(t);
    });
    return groups;
  }, [filter]);

  const counts = useMemo(() => {
    const c = {};
    Object.keys(STATUS_CONFIG).forEach(s => { c[s] = ALL_TEAMS.filter(t => t.status === s).length; });
    return c;
  }, []);

  const filteredSchedule = useMemo(() => {
    return stageFilter === "all" ? SCHEDULE : SCHEDULE.filter(m => m.stage === stageFilter);
  }, [stageFilter]);

  const scheduleByDate = useMemo(() => groupMatchesByDate(filteredSchedule), [filteredSchedule]);

  const btnStyle = (team, outcome) => {
    const active = selections[team] === outcome;
    const colors = {
      Win:  { bg:"#dcfce7", color:"#166534", border:"#86efac" },
      Draw: { bg:"#dbeafe", color:"#1e40af", border:"#93c5fd" },
      Loss: { bg:"#fee2e2", color:"#991b1b", border:"#fca5a5" },
    };
    const c = colors[outcome];
    return { padding:"2px 6px", fontSize:"10px", fontWeight:"600", borderRadius:"4px", border:`1px solid ${active?c.border:"#e2e8f0"}`, background:active?c.bg:"#f8fafc", color:active?c.color:"#94a3b8", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", lineHeight:"1.3", minWidth:"28px" };
  };

  const timeStr = now.toLocaleTimeString(undefined, { hour:"numeric", minute:"2-digit", second:"2-digit" });
  const dateStr = now.toLocaleDateString(undefined, { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const tzStr   = now.toLocaleTimeString(undefined, { timeZoneName:"short" }).split(" ").pop();

  return (
    <div style={{ background:"#f8fafc", minHeight:"100vh", fontFamily:"'Inter','Segoe UI',sans-serif", color:"#1e293b", maxWidth:"min(75vw,100%)", margin:"0 auto", boxSizing:"border-box" }}>

      {/* Header */}
      <div style={{ padding:"12px 16px", borderBottom:"1px solid #e2e8f0", background:"#fff", display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        <div>
          <div style={{ fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#94a3b8", marginBottom:"2px" }}>2026 FIFA World Cup · Group Stage</div>
          <div style={{ fontSize:"clamp(15px,3.5vw,20px)", fontWeight:"700", color:"#0f172a" }}>Knockout Stage Tracker</div>
        </div>
        <div style={{ marginLeft:"auto", textAlign:"right" }}>
          <div style={{ fontSize:"clamp(16px,4vw,22px)", fontWeight:"700", color:"#0f172a", letterSpacing:"-0.5px", fontVariantNumeric:"tabular-nums" }}>{timeStr}</div>
          <div style={{ fontSize:"11px", color:"#64748b" }}>{dateStr} · {tzStr}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid #e2e8f0", padding:"0 12px", background:"#fff", overflowX:"auto" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ padding:"10px 14px", fontSize:"12px", fontWeight:"600", whiteSpace:"nowrap", background:"transparent", border:"none", cursor:"pointer", color:tab===i?"#2563eb":"#94a3b8", borderBottom:tab===i?"2px solid #2563eb":"2px solid transparent", marginRight:"4px" }}>{t}</button>
        ))}
      </div>

      {/* TAB 0: All 48 teams */}
      {tab === 0 && (
        <div style={{ padding:"14px 12px" }}>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"14px", overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:"4px" }}>
            <button onClick={() => setFilter("all")} style={{ padding:"5px 12px", fontSize:"11px", fontWeight:"600", borderRadius:"20px", border:`1px solid ${filter==="all"?"#2563eb":"#e2e8f0"}`, background:filter==="all"?"#eff6ff":"#fff", color:filter==="all"?"#2563eb":"#64748b", cursor:"pointer" }}>All 48</button>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => setFilter(key===filter?"all":key)} style={{ padding:"5px 12px", fontSize:"11px", fontWeight:"600", borderRadius:"20px", border:`1px solid ${filter===key?cfg.border:"#e2e8f0"}`, background:filter===key?cfg.bg:"#fff", color:filter===key?cfg.text:"#64748b", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:cfg.dot, display:"inline-block" }}/>{cfg.label} ({counts[key]})
              </button>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(260px,100%), 1fr))", gap:"10px" }}>
            {Object.entries(groupedTeams).sort().map(([grp, teams]) => (
              <div key={grp} style={{ background:"#fff", borderRadius:"10px", border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ background:"#f1f5f9", padding:"6px 12px", fontSize:"11px", fontWeight:"700", color:"#475569", letterSpacing:"1px", textTransform:"uppercase" }}>Group {grp}</div>
                {teams.map((t, ti) => {
                  const cfg = STATUS_CONFIG[t.status];
                  const showProb = t.prob !== null && t.status !== "confirmed" && t.status !== "eliminated";
                  const pc = showProb ? probColor(t.prob) : null;
                  return (
                    <div key={t.name} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 12px", borderBottom:ti<teams.length-1?"1px solid #f1f5f9":"none", borderLeft:`3px solid ${cfg.border}`, background:"#fff" }}>
                      <span style={{ fontSize:"11px", color:"#94a3b8", width:"14px", textAlign:"center", fontWeight:"600" }}>{t.pos}</span>
                      <span style={{ fontSize:"14px" }}>{flag(t.name)}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"12px", fontWeight:"600", color:"#1e293b" }}>{t.name}</div>
                        <div style={{ fontSize:"9px", color:"#94a3b8" }}>{t.note}</div>
                      </div>
                      <span style={{ fontSize:"12px", fontWeight:"700", color:"#475569", width:"22px", textAlign:"center" }}>{t.pts}</span>
                      {showProb
                        ? <span style={{ fontSize:"10px", fontWeight:"700", padding:"2px 7px", borderRadius:"10px", background:pc.bg, color:pc.color, whiteSpace:"nowrap", minWidth:"42px", textAlign:"center" }}>{t.prob}%</span>
                        : <span style={{ fontSize:"9px", fontWeight:"600", padding:"2px 7px", borderRadius:"10px", background:cfg.bg, color:cfg.text, border:`1px solid ${cfg.border}`, whiteSpace:"nowrap" }}>{cfg.short}</span>
                      }
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ marginTop:"14px", fontSize:"10px", color:"#94a3b8" }}>% = advancement probability · FOX Sports odds Jun 24 · Groups A–F complete · G–L play Jun 26–28</div>
        </div>
      )}

      {/* TAB 1: 3rd place race */}
      {tab === 1 && (
        <div style={{ padding:"14px 12px" }}>
          <div style={{ background:"#fef9c3", border:"1px solid #fde047", borderRadius:"8px", padding:"10px 14px", marginBottom:"14px", fontSize:"12px", color:"#854d0e" }}>
            ✅ <strong>Groups A–F complete.</strong> Paraguay D 0–0 Australia (both through) · Turkey W 2–3 USA but eliminated on tiebreaker · Ecuador/Sweden/Bosnia/Paraguay confirmed through as 3rd-place qualifiers
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
            <label style={{ fontSize:"12px", color:"#64748b", display:"flex", alignItems:"center", gap:"6px", cursor:"pointer" }}>
              <input type="checkbox" checked={showOdds} onChange={e => setShowOdds(e.target.checked)} />Show betting odds
            </label>
            <span style={{ marginLeft:"auto", fontSize:"10px", color:"#94a3b8" }}>Top 8 advance · Odds: bet365</span>
          </div>

          <div style={{ background:"#fff", borderRadius:"10px", border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
              <table style={{ width:"100%", minWidth:"520px", borderCollapse:"collapse", fontSize:"12px" }}>
                <thead>
                  <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
                    {["#","Team","Pts","GD",...(showOdds?["W / D / L"]:[]),showOdds?"Final game":"W/D/L · Final game"].map((h,i)=>(
                      <th key={i} style={{ padding:"8px 10px", textAlign:i<=3?"center":"left", fontSize:"10px", fontWeight:"600", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.8px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {computed.map((t, i) => {
                    const passing = t.rank <= 8;
                    const gdStr = (t.finalGD > 0 ? "+" : "") + t.finalGD;
                    return (
                      <>
                        {i === 8 && (
                          <tr key="cutline">
                            <td colSpan={showOdds?6:5} style={{ padding:"0" }}>
                              <div style={{ height:"2px", background:"#ef4444", position:"relative" }}>
                                <span style={{ position:"absolute", left:"50%", transform:"translateX(-50%) translateY(-50%)", background:"#ef4444", color:"#fff", fontSize:"9px", fontWeight:"700", padding:"2px 10px", borderRadius:"10px", letterSpacing:"1px", textTransform:"uppercase", whiteSpace:"nowrap" }}>— elimination line —</span>
                              </div>
                            </td>
                          </tr>
                        )}
                        <tr key={t.team} style={{ background:i%2===0?"#fff":"#f8fafc", borderLeft:`3px solid ${passing?"#86efac":"#fca5a5"}`, borderBottom:"1px solid #f1f5f9" }}>
                          <td style={{ padding:"9px 10px", textAlign:"center" }}>
                            <span style={{ fontSize:"15px", fontWeight:"800", color:passing?"#16a34a":"#dc2626" }}>{t.rank}</span>
                          </td>
                          <td style={{ padding:"9px 10px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                              <span style={{ fontSize:"14px" }}>{flag(t.team)}</span>
                              <div>
                                <div style={{ fontWeight:"600", color:"#1e293b" }}>{t.team}</div>
                                <div style={{ fontSize:"10px", color:"#94a3b8" }}>Group {t.group}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"9px 6px", textAlign:"center" }}>
                            <span style={{ fontWeight:"800", fontSize:"14px", color:t.finalPts>=4?"#16a34a":t.finalPts===3?"#ca8a04":"#dc2626" }}>{t.finalPts}</span>
                          </td>
                          <td style={{ padding:"9px 6px", textAlign:"center" }}>
                            <span style={{ fontWeight:"600", fontSize:"13px", color:t.finalGD>0?"#16a34a":t.finalGD===0?"#64748b":"#dc2626" }}>{gdStr}</span>
                          </td>
                          {showOdds && (
                            <td style={{ padding:"9px 10px", textAlign:"center" }}>
                              {t.done ? <span style={{ fontSize:"10px", color:"#94a3b8", fontStyle:"italic" }}>done</span> : (
                                <div style={{ display:"flex", gap:"3px", justifyContent:"center" }}>
                                  {["Win","Draw","Loss"].map(s=>(
                                    <button key={s} onClick={()=>pick(t.team,s)} style={btnStyle(t.team,s)}>
                                      {s[0]}<span style={{ fontSize:"8px" }}>{Math.round(s==="Win"?t.w:s==="Draw"?t.d:t.l)}%</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </td>
                          )}
                          <td style={{ padding:"9px 10px" }}>
                            {t.done ? (
                              <span style={{ fontSize:"10px", color:"#64748b", fontStyle:"italic" }}>{t.result}</span>
                            ) : (
                              <div>
                                <div style={{ fontSize:"11px", color:"#475569" }}>vs {flag(t.opp)} {t.opp} · {t.date}</div>
                                {!showOdds && (
                                  <div style={{ display:"flex", gap:"3px", marginTop:"4px" }}>
                                    {["Win","Draw","Loss"].map(s=>(
                                      <button key={s} onClick={()=>pick(t.team,s)} style={btnStyle(t.team,s)}>
                                        {s[0]}<span style={{ fontSize:"8px" }}>{Math.round(s==="Win"?t.w:s==="Draw"?t.d:t.l)}%</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ marginTop:"10px", fontSize:"10px", color:"#94a3b8", display:"flex", flexWrap:"wrap", gap:"14px" }}>
            <span>GD: W≈+1 · D=0 · L≈–2 (estimated)</span><span>Updated: Jun 25 post Groups A–F</span>
          </div>
        </div>
      )}

      {/* TAB 2: Schedule */}
      {tab === 2 && (
        <div style={{ padding:"14px 12px" }}>
          {/* Stage filter pills */}
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"14px", overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:"4px" }}>
            <button onClick={() => setStageFilter("all")} style={{ padding:"5px 12px", fontSize:"11px", fontWeight:"600", borderRadius:"20px", border:`1px solid ${stageFilter==="all"?"#2563eb":"#e2e8f0"}`, background:stageFilter==="all"?"#eff6ff":"#fff", color:stageFilter==="all"?"#2563eb":"#64748b", cursor:"pointer", whiteSpace:"nowrap" }}>All</button>
            {Object.entries(STAGE_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => setStageFilter(key===stageFilter?"all":key)} style={{ padding:"5px 12px", fontSize:"11px", fontWeight:"600", borderRadius:"20px", border:`1px solid ${stageFilter===key?cfg.color:"#e2e8f0"}`, background:stageFilter===key?cfg.bg:"#fff", color:stageFilter===key?cfg.color:"#64748b", cursor:"pointer", whiteSpace:"nowrap" }}>{cfg.label}</button>
            ))}
          </div>

          <div style={{ fontSize:"11px", color:"#64748b", marginBottom:"12px" }}>All times in your local timezone · {tzStr}</div>

          <div style={{ overflowY:"auto", maxHeight:"70vh", WebkitOverflowScrolling:"touch" }}>
            {Object.entries(scheduleByDate).map(([dateLabel, matches]) => (
              <div key={dateLabel} style={{ marginBottom:"20px" }}>
                <div style={{ fontSize:"12px", fontWeight:"700", color:"#475569", textTransform:"uppercase", letterSpacing:"1px", borderBottom:"2px solid #e2e8f0", paddingBottom:"6px", marginBottom:"8px" }}>{dateLabel}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  {matches.map((m, i) => {
                    const kickoff = new Date(m.utc);
                    const kickoffMs = kickoff.getTime();
                    const nowMs = now.getTime();
                    const endMs = kickoffMs + (m.durationMins||105)*60*1000;
                    const isLive = nowMs>=kickoffMs && nowMs<=endMs;
                    const isPast = nowMs>endMs;
                    const timeLocal = kickoff.toLocaleTimeString(undefined, { hour:"numeric", minute:"2-digit" });
                    const stageCfg = STAGE_CONFIG[m.stage] || STAGE_CONFIG["Group"];
                    const isTBD = m.home.startsWith("TBD") || m.away.startsWith("TBD");
                    return (
                      <div key={i} style={{ background:"#fff", borderRadius:"10px", border:"1px solid #e2e8f0", padding:"10px 12px", display:"flex", alignItems:"center", gap:"8px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)", borderLeft:`3px solid ${isLive?"#f59e0b":isPast?"#cbd5e1":stageCfg.color}`, opacity:isPast&&!isLive?0.55:1 }}>
                        <div style={{ textAlign:"center", minWidth:"54px" }}>
                          {isLive
                            ? <span style={{ fontSize:"10px", fontWeight:"700", color:"#b45309", background:"#fef9c3", padding:"2px 6px", borderRadius:"10px" }}>🔴 LIVE</span>
                            : isPast
                            ? <span style={{ fontSize:"10px", color:"#94a3b8" }}>FT</span>
                            : <span style={{ fontSize:"12px", fontWeight:"600", color:stageCfg.color }}>{timeLocal}</span>
                          }
                          <div style={{ fontSize:"8px", color:stageCfg.color, background:stageCfg.bg, borderRadius:"4px", padding:"1px 4px", marginTop:"2px", whiteSpace:"nowrap" }}>{stageCfg.label}</div>
                        </div>
                        <div style={{ flex:1, display:"flex", alignItems:"center", gap:"6px" }}>
                          {!isTBD && <span style={{ fontSize:"13px" }}>{flag(m.home)}</span>}
                          <span style={{ fontSize:"12px", fontWeight:"600", color: isTBD?"#94a3b8":"#1e293b", textAlign:"right", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.home}</span>
                          <span style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"500", flexShrink:0 }}>
                            {m.score ? <strong style={{ color:"#1e293b", fontSize:"13px" }}>{m.score}</strong> : "vs"}
                          </span>
                          <span style={{ fontSize:"12px", fontWeight:"600", color: isTBD?"#94a3b8":"#1e293b", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.away}</span>
                          {!isTBD && <span style={{ fontSize:"13px" }}>{flag(m.away)}</span>}
                        </div>
                        <div style={{ textAlign:"right", minWidth:"130px" }}>
                          {m.group && <div style={{ fontSize:"9px", fontWeight:"700", color:stageCfg.color, background:stageCfg.bg, padding:"1px 5px", borderRadius:"5px", display:"inline-block", marginBottom:"2px" }}>Grp {m.group}</div>}
                          <div style={{ fontSize:"9px", color:"#94a3b8", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"130px" }}>{m.venue}</div>
                          {m.note && <div style={{ fontSize:"9px", color:"#94a3b8", fontStyle:"italic" }}>{m.note}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:"10px", color:"#94a3b8", marginTop:"8px" }}>Knockout matchups marked TBD will be confirmed after Jun 27 · All times local ({tzStr})</div>
        </div>
      )}
    </div>
  );
}
