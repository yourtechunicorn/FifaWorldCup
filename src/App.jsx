import { useState, useMemo, useEffect } from "react";

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
const flag = (n) => FLAGS[n] || "🏳️";

// -- R32 BRACKET --------------------------------------------------------------
// Each match: id, home, away, utc (ET>UTC), venue, winnerId (null = TBD)
// IDs used to wire up later rounds
const BRACKET = [
  // -- ROUND OF 32 -- Jun 28-Jul 3 (all ET>UTC, PHT = UTC+8) ----------------
  { id:"R32_1",  round:"R32", home:"South Africa", away:"Canada",      utc:"2026-06-29T00:00:00Z", venue:"SoFi Stadium, LA",            winner:"Canada",     score:"0-1" },
  { id:"R32_2",  round:"R32", home:"Brazil",       away:"Japan",       utc:"2026-06-29T17:00:00Z", venue:"NRG Stadium, Houston",        winner:"Brazil",     score:"2-1" },
  { id:"R32_3",  round:"R32", home:"Germany",      away:"Paraguay",    utc:"2026-06-29T20:30:00Z", venue:"Gillette Stadium, Boston",    winner:"Paraguay",   score:"1-1 (4-3p)" },
  { id:"R32_4",  round:"R32", home:"Netherlands",  away:"Morocco",     utc:"2026-06-30T01:00:00Z", venue:"Estadio BBVA, Monterrey",     winner:"Morocco",    score:"1-1 (3-2p)" },
  { id:"R32_5",  round:"R32", home:"Ivory Coast",  away:"Norway",      utc:"2026-06-30T17:00:00Z", venue:"AT&T Stadium, Arlington",     winner:null },
  { id:"R32_6",  round:"R32", home:"France",       away:"Sweden",      utc:"2026-06-30T21:00:00Z", venue:"MetLife Stadium, NJ",         winner:null },
  { id:"R32_7",  round:"R32", home:"Mexico",       away:"Ecuador",     utc:"2026-07-01T01:00:00Z", venue:"Estadio Azteca, Mexico City", winner:null },
  { id:"R32_8",  round:"R32", home:"England",      away:"DR Congo",    utc:"2026-07-01T17:00:00Z", venue:"Mercedes-Benz, Atlanta",      winner:null },
  { id:"R32_9",  round:"R32", home:"Belgium",      away:"Senegal",     utc:"2026-07-01T21:00:00Z", venue:"Lumen Field, Seattle",        winner:null },
  { id:"R32_10", round:"R32", home:"USA",          away:"Bosnia",      utc:"2026-07-02T01:00:00Z", venue:"Levis Stadium, SF",          winner:null },
  { id:"R32_11", round:"R32", home:"Spain",        away:"Austria",     utc:"2026-07-02T19:00:00Z", venue:"SoFi Stadium, LA",            winner:null },
  { id:"R32_12", round:"R32", home:"Portugal",     away:"Croatia",     utc:"2026-07-03T00:00:00Z", venue:"BMO Field, Toronto",          winner:null },
  { id:"R32_13", round:"R32", home:"Switzerland",  away:"Algeria",     utc:"2026-07-03T03:00:00Z", venue:"BC Place, Vancouver",         winner:null },
  { id:"R32_14", round:"R32", home:"Australia",    away:"Egypt",       utc:"2026-07-03T18:00:00Z", venue:"AT&T Stadium, Dallas",        winner:null },
  { id:"R32_15", round:"R32", home:"Argentina",    away:"Cape Verde",  utc:"2026-07-03T22:00:00Z", venue:"Hard Rock Stadium, Miami",    winner:null },
  { id:"R32_16", round:"R32", home:"Colombia",     away:"Ghana",       utc:"2026-07-04T01:30:00Z", venue:"Arrowhead Stadium, KC",       winner:null },
  // -- ROUND OF 16 -- Jul 4-7 -----------------------------------------------
  { id:"R16_1",  round:"R16", home:"Canada",       away:"Morocco",     utc:"2026-07-04T17:00:00Z", venue:"NRG Stadium, Houston",        winner:null, note:"Confirmed matchup" },
  { id:"R16_2",  round:"R16", home:"Paraguay",     away:"W R32_6",     utc:"2026-07-04T21:00:00Z", venue:"Lincoln Financial, Philly",   winner:null, note:"Paraguay vs France/Sweden winner" },
  { id:"R16_3",  round:"R16", home:"Brazil",       away:"W R32_5",     utc:"2026-07-05T20:00:00Z", venue:"MetLife Stadium, NJ",         winner:null, note:"Brazil vs Ivory Coast/Norway winner" },
  { id:"R16_4",  round:"R16", home:"W R32_7",      away:"W R32_8",     utc:"2026-07-06T00:00:00Z", venue:"Estadio Azteca, Mexico City", winner:null, note:"W M79 vs W M80" },
  { id:"R16_5",  round:"R16", home:"W R32_12",     away:"W R32_11",    utc:"2026-07-06T19:00:00Z", venue:"AT&T Stadium, Dallas",        winner:null, note:"W M83 vs W M84" },
  { id:"R16_6",  round:"R16", home:"W R32_9",      away:"W R32_10",    utc:"2026-07-07T00:00:00Z", venue:"Lumen Field, Seattle",        winner:null, note:"W M81 vs W M82" },
  { id:"R16_7",  round:"R16", home:"W R32_15",     away:"W R32_14",    utc:"2026-07-07T16:00:00Z", venue:"Mercedes-Benz, Atlanta",      winner:null, note:"W M86 vs W M88" },
  { id:"R16_8",  round:"R16", home:"W R32_13",     away:"W R32_16",    utc:"2026-07-07T20:00:00Z", venue:"BC Place, Vancouver",         winner:null, note:"W M85 vs W M87" },
  // -- QUARTERFINALS -- Jul 9-12 --------------------------------------------
  { id:"QF_1",   round:"QF",  home:"W R16_2",      away:"W R16_1",     utc:"2026-07-09T20:00:00Z", venue:"Gillette Stadium, Boston",    winner:null },
  { id:"QF_2",   round:"QF",  home:"W R16_3",      away:"W R16_4",     utc:"2026-07-10T21:00:00Z", venue:"Hard Rock Stadium, Miami",    winner:null },
  { id:"QF_3",   round:"QF",  home:"W R16_7",      away:"W R16_8",     utc:"2026-07-11T21:00:00Z", venue:"Levis Stadium, SF",          winner:null },
  { id:"QF_4",   round:"QF",  home:"W R16_5",      away:"W R16_6",     utc:"2026-07-12T01:00:00Z", venue:"Arrowhead Stadium, KC",       winner:null },
  // -- SEMIFINALS -- Jul 14-15 ----------------------------------------------
  { id:"SF_1",   round:"SF",  home:"W QF_1",       away:"W QF_2",      utc:"2026-07-14T23:00:00Z", venue:"AT&T Stadium, Dallas",        winner:null },
  { id:"SF_2",   round:"SF",  home:"W QF_3",       away:"W QF_4",      utc:"2026-07-15T23:00:00Z", venue:"Mercedes-Benz, Atlanta",      winner:null },
  // -- 3RD PLACE + FINAL ----------------------------------------------------
  { id:"3RD",    round:"3rd", home:"L SF_1",       away:"L SF_2",      utc:"2026-07-18T21:00:00Z", venue:"Hard Rock Stadium, Miami",    winner:null },
  { id:"FINAL",  round:"Final",home:"W SF_1",      away:"W SF_2",      utc:"2026-07-19T19:00:00Z", venue:"🏆 MetLife Stadium, NJ",      winner:null },
];

