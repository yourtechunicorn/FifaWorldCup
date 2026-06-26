import { useState, useMemo, useEffect } from "react";

const CONFIRMED = [
  { name:"Mexico",       group:"A", pos:"Winner"    },
  { name:"South Africa", group:"A", pos:"Runner-up" },
  { name:"Switzerland",  group:"B", pos:"Winner"    },
  { name:"Canada",       group:"B", pos:"Runner-up" },
  { name:"Brazil",       group:"C", pos:"Winner"    },
  { name:"Morocco",      group:"C", pos:"Runner-up" },
  { name:"USA",          group:"D", pos:"Winner"    },
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
  // GROUP A — complete
  { name:"Mexico",       group:"A", pos:1, pts:9, status:"confirmed",  prob:null, note:"Won all 3 — Group winner" },
  { name:"South Africa", group:"A", pos:2, pts:6, status:"confirmed",  prob:null, note:"Runner-up · upset S.Korea 1–0" },
  { name:"South Korea",  group:"A", pos:3, pts:3, status:"bubble",     prob:45,   note:"3 pts · GD TBD · 3rd place battle" },
  { name:"Czechia",      group:"A", pos:4, pts:1, status:"eliminated", prob:0,    note:"Lost 0–3 to Mexico" },
  // GROUP B — complete
  { name:"Switzerland",  group:"B", pos:1, pts:7, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Canada",       group:"B", pos:2, pts:4, status:"confirmed",  prob:null, note:"Runner-up confirmed" },
  { name:"Bosnia",       group:"B", pos:3, pts:4, status:"likely_in",  prob:80,   note:"W 3–1 vs Qatar · strong 3rd" },
  { name:"Qatar",        group:"B", pos:4, pts:1, status:"eliminated", prob:0,    note:"Confirmed out" },
  // GROUP C — complete
  { name:"Brazil",       group:"C", pos:1, pts:7, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Morocco",      group:"C", pos:2, pts:7, status:"confirmed",  prob:null, note:"Runner-up confirmed" },
  { name:"Scotland",     group:"C", pos:3, pts:3, status:"bubble",     prob:83,   note:"L 0–3 Brazil · GD –3 · needs help" },
  { name:"Haiti",        group:"C", pos:4, pts:0, status:"eliminated", prob:0,    note:"Confirmed out" },
  // GROUP D — playing today
  { name:"USA",          group:"D", pos:1, pts:6, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Australia",    group:"D", pos:2, pts:4, status:"likely_in",  prob:93,   note:"🔴 LIVE vs Paraguay" },
  { name:"Paraguay",     group:"D", pos:3, pts:3, status:"bubble",     prob:89,   note:"🔴 LIVE vs Australia" },
  { name:"Turkey",       group:"D", pos:4, pts:0, status:"eliminated", prob:0,    note:"Confirmed out" },
  // GROUP E — complete
  { name:"Ivory Coast",  group:"E", pos:1, pts:7, status:"confirmed",  prob:null, note:"Group winner · W 2–0 vs Curaçao" },
  { name:"Germany",      group:"E", pos:2, pts:6, status:"confirmed",  prob:null, note:"Runner-up · L 1–2 vs Ecuador (shock)" },
  { name:"Ecuador",      group:"E", pos:3, pts:4, status:"confirmed",  prob:null, note:"🚨 W 2–1 vs Germany · confirmed 3rd" },
  { name:"Curaçao",      group:"E", pos:4, pts:1, status:"eliminated", prob:0,    note:"L 0–2 vs Ivory Coast" },
  // GROUP F — complete
  { name:"Netherlands",  group:"F", pos:1, pts:7, status:"confirmed",  prob:null, note:"Group winner · W 3–1 vs Tunisia" },
  { name:"Japan",        group:"F", pos:2, pts:5, status:"confirmed",  prob:null, note:"Runner-up · D 1–1 vs Sweden" },
  { name:"Sweden",       group:"F", pos:3, pts:4, status:"confirmed",  prob:null, note:"D 1–1 vs Japan · confirmed 3rd" },
  { name:"Tunisia",      group:"F", pos:4, pts:0, status:"eliminated", prob:0,    note:"L 1–3 vs Netherlands" },
  // GROUP G — Jun 26-27
  { name:"Egypt",        group:"G", pos:1, pts:4, status:"likely_in",  prob:78,   note:"Playing Iran Jun 26" },
  { name:"Iran",         group:"G", pos:2, pts:2, status:"bubble",     prob:33,   note:"Playing Egypt Jun 26" },
  { name:"Belgium",      group:"G", pos:3, pts:2, status:"bubble",     prob:96,   note:"3rd place contender · vs NZ Jun 27" },
  { name:"New Zealand",  group:"G", pos:4, pts:1, status:"likely_out", prob:11,   note:"Playing Belgium Jun 27" },
  // GROUP H — Jun 26-27
  { name:"Spain",        group:"H", pos:1, pts:7, status:"confirmed",  prob:null, note:"Confirmed through" },
  { name:"Uruguay",      group:"H", pos:2, pts:3, status:"bubble",     prob:44,   note:"Playing Spain Jun 27" },
  { name:"Cape Verde",   group:"H", pos:3, pts:2, status:"bubble",     prob:40,   note:"3rd place contender · vs S.Arabia" },
  { name:"Saudi Arabia", group:"H", pos:4, pts:1, status:"likely_out", prob:10,   note:"Playing Cape Verde Jun 26" },
  // GROUP I — Jun 26
  { name:"France",       group:"I", pos:1, pts:6, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Norway",       group:"I", pos:2, pts:6, status:"confirmed",  prob:null, note:"Runner-up confirmed" },
  { name:"Senegal",      group:"I", pos:3, pts:0, status:"bubble",     prob:20,   note:"3rd place long shot · vs Iraq" },
  { name:"Iraq",         group:"I", pos:4, pts:0, status:"likely_out", prob:8,    note:"Playing Senegal Jun 26" },
  // GROUP J — complete
  { name:"Argentina",    group:"J", pos:1, pts:6, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Austria",      group:"J", pos:2, pts:6, status:"confirmed",  prob:null, note:"Runner-up confirmed" },
  { name:"Algeria",      group:"J", pos:3, pts:3, status:"bubble",     prob:86,   note:"3rd place contender · vs Austria" },
  { name:"Jordan",       group:"J", pos:4, pts:1, status:"eliminated", prob:0,    note:"Confirmed out" },
  // GROUP K — Jun 28
  { name:"Colombia",     group:"K", pos:1, pts:6, status:"confirmed",  prob:null, note:"Group winner" },
  { name:"Portugal",     group:"K", pos:2, pts:4, status:"likely_in",  prob:98,   note:"Virtual lock · vs Colombia" },
  { name:"DR Congo",     group:"K", pos:3, pts:1, status:"likely_out", prob:14,   note:"Need win + help" },
  { name:"Uzbekistan",   group:"K", pos:4, pts:1, status:"likely_out", prob:9,    note:"Need win + help" },
  // GROUP L — Jun 27-28
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
  { team:"Sweden",      group:"F", pts:4, gf:7, ga:7, done:true,  result:"D 1–1 vs Japan · confirmed through" },
  { team:"Ecuador",     group:"E", pts:4, gf:2, ga:2, done:true,  result:"🚨 W 2–1 vs Germany" },
  { team:"Scotland",    group:"C", pts:3, gf:1, ga:4, done:true,  result:"L 0–3 vs Brazil" },
  { team:"South Africa",group:"A", pts:3, gf:1, ga:2, done:true,  result:"W 1–0 vs S.Korea" },
  { team:"Croatia",     group:"L", pts:3, gf:3, ga:4, done:false, opp:"Ghana",         date:"Sat", w:27.7, d:30.3, l:42.1 },
  { team:"Algeria",     group:"J", pts:3, gf:2, ga:4, done:false, opp:"Austria",       date:"Sat", w:44.2, d:26.8, l:29.0 },
  { team:"Paraguay",    group:"D", pts:3, gf:2, ga:4, done:false, opp:"Australia",     date:"Thu", w:24.1, d:30.1, l:45.8 },
  { team:"Cape Verde",  group:"H", pts:2, gf:2, ga:2, done:false, opp:"Saudi Arabia",  date:"Fri", w:31.0, d:29.2, l:39.7 },
  { team:"Belgium",     group:"G", pts:2, gf:1, ga:1, done:false, opp:"New Zealand",   date:"Fri", w:70.0, d:17.8, l:12.2 },
  { team:"DR Congo",    group:"K", pts:1, gf:1, ga:2, done:false, opp:"Uzbekistan",    date:"Sat", w:32.2, d:29.2, l:38.6 },
  { team:"Senegal",     group:"I", pts:0, gf:3, ga:6, done:false, opp:"Iraq",          date:"Fri", w:26.8, d:28.5, l:44.7 },
];

const SCHEDULE = [
  { home:"Ecuador",     away:"Germany",      group:"E", utc:"2026-06-25T20:00:00Z", venue:"MetLife Stadium, NJ",        durationMins:105, score:"2–1" },
  { home:"Curaçao",     away:"Ivory Coast",  group:"E", utc:"2026-06-25T20:00:00Z", venue:"Lincoln Financial, PA",      durationMins:105, score:"0–2" },
  { home:"Japan",       away:"Sweden",       group:"F", utc:"2026-06-25T23:00:00Z", venue:"AT&T Stadium, Dallas",       durationMins:105, score:"1–1" },
  { home:"Tunisia",     away:"Netherlands",  group:"F", utc:"2026-06-25T23:00:00Z", venue:"Arrowhead Stadium, KC",      durationMins:105, score:"1–3" },
  { home:"Turkey",      away:"USA",          group:"D", utc:"2026-06-26T02:00:00Z", venue:"SoFi Stadium, LA",           durationMins:105 },
  { home:"Paraguay",    away:"Australia",    group:"D", utc:"2026-06-26T02:00:00Z", venue:"Levi's Stadium, SF",         durationMins:105 },
  { home:"Norway",      away:"France",       group:"I", utc:"2026-06-26T19:00:00Z", venue:"Gillette Stadium, Boston",   durationMins:105 },
  { home:"Senegal",     away:"Iraq",         group:"I", utc:"2026-06-26T19:00:00Z", venue:"BMO Field, Toronto",         durationMins:105 },
  { home:"Cape Verde",  away:"Saudi Arabia", group:"H", utc:"2026-06-27T00:00:00Z", venue:"NRG Stadium, Houston",       durationMins:105 },
  { home:"Egypt",       away:"Iran",         group:"G", utc:"2026-06-27T03:00:00Z", venue:"Lumen Field, Seattle",       durationMins:105 },
  { home:"New Zealand", away:"Belgium",      group:"G", utc:"2026-06-27T03:00:00Z", venue:"BC Place, Vancouver",        durationMins:105 },
  { home:"Uruguay",     away:"Spain",        group:"H", utc:"2026-06-28T00:00:00Z", venue:"Estadio Akron, Guadalajara", durationMins:105 },
  { home:"Panama",      away:"England",      group:"L", utc:"2026-06-28T02:00:00Z", venue:"MetLife Stadium, NJ",        durationMins:105 },
  { home:"Croatia",     away:"Ghana",        group:"L", utc:"2026-06-28T02:00:00Z", venue:"Lincoln Financial, PA",      durationMins:105 },
  { home:"Algeria",     away:"Austria",      group:"J", utc:"2026-06-28T02:00:00Z", venue:"Arrowhead Stadium, KC",      durationMins:105 },
  { home:"Jordan",      away:"Argentina",    group:"J", utc:"2026-06-28T02:00:00Z", venue:"AT&T Stadium, Dallas",       durationMins:105 },
  { home:"Colombia",    away:"Portugal",     group:"K", utc:"2026-06-29T02:00:00Z", venue:"Hard Rock Stadium, Miami",   durationMins:105 },
  { home:"Uzbekistan",  away:"DR Congo",     group:"K", utc:"2026-06-29T02:00:00Z", venue:"Mercedes-Benz, Atlanta",     durationMins:105 },
];

const ptsDelta = { Win:3, Draw:1, Loss:0 };
const gdDelta  = { Win:1, Draw:0, Loss:-2 };
const TABS = ["All 48 teams", "3rd place race", "Schedule"];

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
      <span style={{ fontSize:"12px", fontWeight:"600", color:"#1e293b", flex:1 }}>{name}</span>
      <span style={{ fontSize:"10px", color:"#94a3b8" }}>Grp {group}</span>
      <span style={{ fontSize:"9px", fontWeight:"600", padding:"2px 7px", borderRadius:"20px", background:badgeStyle.bg, color:badgeStyle.color, border:`1px solid ${badgeStyle.border}`, whiteSpace:"nowrap" }}>{pos}</span>
    </div>
  );
}

function EliminatedRow({ name, group }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 10px", borderRadius:"6px", background:"#f8fafc", marginBottom:"3px", border:"1px solid #e2e8f0" }}>
      <span style={{ fontSize:"12px", color:"#94a3b8", flex:1, textDecoration:"line-through" }}>{name}</span>
      <span style={{ fontSize:"10px", color:"#94a3b8" }}>Grp {group}</span>
      <span style={{ fontSize:"9px", fontWeight:"600", padding:"2px 7px", borderRadius:"20px", background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5" }}>Eliminated</span>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState("all");
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

  const scheduleByDate = useMemo(() => groupMatchesByDate(SCHEDULE), []);

  const btnStyle = (team, outcome) => {
    const active = selections[team] === outcome;
    const colors = {
      Win:  { bg:"#dcfce7", color:"#166534", border:"#86efac" },
      Draw: { bg:"#dbeafe", color:"#1e40af", border:"#93c5fd" },
      Loss: { bg:"#fee2e2", color:"#991b1b", border:"#fca5a5" },
    };
    const c = colors[outcome];
    return {
      padding:"2px 6px", fontSize:"10px", fontWeight:"600", borderRadius:"4px",
      border:`1px solid ${active ? c.border : "#e2e8f0"}`,
      background: active ? c.bg : "#f8fafc",
      color: active ? c.color : "#94a3b8",
      cursor:"pointer", display:"flex", flexDirection:"column",
      alignItems:"center", lineHeight:"1.3", minWidth:"28px",
    };
  };

  const timeStr = now.toLocaleTimeString(undefined, { hour:"numeric", minute:"2-digit", second:"2-digit" });
  const dateStr = now.toLocaleDateString(undefined, { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const tzStr   = now.toLocaleTimeString(undefined, { timeZoneName:"short" }).split(" ").pop();

  const scot = computed.find(t => t.team === "Scotland");

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
          <button key={t} onClick={() => setTab(i)} style={{ padding:"10px 14px", fontSize:"12px", fontWeight:"600", whiteSpace:"nowrap", background:"transparent", border:"none", cursor:"pointer", color: tab===i ? "#2563eb" : "#94a3b8", borderBottom: tab===i ? "2px solid #2563eb" : "2px solid transparent", marginRight:"4px" }}>{t}</button>
        ))}
      </div>

      {/* TAB 0: All 48 teams */}
      {tab === 0 && (
        <div style={{ padding:"14px 12px" }}>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"14px", overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:"4px" }}>
            <button onClick={() => setFilter("all")} style={{ padding:"5px 12px", fontSize:"11px", fontWeight:"600", borderRadius:"20px", border:`1px solid ${filter==="all"?"#2563eb":"#e2e8f0"}`, background:filter==="all"?"#eff6ff":"#fff", color:filter==="all"?"#2563eb":"#64748b", cursor:"pointer" }}>All 48</button>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => setFilter(key===filter?"all":key)} style={{ padding:"5px 12px", fontSize:"11px", fontWeight:"600", borderRadius:"20px", border:`1px solid ${filter===key?cfg.border:"#e2e8f0"}`, background:filter===key?cfg.bg:"#fff", color:filter===key?cfg.text:"#64748b", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:cfg.dot, display:"inline-block" }}/>
                {cfg.label} ({counts[key]})
              </button>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(260px,100%), 1fr))", gap:"10px" }}>
            {Object.entries(groupedTeams).sort().map(([grp, teams]) => (
              <div key={grp} style={{ background:"#fff", borderRadius:"10px", border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ background:"#f1f5f9", padding:"6px 12px", fontSize:"11px", fontWeight:"700", color:"#475569", letterSpacing:"1px", textTransform:"uppercase" }}>Group {grp}</div>
                {teams.map((t, ti) => {
                  const cfg = STATUS_CONFIG[t.status];
                  const isScot = t.name === "Scotland";
                  const showProb = t.prob !== null && t.status !== "confirmed" && t.status !== "eliminated";
                  const pc = showProb ? probColor(t.prob) : null;
                  return (
                    <div key={t.name} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 12px", borderBottom:ti<teams.length-1?"1px solid #f1f5f9":"none", borderLeft:`3px solid ${cfg.border}`, background:isScot?"#eff6ff":"#fff" }}>
                      <span style={{ fontSize:"11px", color:"#94a3b8", width:"14px", textAlign:"center", fontWeight:"600" }}>{t.pos}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"12px", fontWeight:"600", color:isScot?"#1d4ed8":"#1e293b" }}>{isScot&&"🏴󠁧󠁢󠁳󠁣󠁴󠁿 "}{t.name}</div>
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
          <div style={{ marginTop:"14px", fontSize:"10px", color:"#94a3b8", display:"flex", gap:"16px", flexWrap:"wrap" }}>
            <span>% = advancement probability · FOX Sports odds Jun 24</span>
            <span>Groups A–F complete · D playing today · G–L play Jun 26–28</span>
          </div>
        </div>
      )}

      {/* TAB 1: 3rd place race */}
      {tab === 1 && (
        <div style={{ padding:"14px 12px" }}>
          <div style={{ background:"#fef9c3", border:"1px solid #fde047", borderRadius:"8px", padding:"10px 14px", marginBottom:"14px", fontSize:"12px", color:"#854d0e" }}>
            ✅ <strong>Groups E &amp; F complete:</strong> Ecuador 2–1 Germany 🚨 · Ivory Coast 2–0 Curaçao · Japan 1–1 Sweden (both through) · Netherlands 3–1 Tunisia · Sweden &amp; Ecuador confirmed 3rd-place qualifiers · Turkey/USA &amp; Paraguay/Australia 🔴 LIVE
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
            <label style={{ fontSize:"12px", color:"#64748b", display:"flex", alignItems:"center", gap:"6px", cursor:"pointer" }}>
              <input type="checkbox" checked={showOdds} onChange={e => setShowOdds(e.target.checked)} />
              Show betting odds
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
                    const isScot = t.team === "Scotland";
                    const passing = t.rank <= 8;
                    const gdStr = (t.finalGD > 0 ? "+" : "") + t.finalGD;
                    return (
                      <>
                        {i === 8 && (
                          <tr key="cutline">
                            <td colSpan={showOdds ? 6 : 5} style={{ padding:"0" }}>
                              <div style={{ height:"2px", background:"#ef4444", position:"relative" }}>
                                <span style={{ position:"absolute", left:"50%", transform:"translateX(-50%) translateY(-50%)", background:"#ef4444", color:"#fff", fontSize:"9px", fontWeight:"700", padding:"2px 10px", borderRadius:"10px", letterSpacing:"1px", textTransform:"uppercase", whiteSpace:"nowrap" }}>— elimination line —</span>
                              </div>
                            </td>
                          </tr>
                        )}
                        <tr key={t.team} style={{ background:isScot?"#eff6ff":i%2===0?"#fff":"#f8fafc", borderLeft:`3px solid ${passing?(isScot?"#3b82f6":"#86efac"):"#fca5a5"}`, borderBottom:"1px solid #f1f5f9" }}>
                          <td style={{ padding:"9px 10px", textAlign:"center" }}>
                            <span style={{ fontSize:"15px", fontWeight:"800", color:passing?"#16a34a":"#dc2626" }}>{t.rank}</span>
                          </td>
                          <td style={{ padding:"9px 10px" }}>
                            <div style={{ fontWeight:"600", color:isScot?"#1d4ed8":"#1e293b" }}>{isScot&&"🏴󠁧󠁢󠁳󠁣󠁴󠁿 "}{t.team}</div>
                            <div style={{ fontSize:"10px", color:"#94a3b8" }}>Group {t.group}</div>
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
                                <div style={{ fontSize:"11px", color:"#475569" }}>vs {t.opp} · {t.date}</div>
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
            <span>GD: W≈+1 · D=0 · L≈–2 (estimated)</span>
            <span>Updated: Jun 25 post Groups A–F</span>
          </div>
        </div>
      )}

      {/* TAB 2: Schedule */}
      {tab === 2 && (
        <div style={{ padding:"14px 12px" }}>
          <div style={{ fontSize:"12px", color:"#64748b", marginBottom:"16px" }}>All times in your local timezone · {tzStr}</div>
          <div style={{ overflowY:"auto", maxHeight:"70vh", WebkitOverflowScrolling:"touch" }}>
            {Object.entries(scheduleByDate).map(([dateLabel, matches]) => (
              <div key={dateLabel} style={{ marginBottom:"24px" }}>
                <div style={{ fontSize:"12px", fontWeight:"700", color:"#475569", textTransform:"uppercase", letterSpacing:"1px", borderBottom:"2px solid #e2e8f0", paddingBottom:"6px", marginBottom:"10px" }}>{dateLabel}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {matches.map((m, i) => {
                    const kickoff = new Date(m.utc);
                    const kickoffMs = kickoff.getTime();
                    const nowMs = now.getTime();
                    const endMs = kickoffMs + (m.durationMins || 105) * 60 * 1000;
                    const isLive = nowMs >= kickoffMs && nowMs <= endMs;
                    const isPast = nowMs > endMs;
                    const timeLocal = kickoff.toLocaleTimeString(undefined, { hour:"numeric", minute:"2-digit" });
                    return (
                      <div key={i} style={{ background:"#fff", borderRadius:"10px", border:"1px solid #e2e8f0", padding:"10px 12px", display:"flex", alignItems:"center", gap:"8px", flexWrap:"nowrap", boxShadow:"0 1px 3px rgba(0,0,0,0.04)", borderLeft:`3px solid ${isLive?"#f59e0b":isPast?"#cbd5e1":"#3b82f6"}`, opacity:isPast&&!isLive?0.6:1 }}>
                        <div style={{ textAlign:"center", minWidth:"52px" }}>
                          {isLive
                            ? <span style={{ fontSize:"10px", fontWeight:"700", color:"#b45309", background:"#fef9c3", padding:"2px 6px", borderRadius:"10px" }}>🔴 LIVE</span>
                            : isPast
                            ? <span style={{ fontSize:"10px", color:"#94a3b8" }}>FT</span>
                            : <span style={{ fontSize:"12px", fontWeight:"600", color:"#2563eb" }}>{timeLocal}</span>
                          }
                        </div>
                        <div style={{ flex:1, display:"flex", alignItems:"center", gap:"8px" }}>
                          <span style={{ fontSize:"12px", fontWeight:"600", color:"#1e293b", textAlign:"right", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.home}</span>
                          <span style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"500", flexShrink:0 }}>
                            {m.score ? <strong style={{ color:"#1e293b", fontSize:"13px" }}>{m.score}</strong> : "vs"}
                          </span>
                          <span style={{ fontSize:"12px", fontWeight:"600", color:"#1e293b", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.away}</span>
                        </div>
                        <div style={{ textAlign:"right", minWidth:"140px" }}>
                          <div style={{ fontSize:"10px", fontWeight:"700", color:"#2563eb", background:"#eff6ff", padding:"1px 6px", borderRadius:"6px", display:"inline-block", marginBottom:"2px" }}>Group {m.group}</div>
                          <div style={{ fontSize:"9px", color:"#94a3b8", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"140px" }}>{m.venue}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:"10px", color:"#94a3b8", marginTop:"8px" }}>
            Remaining group stage matches · Knockout round begins Jun 28
          </div>
        </div>
      )}

      {/* Confirmed & Eliminated panels — only shown on Tab 0 */}
      {tab === 0 && false && null}

    </div>
  );
}