const ROUND_CONFIG = {
  R32:   { label:"Round of 32",   short:"R32",   color:"#7c3aed", bg:"#f5f3ff", border:"#c4b5fd" },
  R16:   { label:"Round of 16",   short:"R16",   color:"#2563eb", bg:"#eff6ff", border:"#93c5fd" },
  QF:    { label:"Quarterfinals", short:"QF",    color:"#0891b2", bg:"#ecfeff", border:"#67e8f9" },
  SF:    { label:"Semifinals",    short:"SF",    color:"#dc2626", bg:"#fef2f2", border:"#fca5a5" },
  "3rd": { label:"3rd Place",     short:"3rd",   color:"#64748b", bg:"#f8fafc", border:"#cbd5e1" },
  Final: { label:"🏆 FINAL",      short:"Final", color:"#b45309", bg:"#fef9c3", border:"#fde047" },
};

const CONFIRMED = [
  { name:"Mexico",       group:"A", pos:"Winner"    },
  { name:"South Africa", group:"A", pos:"Runner-up" },
  { name:"Switzerland",  group:"B", pos:"Winner"    },
  { name:"Canada",       group:"B", pos:"Runner-up" },
  { name:"Bosnia",       group:"B", pos:"3rd place" },
  { name:"Brazil",       group:"C", pos:"Winner"    },
  { name:"Morocco",      group:"C", pos:"Runner-up" },
  { name:"USA",          group:"D", pos:"Winner"    },
  { name:"Australia",    group:"D", pos:"Runner-up" },
  { name:"Paraguay",     group:"D", pos:"3rd place" },
  { name:"Ivory Coast",  group:"E", pos:"Winner"    },
  { name:"Germany",      group:"E", pos:"Runner-up" },
  { name:"Ecuador",      group:"E", pos:"3rd place" },
  { name:"Netherlands",  group:"F", pos:"Winner"    },
  { name:"Japan",        group:"F", pos:"Runner-up" },
  { name:"Sweden",       group:"F", pos:"3rd place" },
  { name:"Belgium",      group:"G", pos:"Winner"    },
  { name:"Egypt",        group:"G", pos:"Runner-up" },
  { name:"Iran",         group:"G", pos:"3rd place" },
  { name:"Spain",        group:"H", pos:"Winner"    },
  { name:"Cape Verde",   group:"H", pos:"Runner-up" },
  { name:"France",       group:"I", pos:"Winner"    },
  { name:"Norway",       group:"I", pos:"Runner-up" },
  { name:"Senegal",      group:"I", pos:"3rd place" },
  { name:"Argentina",    group:"J", pos:"Winner"    },
  { name:"Austria",      group:"J", pos:"Runner-up" },
  { name:"Algeria",      group:"J", pos:"3rd place" },
  { name:"Colombia",     group:"K", pos:"Winner"    },
  { name:"Portugal",     group:"K", pos:"Runner-up" },
  { name:"DR Congo",     group:"K", pos:"3rd place" },
  { name:"England",      group:"L", pos:"Winner"    },
  { name:"Croatia",      group:"L", pos:"Runner-up" },
  { name:"Ghana",        group:"L", pos:"3rd place" },
];

const ELIMINATED = [
  { name:"Scotland",    group:"C" }, { name:"Haiti",       group:"C" },
  { name:"Turkey",      group:"D" }, { name:"Czechia",     group:"A" },
  { name:"Curaçao",     group:"E" }, { name:"Tunisia",     group:"F" },
  { name:"New Zealand", group:"G" }, { name:"Iran",        group:"G" },
  { name:"Uruguay",     group:"H" }, { name:"Saudi Arabia",group:"H" },
  { name:"Iraq",        group:"I" }, { name:"Jordan",      group:"J" },
  { name:"Uzbekistan",  group:"K" }, { name:"Panama",      group:"L" },
  { name:"Qatar",       group:"B" }, { name:"South Korea", group:"A" },
];

const ALL_TEAMS = [
  { name:"Mexico",       group:"A", pos:1, pts:9, gd:5,  gf:6,  status:"confirmed",  note:"Won all 3" },
  { name:"South Africa", group:"A", pos:2, pts:6, gd:0,  gf:2,  status:"confirmed",  note:"Runner-up" },
  { name:"South Korea",  group:"A", pos:3, pts:3, gd:-1, gf:3,  status:"eliminated", note:"Out on tiebreaker" },
  { name:"Czechia",      group:"A", pos:4, pts:1, gd:-4, gf:3,  status:"eliminated", note:"Eliminated" },
  { name:"Switzerland",  group:"B", pos:1, pts:7, gd:5,  gf:8,  status:"confirmed",  note:"Group winner" },
  { name:"Canada",       group:"B", pos:2, pts:4, gd:6,  gf:8,  status:"confirmed",  note:"Runner-up" },
  { name:"Bosnia",       group:"B", pos:3, pts:4, gd:-1, gf:5,  status:"confirmed",  note:"3rd place qualifier" },
  { name:"Qatar",        group:"B", pos:4, pts:1, gd:-10,gf:2,  status:"eliminated", note:"Eliminated" },
  { name:"Brazil",       group:"C", pos:1, pts:7, gd:5,  gf:7,  status:"confirmed",  note:"Group winner" },
  { name:"Morocco",      group:"C", pos:2, pts:7, gd:5,  gf:6,  status:"confirmed",  note:"Runner-up" },
  { name:"Scotland",     group:"C", pos:3, pts:3, gd:-2, gf:2,  status:"eliminated", note:"Eliminated - Tartan Army 🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { name:"Haiti",        group:"C", pos:4, pts:0, gd:-8, gf:2,  status:"eliminated", note:"Eliminated" },
  { name:"USA",          group:"D", pos:1, pts:6, gd:5,  gf:8,  status:"confirmed",  note:"Group winner" },
  { name:"Australia",    group:"D", pos:2, pts:5, gd:1,  gf:3,  status:"confirmed",  note:"Runner-up" },
  { name:"Paraguay",     group:"D", pos:3, pts:4, gd:-2, gf:2,  status:"confirmed",  note:"3rd place qualifier" },
  { name:"Turkey",       group:"D", pos:4, pts:3, gd:-4, gf:3,  status:"eliminated", note:"Eliminated on tiebreaker" },
  { name:"Ivory Coast",  group:"E", pos:1, pts:7, gd:3,  gf:5,  status:"confirmed",  note:"Group winner" },
  { name:"Germany",      group:"E", pos:2, pts:6, gd:5,  gf:8,  status:"confirmed",  note:"Runner-up" },
  { name:"Ecuador",      group:"E", pos:3, pts:4, gd:0,  gf:3,  status:"confirmed",  note:"3rd place qualifier  | upset Germany!" },
  { name:"Curaçao",      group:"E", pos:4, pts:1, gd:-8, gf:1,  status:"eliminated", note:"Eliminated" },
  { name:"Netherlands",  group:"F", pos:1, pts:7, gd:4,  gf:8,  status:"confirmed",  note:"Group winner" },
  { name:"Japan",        group:"F", pos:2, pts:5, gd:1,  gf:4,  status:"confirmed",  note:"Runner-up" },
  { name:"Sweden",       group:"F", pos:3, pts:4, gd:0,  gf:7,  status:"confirmed",  note:"3rd place qualifier" },
  { name:"Tunisia",      group:"F", pos:4, pts:0, gd:-5, gf:2,  status:"eliminated", note:"Eliminated" },
  { name:"Belgium",      group:"G", pos:1, pts:5, gd:4,  gf:6,  status:"confirmed",  note:"Group winner" },
  { name:"Egypt",        group:"G", pos:2, pts:5, gd:2,  gf:5,  status:"confirmed",  note:"Runner-up" },
  { name:"Iran",         group:"G", pos:3, pts:3, gd:0,  gf:4,  status:"confirmed",  note:"3rd place qualifier  | VAR heartbreak 💔" },
  { name:"Iran",         group:"G", pos:3, pts:3, gd:0,  gf:4,  status:"confirmed",  note:"3rd place qualifier  | VAR heartbreak 💔" },
  { name:"New Zealand",  group:"G", pos:4, pts:1, gd:-6, gf:4,  status:"eliminated", note:"Eliminated" },
  { name:"Spain",        group:"H", pos:1, pts:7, gd:4,  gf:5,  status:"confirmed",  note:"Group winner" },
  { name:"Cape Verde",   group:"H", pos:2, pts:5, gd:0,  gf:2,  status:"confirmed",  note:"Runner-up  | Cinderella story!" },
  { name:"Uruguay",      group:"H", pos:3, pts:3, gd:-1, gf:3,  status:"eliminated", note:"Eliminated" },
  { name:"Saudi Arabia", group:"H", pos:4, pts:2, gd:-3, gf:2,  status:"eliminated", note:"Eliminated" },
  { name:"France",       group:"I", pos:1, pts:9, gd:8,  gf:10, status:"confirmed",  note:"Won all 3" },
  { name:"Norway",       group:"I", pos:2, pts:6, gd:3,  gf:8,  status:"confirmed",  note:"Runner-up" },
  { name:"Senegal",      group:"I", pos:3, pts:3, gd:1,  gf:8,  status:"confirmed",  note:"3rd place qualifier  | 5-0 Iraq!" },
  { name:"Iraq",         group:"I", pos:4, pts:0, gd:-12,gf:1,  status:"eliminated", note:"Eliminated" },
  { name:"Argentina",    group:"J", pos:1, pts:9, gd:7,  gf:5,  status:"confirmed",  note:"Won all 3  | Messi 7th WC 🐐" },
  { name:"Austria",      group:"J", pos:2, pts:4, gd:0,  gf:3,  status:"confirmed",  note:"Runner-up" },
  { name:"Algeria",      group:"J", pos:3, pts:4, gd:-2, gf:5,  status:"confirmed",  note:"3rd place qualifier  | 3-3 thriller" },
  { name:"Jordan",       group:"J", pos:4, pts:0, gd:-5, gf:2,  status:"eliminated", note:"Eliminated" },
  { name:"Colombia",     group:"K", pos:1, pts:6, gd:3,  gf:4,  status:"confirmed",  note:"Group winner" },
  { name:"Portugal",     group:"K", pos:2, pts:4, gd:5,  gf:6,  status:"confirmed",  note:"Runner-up" },
  { name:"DR Congo",     group:"K", pos:3, pts:4, gd:1,  gf:4,  status:"confirmed",  note:"3rd place qualifier" },
  { name:"Uzbekistan",   group:"K", pos:4, pts:0, gd:-7, gf:1,  status:"eliminated", note:"Eliminated" },
  { name:"England",      group:"L", pos:1, pts:7, gd:4,  gf:6,  status:"confirmed",  note:"Group winner" },
  { name:"Croatia",      group:"L", pos:2, pts:6, gd:0,  gf:5,  status:"confirmed",  note:"Runner-up" },
  { name:"Ghana",        group:"L", pos:3, pts:4, gd:0,  gf:2,  status:"confirmed",  note:"3rd place qualifier" },
  { name:"Panama",       group:"L", pos:4, pts:0, gd:-4, gf:0,  status:"eliminated", note:"Eliminated  | 0 goals scored all tournament" },
];

const STATUS_CONFIG = {
  confirmed:  { label:"Confirmed through", short:"In",   bg:"#dcfce7", text:"#166534", border:"#86efac", dot:"#16a34a" },
  eliminated: { label:"Confirmed out",     short:"Out",  bg:"#f1f5f9", text:"#64748b", border:"#cbd5e1", dot:"#94a3b8" },
};

const GROUP_STANDINGS = {
  A:{ teams:[
    { name:"Mexico",       pts:9, gf:6,  ga:1,  form:["W","W","W"] },
    { name:"South Africa", pts:6, gf:2,  ga:2,  form:["L","W","W"] },
    { name:"South Korea",  pts:3, gf:3,  ga:4,  form:["W","L","L"] },
    { name:"Czechia",      pts:1, gf:3,  ga:7,  form:["L","D","L"] },
  ]},
  B:{ teams:[
    { name:"Switzerland",  pts:7, gf:8,  ga:3,  form:["D","W","W"] },
    { name:"Canada",       pts:4, gf:8,  ga:2,  form:["D","W","L"] },
    { name:"Bosnia",       pts:4, gf:5,  ga:6,  form:["D","W","W"] },
    { name:"Qatar",        pts:1, gf:2,  ga:12, form:["D","L","L"] },
  ]},
  C:{ teams:[
    { name:"Brazil",       pts:7, gf:7,  ga:2,  form:["D","W","W"] },
    { name:"Morocco",      pts:7, gf:6,  ga:1,  form:["D","W","W"] },
    { name:"Scotland",     pts:3, gf:2,  ga:4,  form:["W","L","L"] },
    { name:"Haiti",        pts:0, gf:2,  ga:10, form:["L","L","L"] },
  ]},
  D:{ teams:[
    { name:"USA",          pts:6, gf:8,  ga:3,  form:["W","W","L"] },
    { name:"Australia",    pts:5, gf:3,  ga:2,  form:["W","W","D"] },
    { name:"Paraguay",     pts:4, gf:2,  ga:4,  form:["W","L","D"] },
    { name:"Turkey",       pts:3, gf:3,  ga:7,  form:["L","L","W"] },
  ]},
  E:{ teams:[
    { name:"Ivory Coast",  pts:7, gf:5,  ga:2,  form:["W","W","W"] },
    { name:"Germany",      pts:6, gf:8,  ga:3,  form:["W","W","L"] },
    { name:"Ecuador",      pts:4, gf:3,  ga:3,  form:["L","L","W"] },
    { name:"Curaçao",      pts:1, gf:1,  ga:9,  form:["L","L","L"] },
  ]},
  F:{ teams:[
    { name:"Netherlands",  pts:7, gf:8,  ga:4,  form:["W","W","W"] },
    { name:"Japan",        pts:5, gf:4,  ga:3,  form:["W","W","D"] },
    { name:"Sweden",       pts:4, gf:7,  ga:7,  form:["D","W","D"] },
    { name:"Tunisia",      pts:0, gf:2,  ga:7,  form:["L","L","L"] },
  ]},
  G:{ teams:[
    { name:"Belgium",      pts:5, gf:6,  ga:2,  form:["D","D","W"] },
    { name:"Egypt",        pts:5, gf:5,  ga:3,  form:["D","W","D"] },
    { name:"Iran",         pts:3, gf:4,  ga:4,  form:["D","D","D"] },
    { name:"New Zealand",  pts:1, gf:4,  ga:10, form:["D","L","L"] },
  ]},
  H:{ teams:[
    { name:"Spain",        pts:7, gf:5,  ga:1,  form:["D","W","W"] },
    { name:"Cape Verde",   pts:5, gf:2,  ga:2,  form:["D","D","D"] },
    { name:"Uruguay",      pts:3, gf:3,  ga:4,  form:["D","W","L"] },
    { name:"Saudi Arabia", pts:2, gf:2,  ga:5,  form:["D","L","D"] },
  ]},
  I:{ teams:[
    { name:"France",       pts:9, gf:10, ga:2,  form:["W","W","W"] },
    { name:"Norway",       pts:6, gf:8,  ga:5,  form:["W","W","L"] },
    { name:"Senegal",      pts:3, gf:8,  ga:7,  form:["L","L","W"] },
    { name:"Iraq",         pts:0, gf:1,  ga:13, form:["L","L","L"] },
  ]},
  J:{ teams:[
    { name:"Argentina",    pts:9, gf:8,  ga:1,  form:["W","W","W"] },
    { name:"Austria",      pts:4, gf:3,  ga:2,  form:["W","L","D"] },
    { name:"Algeria",      pts:4, gf:5,  ga:7,  form:["L","W","D"] },
    { name:"Jordan",       pts:0, gf:2,  ga:7,  form:["L","L","L"] },
  ]},
  K:{ teams:[
    { name:"Colombia",     pts:6, gf:4,  ga:1,  form:["W","W","D"] },
    { name:"Portugal",     pts:4, gf:6,  ga:1,  form:["D","W","D"] },
    { name:"DR Congo",     pts:4, gf:4,  ga:4,  form:["D","L","W"] },
    { name:"Uzbekistan",   pts:0, gf:2,  ga:10, form:["L","L","L"] },
  ]},
  L:{ teams:[
    { name:"England",      pts:7, gf:6,  ga:2,  form:["W","D","W"] },
    { name:"Croatia",      pts:6, gf:5,  ga:5,  form:["L","W","W"] },
    { name:"Ghana",        pts:4, gf:2,  ga:2,  form:["W","D","L"] },
    { name:"Panama",       pts:0, gf:0,  ga:4,  form:["L","L","L"] },
  ]},
};

const TABS = ["Bracket", "Group Standings", "All 32 Teams", "Schedule"];

function probColor(p) {
  if (p>=80) return {color:"#166534",bg:"#dcfce7"};
  if (p>=50) return {color:"#854d0e",bg:"#fef9c3"};
  if (p>=20) return {color:"#9a3412",bg:"#ffedd5"};
  return {color:"#991b1b",bg:"#fee2e2"};
}

function MatchCard(props) {
  var match=props.match, now=props.now, compact=props.compact===undefined?false:props.compact;
  const kickoff = new Date(match.utc);
  const nowMs = now.getTime();
  const kickMs = kickoff.getTime();
  const endMs = kickMs + 130*60*1000;
  const isLive = nowMs>=kickMs && nowMs<=endMs;
  const isPast = nowMs>endMs;
  const timeStr = kickoff.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"});
  const dateStr = kickoff.toLocaleDateString(undefined,{month:"short",day:"numeric"});
  const cfg = ROUND_CONFIG[match.round]||ROUND_CONFIG.R32;
  const isTBD = (t)=>t.startsWith("W ")||t.startsWith("L ");

  return (
    <div style={{
      background:"#fff", borderRadius:"8px", border:"1px solid "+cfg.border,
      padding: compact?"8px 10px":"10px 14px",
      borderLeft:"3px solid "+cfg.color,
      boxShadow:"0 1px 2px rgba(0,0,0,0.04)",
      opacity: isPast&&!isLive ? 0.7 : 1,
    }}>
      {/* date/time row */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
        <span style={{fontSize:"9px",fontWeight:"700",color:cfg.color,background:cfg.bg,padding:"1px 6px",borderRadius:"4px"}}>{cfg.short}</span>
        <span style={{fontSize:"9px",color: isLive?"#b45309": isPast?"#94a3b8":"#475569", fontWeight: isLive?"700":"400"}}>
          {isLive ? "🔴 LIVE" : isPast ? "FT" : dateStr+" | "+timeStr}
        </span>
      </div>
      {/* teams */}
      <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
        {!isTBD(match.home)?<span style={{fontSize:"16px"}}>{flag(match.home)}</span>:null}
        <span style={{flex:1,fontSize: compact?"11px":"12px",fontWeight:"600",color:isTBD(match.home)?"#94a3b8":"#1e293b",textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{match.home}</span>
        <span style={{fontSize:"10px",color:"#94a3b8",flexShrink:0,minWidth:"20px",textAlign:"center"}}>
          {match.score ? <strong style={{color:"#1e293b",fontSize:"12px"}}>{match.score}</strong> : "vs"}
        </span>
        <span style={{flex:1,fontSize: compact?"11px":"12px",fontWeight:"600",color:isTBD(match.away)?"#94a3b8":"#1e293b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{match.away}</span>
        {!isTBD(match.away)?<span style={{fontSize:"16px"}}>{flag(match.away)}</span>:null}
      </div>
      {/* venue */}
      {!compact?<div style={{fontSize:"9px",color:"#94a3b8",marginTop:"4px",textAlign:"center"}}>{match.venue}</div>:null}
      {match.winner?<div style={{fontSize:"9px",color:"#166534",fontWeight:"600",textAlign:"center",marginTop:"3px"}}>v {match.winner} advances</div>:null}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [now, setNow] = useState(new Date());
  const [roundFilter, setRoundFilter] = useState("all");

  useEffect(()=>{
    const t = setInterval(()=>setNow(new Date()),1000);
    return ()=>clearInterval(t);
  },[]);

  const timeStr = now.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit",second:"2-digit"});
  const dateStr = now.toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const tzStr   = now.toLocaleTimeString(undefined,{timeZoneName:"short"}).split(" ").pop();

  const rounds = ["R32","R16","QF","SF","3rd","Final"];
  const bracketByRound = useMemo(()=>{
    const obj={};
    rounds.forEach(r=>{ obj[r]=BRACKET.filter(m=>m.round===r); });
    return obj;
  },[]);

  const filteredSchedule = useMemo(()=>{
    if(roundFilter==="all") return BRACKET;
    return BRACKET.filter(m=>m.round===roundFilter);
  },[roundFilter]);

  const scheduleByDate = useMemo(()=>{
    const groups={};
    filteredSchedule.forEach(m=>{
      const d=new Date(m.utc);
      const key=d.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
      if(!groups[key]) groups[key]=[];
      groups[key].push(m);
    });
    return groups;
  },[filteredSchedule]);

  const groupedAllTeams = useMemo(()=>{
    const g={};
    ALL_TEAMS.forEach(t=>{ if(!g[t.group]) g[t.group]=[]; g[t.group].push(t); });
    return g;
  },[]);

  const confirmed = ALL_TEAMS.filter(t=>t.status==="confirmed");
  const eliminated = ALL_TEAMS.filter(t=>t.status==="eliminated");

  return (
    <div style={{background:"#f8fafc",minHeight:"100vh",fontFamily:"Inter,Segoe UI,sans-serif",color:"#1e293b",maxWidth:"75vw",margin:"0 auto",boxSizing:"border-box"}}>

      {/* Header */}
      <div style={{padding:"12px 16px",borderBottom:"1px solid #e2e8f0",background:"#fff",display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
        <div>
          <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#94a3b8",marginBottom:"2px"}}>2026 FIFA World Cup | Knockout Stage</div>
          <div style={{fontSize:"20px",fontWeight:"700",color:"#0f172a"}}>Knockout Stage Tracker</div>
        </div>
        <div style={{marginLeft:"auto",textAlign:"right"}}>
          <div style={{fontSize:"22px",fontWeight:"700",color:"#0f172a",letterSpacing:"-0.5px",fontVariantNumeric:"tabular-nums"}}>{timeStr}</div>
          <div style={{fontSize:"11px",color:"#64748b"}}>{dateStr} | {tzStr}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #e2e8f0",padding:"0 12px",background:"#fff",overflowX:"auto"}}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)} style={{padding:"10px 14px",fontSize:"12px",fontWeight:"600",whiteSpace:"nowrap",background:"transparent",border:"none",cursor:"pointer",color:tab===i?"#2563eb":"#94a3b8",borderBottom:tab===i?"2px solid #2563eb":"2px solid transparent",marginRight:"4px"}}>{t}</button>
        ))}
      </div>

      {/* -- TAB 0: BRACKET --------------------------------------------------- */}
      {tab===0&&(
        <div style={{padding:"14px 12px"}}>
          <div style={{fontSize:"11px",color:"#64748b",marginBottom:"14px"}}>Single elimination  | 32 teams  | All times in {tzStr}</div>

          {rounds.map(round=>{
            const matches = bracketByRound[round]||[];
            const cfg = ROUND_CONFIG[round];
            return (
              <div key={round} style={{marginBottom:"20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
                  <div style={{fontSize:"13px",fontWeight:"700",color:cfg.color}}>{cfg.label}</div>
                  <div style={{flex:1,height:"1px",background:cfg.border}}/>
                  {round==="R32"?<div style={{fontSize:"10px",color:"#94a3b8"}}>Jun 28 - Jul 3</div>:null}
                  {round==="R16"?<div style={{fontSize:"10px",color:"#94a3b8"}}>Jul 4-7</div>:null}
                  {round==="QF"?<div style={{fontSize:"10px",color:"#94a3b8"}}>Jul 9-12</div>:null}
                  {round==="SF"?<div style={{fontSize:"10px",color:"#94a3b8"}}>Jul 14-15</div>:null}
                  {round==="3rd"?<div style={{fontSize:"10px",color:"#94a3b8"}}>Jul 18</div>:null}
                  {round==="Final"?<div style={{fontSize:"10px",color:"#94a3b8"}}>Jul 19  | MetLife Stadium</div>:null}
                </div>
                <div style={{
                  display:"grid",
                  gridTemplateColumns: round==="R32" ? "repeat(auto-fill,minmax(220px,1fr))"
                    : round==="R16" ? "repeat(auto-fill,minmax(240px,1fr))"
                    : round==="QF"  ? "repeat(auto-fill,minmax(260px,1fr))"
                    : "repeat(auto-fill,minmax(280px,1fr))",
                  gap:"8px",
                }}>
                  {matches.map(m=>(
                    <MatchCard key={m.id} match={m} now={now} compact={round==="R32"}/>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -- TAB 1: GROUP STANDINGS ------------------------------------------- */}
      {tab===1&&(
        <div style={{padding:"14px 12px"}}>
          <div style={{fontSize:"11px",color:"#64748b",marginBottom:"14px"}}>Final group stage standings  | Best 3rd tiebreakers: Pts > GD > Goals scored > Fair play > FIFA ranking</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"12px"}}>
            {Object.entries(GROUP_STANDINGS).map(([grp,data])=>(
              <div key={grp} style={{background:"#fff",borderRadius:"10px",border:"1px solid #e2e8f0",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
                <div style={{background:"#f1f5f9",padding:"6px 12px",fontSize:"11px",fontWeight:"700",color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>Group {grp}</div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",minWidth:"280px",borderCollapse:"collapse",fontSize:"11px"}}>
                    <thead>
                      <tr style={{background:"#f8fafc",borderBottom:"1px solid #f1f5f9"}}>
                        <th style={{padding:"5px 8px",textAlign:"left",fontSize:"9px",fontWeight:"600",color:"#94a3b8",textTransform:"uppercase"}}></th>
                        <th style={{padding:"5px 4px",textAlign:"center",fontSize:"9px",fontWeight:"600",color:"#94a3b8",textTransform:"uppercase"}}>Pts</th>
                        <th style={{padding:"5px 4px",textAlign:"center",fontSize:"9px",fontWeight:"600",color:"#94a3b8",textTransform:"uppercase"}}>GD</th>
                        <th style={{padding:"5px 4px",textAlign:"center",fontSize:"9px",fontWeight:"600",color:"#94a3b8",textTransform:"uppercase"}}>GF</th>
                        <th style={{padding:"5px 4px",textAlign:"center",fontSize:"9px",fontWeight:"600",color:"#94a3b8",textTransform:"uppercase"}}>GA</th>
                        <th style={{padding:"5px 8px",textAlign:"center",fontSize:"9px",fontWeight:"600",color:"#94a3b8",textTransform:"uppercase"}}>Form</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.teams.map((t,ti)=>{
                        const gd=t.gf-t.ga;
                        const gdStr=gd>0?"+" + gd:"" + gd;
                        const teamData=ALL_TEAMS.find(a=>a.name===t.name);
                        const isElim=teamData && teamData.status==="eliminated";
                        const isConf=teamData && teamData.status==="confirmed";
                        return(
                          <tr key={t.name} style={{borderBottom:ti<data.teams.length-1?"1px solid #f1f5f9":"none",background:isConf?"#f0fdf4":"#fff",borderLeft:"3px solid "+(isConf?"#86efac":"#e2e8f0")}}>
                            <td style={{padding:"7px 8px"}}>
                              <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                                <span style={{fontSize:"13px",opacity:isElim?0.4:1}}>{flag(t.name)}</span>
                                <span style={{fontSize:"11px",fontWeight:"600",color:isElim?"#94a3b8":"#1e293b",textDecoration:isElim?"line-through":"none"}}>{t.name}</span>
                              </div>
                            </td>
                            <td style={{padding:"7px 4px",textAlign:"center"}}><span style={{fontWeight:"800",fontSize:"13px",color:t.pts>=6?"#16a34a":t.pts>=3?"#ca8a04":"#dc2626"}}>{t.pts}</span></td>
                            <td style={{padding:"7px 4px",textAlign:"center"}}><span style={{fontWeight:"600",color:gd>0?"#16a34a":gd===0?"#64748b":"#dc2626"}}>{gdStr}</span></td>
                            <td style={{padding:"7px 4px",textAlign:"center",color:"#475569"}}>{t.gf}</td>
                            <td style={{padding:"7px 4px",textAlign:"center",color:"#475569"}}>{t.ga}</td>
                            <td style={{padding:"7px 8px"}}>
                              <div style={{display:"flex",gap:"2px",justifyContent:"center"}}>
                                {t.form.map((r,ri)=>(
                                  <span key={ri} style={{fontSize:"9px",fontWeight:"700",width:"16px",height:"16px",borderRadius:"3px",display:"flex",alignItems:"center",justifyContent:"center",background:r==="W"?"#dcfce7":r==="D"?"#dbeafe":"#fee2e2",color:r==="W"?"#166534":r==="D"?"#1e40af":"#991b1b"}}>{r}</span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -- TAB 2: ALL 32 TEAMS ---------------------------------------------- */}
      {tab===2&&(
        <div style={{padding:"14px 12px"}}>
          <div style={{marginBottom:"16px"}}>
            <div style={{fontSize:"12px",fontWeight:"700",color:"#166534",marginBottom:"8px"}}>[v] 32 teams in the knockout round</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"6px",marginBottom:"16px"}}>
              {confirmed.map(t=>(
                <div key={t.name} style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 10px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"8px"}}>
                  <span style={{fontSize:"14px"}}>{flag(t.name)}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"12px",fontWeight:"600",color:"#1e293b"}}>{t.name}</div>
                    <div style={{fontSize:"9px",color:"#64748b"}}>Grp {t.group}  | {t.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{fontSize:"12px",fontWeight:"700",color:"#dc2626",marginBottom:"8px"}}>[x] {eliminated.length} teams eliminated</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"4px"}}>
              {eliminated.map(t=>(
                <div key={t.name} style={{display:"flex",alignItems:"center",gap:"6px",padding:"5px 8px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"6px",opacity:0.7}}>
                  <span style={{fontSize:"13px",opacity:0.5}}>{flag(t.name)}</span>
                  <span style={{fontSize:"11px",color:"#94a3b8",textDecoration:"line-through"}}>{t.name}</span>
                  <span style={{fontSize:"9px",color:"#cbd5e1",marginLeft:"auto"}}>Grp {t.group}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -- TAB 3: SCHEDULE -------------------------------------------------- */}
      {tab===3&&(
        <div style={{padding:"14px 12px"}}>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"14px",overflowX:"auto",paddingBottom:"4px"}}>
            <button onClick={()=>setRoundFilter("all")} style={{padding:"5px 12px",fontSize:"11px",fontWeight:"600",borderRadius:"20px",border:"1px solid "+(roundFilter==="all"?"#2563eb":"#e2e8f0"),background:roundFilter==="all"?"#eff6ff":"#fff",color:roundFilter==="all"?"#2563eb":"#64748b",cursor:"pointer",whiteSpace:"nowrap"}}>All</button>
            {Object.entries(ROUND_CONFIG).map(([key,cfg])=>(
              <button key={key} onClick={()=>setRoundFilter(key===roundFilter?"all":key)} style={{padding:"5px 12px",fontSize:"11px",fontWeight:"600",borderRadius:"20px",border:"1px solid "+(roundFilter===key?cfg.color:"#e2e8f0"),background:roundFilter===key?cfg.bg:"#fff",color:roundFilter===key?cfg.color:"#64748b",cursor:"pointer",whiteSpace:"nowrap"}}>{cfg.label}</button>
            ))}
          </div>
          <div style={{fontSize:"11px",color:"#64748b",marginBottom:"12px"}}>All times in {tzStr}</div>
          <div style={{overflowY:"auto",maxHeight:"70vh",WebkitOverflowScrolling:"touch"}}>
            {Object.entries(scheduleByDate).map(([dateLabel,matches])=>(
              <div key={dateLabel} style={{marginBottom:"20px"}}>
                <div style={{fontSize:"12px",fontWeight:"700",color:"#475569",textTransform:"uppercase",letterSpacing:"1px",borderBottom:"2px solid #e2e8f0",paddingBottom:"6px",marginBottom:"8px"}}>{dateLabel}</div>
                <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                  {matches.map(m=><MatchCard key={m.id} match={m} now={now}/>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}