import { useState, useRef, useEffect } from "react";

// ─── BRAND ───────────────────────────────────────────────────────────────────
const R = "#C8102E";
const YES_BG = "#e8f5e9"; const YES_BD = "#81c784";
const NO_BG  = "#ffebee"; const NO_BD  = "#e57373";
const WEBHOOK_URL = "https://n8n.srv1382362.hstgr.cloud/webhook/guthries-operations-hub";
const LOCATIONS = ["Collierville", "Dexter", "Whitehaven", "Olive Branch", "Oxford"];

const inputStyle = {
  width:"100%", boxSizing:"border-box", border:"1px solid #ddd",
  borderRadius:7, padding:"10px 12px", fontSize:14, outline:"none",
  fontFamily:"inherit", color:"#333", background:"white"
};
const labelStyle = {
  fontSize:11, fontWeight:700, color:"#888", textTransform:"uppercase",
  letterSpacing:0.5, marginBottom:4, display:"block"
};

// ─── HEADER ──────────────────────────────────────────────────────────────────
function Header({ title, subtitle, onBack, right }) {
  return (
    <div style={{
      position:"sticky", top:0, zIndex:200, background:"white",
      borderBottom:`3px solid ${R}`, padding:"12px 16px",
      boxShadow:"0 2px 12px rgba(0,0,0,0.12)"
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {onBack && (
            <button onClick={onBack} style={{
              background:"none", border:"none", fontSize:20, cursor:"pointer",
              color:R, padding:"0 4px", lineHeight:1
            }}>←</button>
          )}
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:R, letterSpacing:-1, lineHeight:1 }}>
              Guthrie's
            </div>
            <div style={{ fontSize:9, letterSpacing:2.5, color:"#999", textTransform:"uppercase" }}>
              {subtitle || "Golden Fried Chicken Fingers"}
            </div>
          </div>
        </div>
        {right || <div style={{ width:40 }} />}
      </div>
      {title && (
        <div style={{ marginTop:8, fontWeight:800, fontSize:15, color:"#1a1a1a" }}>{title}</div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  HOME SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function HomeScreen({ onNav }) {
  const tools = [
    {
      id:"inspection",
      emoji:"🍗",
      title:"Restaurant Inspection",
      desc:"Full 628-pt inspection across 12 categories",
      color:"#C8102E",
      accent:"#fff0f2"
    },
    {
      id:"lp",
      emoji:"🔒",
      title:"Loss Prevention Audit",
      desc:"Loss prevention checklist — 100-pt scored audit",
      color:"#1565c0",
      accent:"#e8f0fe"
    },
    {
      id:"rm",
      emoji:"🔧",
      title:"R&M Request",
      desc:"Repair & Maintenance service request",
      color:"#2e7d32",
      accent:"#e8f5e9"
    },
    {
      id:"dashboard",
      emoji:"📊",
      title:"Dashboard",
      desc:"Score trends and KPIs across all locations",
      color:"#6a1b9a",
      accent:"#f3e5f5"
    },
  ];

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#f2f2f2", minHeight:"100vh" }}>
      <div style={{
        background:"white", borderBottom:`3px solid ${R}`,
        padding:"20px 20px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontSize:32, fontWeight:900, color:R, letterSpacing:-1.5, lineHeight:1 }}>Guthrie's</div>
        <div style={{ fontSize:9, letterSpacing:3, color:"#aaa", textTransform:"uppercase", marginBottom:6 }}>
          Golden Fried Chicken Fingers
        </div>
        <div style={{ fontSize:18, fontWeight:800, color:"#1a1a1a" }}>Operations Hub</div>
        <div style={{ fontSize:12, color:"#888", marginTop:2 }}>Select a form to begin</div>
      </div>

      <div style={{ padding:16, maxWidth:700, margin:"0 auto" }}>
        {tools.map(t => (
          <button key={t.id} onClick={() => onNav(t.id)}
            style={{
              width:"100%", display:"flex", alignItems:"center", gap:16,
              background:"white", border:"none", borderRadius:12,
              padding:"18px 20px", marginBottom:12, cursor:"pointer",
              boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
              borderLeft:`5px solid ${t.color}`, textAlign:"left",
              transition:"transform 0.1s, box-shadow 0.1s"
            }}
          >
            <div style={{
              width:52, height:52, borderRadius:14, background:t.accent,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:26, flexShrink:0
            }}>
              {t.emoji}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:16, color:"#1a1a1a" }}>{t.title}</div>
              <div style={{ fontSize:12, color:"#888", marginTop:3 }}>{t.desc}</div>
            </div>
            <div style={{ fontSize:22, color:"#ccc" }}>›</div>
          </button>
        ))}

        <div style={{
          marginTop:8, padding:"14px 16px", background:"white",
          borderRadius:10, border:"1px dashed #ddd", textAlign:"center"
        }}>
          <div style={{ fontSize:12, color:"#aaa" }}>
            💡 All forms generate a downloadable PDF and can send data to Google Sheets
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════
function ItemRow({ item, ans, onAnswer, onNotes, onPhoto, showPts = true }) {
  const fileRef = useRef();
  const bg = ans.answer === "yes" ? YES_BG : ans.answer === "no" ? NO_BG : "white";
  const bd = ans.answer === "yes" ? YES_BD : ans.answer === "no" ? NO_BD : "#e8e8e8";

  return (
    <div style={{
      background:bg, border:`1px solid ${bd}`, borderRadius:8,
      padding:"12px 14px", marginBottom:8, transition:"background 0.2s, border-color 0.2s"
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
        <div style={{ flex:1 }}>
          {showPts && item.pts && (
            <span style={{ fontSize:11, color:"#888", fontWeight:700, marginRight:6 }}>
              {item.pts} {item.pts === 1 ? "pt" : "pts"}
            </span>
          )}
          <span style={{ fontSize:14, color:"#222", lineHeight:1.5 }}>{item.text}</span>
        </div>
        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
          {["yes","no"].map(opt => (
            <button key={opt} onClick={() => onAnswer(ans.answer === opt ? null : opt)}
              style={{
                width:44, height:36, border:"2px solid",
                borderColor: ans.answer===opt ? (opt==="yes"?"#2e7d32":"#c62828") : "#ddd",
                borderRadius:6, fontWeight:800, fontSize:12, cursor:"pointer",
                background: ans.answer===opt ? (opt==="yes"?"#2e7d32":"#c62828") : "white",
                color: ans.answer===opt ? "white" : "#aaa", transition:"all 0.15s"
              }}
            >
              {opt==="yes"?"YES":"NO"}
            </button>
          ))}
        </div>
      </div>

      <input type="text" value={ans.notes} onChange={e => onNotes(e.target.value)}
        placeholder="Notes…"
        style={{ marginTop:10, ...inputStyle, background:"rgba(255,255,255,0.7)" }}
      />

      <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={() => fileRef.current.click()}
          style={{
            fontSize:11, padding:"5px 12px", border:"1px solid #ddd",
            borderRadius:6, background:"white", cursor:"pointer", color:"#555",
            display:"flex", alignItems:"center", gap:5
          }}
        >
          📷 {ans.photo ? "Replace Photo" : "Add Photo"}
        </button>
        {ans.photo && (
          <>
            <img src={ans.photo} alt="inspection"
              style={{ height:40, width:56, objectFit:"cover", borderRadius:5, border:"1px solid #ddd" }} />
            <button onClick={() => onPhoto(null)}
              style={{ fontSize:11, color:R, background:"none", border:"none", cursor:"pointer" }}>✕</button>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        style={{ display:"none" }}
        onChange={e => {
          const file = e.target.files[0]; if (!file) return;
          const reader = new FileReader();
          reader.onload = ev => onPhoto(ev.target.result);
          reader.readAsDataURL(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function SubmitButton({ onSubmit, submitting, submitStatus, color }) {
  return (
    <div style={{ marginTop:10 }}>
      <button onClick={onSubmit} disabled={submitting}
        style={{
          width:"100%", padding:"13px", background:color, color:"white",
          border:"none", borderRadius:8, fontWeight:800, fontSize:15,
          cursor: submitting ? "default" : "pointer",
          boxShadow:`0 3px 10px ${color}55`, opacity: submitting ? 0.7 : 1
        }}
      >
        {submitting ? "Sending…" : "📤 Submit to Google Sheets"}
      </button>
      {submitStatus === "success" && (
        <div style={{ marginTop:8, padding:"10px", background:YES_BG, borderRadius:7, color:"#2e7d32", fontSize:13, fontWeight:700, textAlign:"center" }}>
          ✅ Submitted successfully!
        </div>
      )}
      {submitStatus === "error" && (
        <div style={{ marginTop:8, padding:"10px", background:NO_BG, borderRadius:7, color:R, fontSize:13, fontWeight:700, textAlign:"center" }}>
          ❌ Submission failed. Please try again.
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  FORM 1 — RESTAURANT INSPECTION
// ══════════════════════════════════════════════════════════════════════════════
const INSPECT_SECTIONS = [
  {
    id:"exterior", title:"Exterior", possible:8, emoji:"🏢",
    items:[
      { id:"e1", pts:1, text:"Parking lot free of debris, major pot holes, and parking spot/drive thru lines painted and in good condition" },
      { id:"e2", pts:1, text:"Landscape maintained. Flower beds have good curb appeal and are free of debris" },
      { id:"e3", pts:1, text:"Walls in good condition. Paint not peeling, and walls do not have build up. No holes present" },
      { id:"e4", pts:1, text:"Parking lot lights working and in good condition. Parking lot well lit" },
      { id:"e5", pts:1, text:"Exterior signage clean, lit, and in good working condition" },
      { id:"e6", pts:1, text:"Dumpster area clean, lids closed, and area free of excess debris" },
      { id:"e7", pts:1, text:"Windows and doors clean, free of damage and in good condition" },
      { id:"e8", pts:1, text:"Entrance area clean, door mats in good condition, and free of debris" },
    ]
  },
  {
    id:"dining", title:"Dining Hall / Restrooms", possible:49, emoji:"🪑",
    items:[
      { id:"d1",  pts:3, text:"Dining room clean — all tables and chairs wiped down and in good condition" },
      { id:"d2",  pts:3, text:"Floors clean, free of debris and in good condition" },
      { id:"d3",  pts:3, text:"Walls and ceilings clean, free of damage and in good condition" },
      { id:"d4",  pts:3, text:"Light fixtures working and clean. No burned out bulbs" },
      { id:"d5",  pts:3, text:"Restrooms stocked with soap, paper towels, and toilet paper" },
      { id:"d6",  pts:3, text:"Restrooms clean, odor free, and in good condition" },
      { id:"d7",  pts:3, text:"Hand washing sinks accessible and properly stocked" },
      { id:"d8",  pts:3, text:"Trash receptacles clean, lined, and not overflowing" },
      { id:"d9",  pts:3, text:"High chairs and booster seats clean and in good condition" },
      { id:"d10", pts:3, text:"Music at appropriate level. Proper temperature maintained in dining room" },
      { id:"d11", pts:4, text:"Condiment area clean, stocked, and properly organized" },
      { id:"d12", pts:4, text:"Drink station clean and stocked. Ice machine clean and maintained" },
      { id:"d13", pts:4, text:"Air vents and exhaust fans clean and free of dust buildup" },
      { id:"d14", pts:4, text:"Drive-thru window area clean, organized, and properly stocked" },
      { id:"d15", pts:3, text:"Kick plates on restroom doors cleaned" },
    ]
  },
  {
    id:"cashier", title:"Cashier Alley", possible:32, emoji:"🧾",
    items:[
      { id:"ca1", pts:4, text:"Counter area clean and organized. No clutter behind counter" },
      { id:"ca2", pts:4, text:"Register area clean. Cash handling procedures being followed" },
      { id:"ca3", pts:4, text:"Menu boards clean, lit, and correctly displaying current menu and pricing" },
      { id:"ca4", pts:4, text:"Cashier properly uniformed and following dress code" },
      { id:"ca5", pts:4, text:"Order accuracy verified. Correct change and receipts issued" },
      { id:"ca6", pts:4, text:"Upselling and suggestive selling being practiced" },
      { id:"ca7", pts:4, text:"Proper greeting and thank you given to every guest" },
      { id:"ca8", pts:4, text:"Wait times within acceptable range. No excessive lines building" },
    ]
  },
  {
    id:"kitchen", title:"Kitchen", possible:46, emoji:"🍳",
    items:[
      { id:"k1",  pts:4, text:"Kitchen clean and organized. All surfaces wiped down" },
      { id:"k2",  pts:4, text:"Floors clean, dry, and free of debris and grease buildup" },
      { id:"k3",  pts:4, text:"Walls and hood system clean and free of grease buildup" },
      { id:"k4",  pts:4, text:"Equipment clean, in good working condition, and properly maintained" },
      { id:"k5",  pts:4, text:"Prep tables and cutting boards clean, sanitized, and in good condition" },
      { id:"k6",  pts:4, text:"Hand washing station accessible, stocked, and being used properly" },
      { id:"k7",  pts:4, text:"Proper glove usage and hand washing procedures being followed" },
      { id:"k8",  pts:4, text:"No cross contamination. Raw and cooked products properly separated" },
      { id:"k9",  pts:4, text:"Temperature logs current and properly documented" },
      { id:"k10", pts:4, text:"All food products properly labeled and dated" },
      { id:"k11", pts:3, text:"Trash cans clean, lined, and not overflowing" },
      { id:"k12", pts:3, text:"Pest control — no signs of pest activity" },
    ]
  },
  {
    id:"dryStorage", title:"Dry Storage / WIC / WIF", possible:60, emoji:"🧊",
    items:[
      { id:"ds1", pts:5, text:"Dry storage area clean, organized, and product stored 6 inches off floor" },
      { id:"ds2", pts:5, text:"FIFO (First In First Out) being practiced in all storage areas" },
      { id:"ds3", pts:5, text:"Walk-In Cooler clean, organized, and maintaining proper temperature (36–38°F)" },
      { id:"ds4", pts:5, text:"Walk-In Freezer clean, organized, and maintaining proper temperature (0°F or below)" },
      { id:"ds5", pts:5, text:"All products in WIC/WIF properly labeled, dated, and covered" },
      { id:"ds6", pts:5, text:"No product stored on floor in WIC/WIF" },
      { id:"ds7", pts:5, text:"Shelving clean and in good condition in all storage areas" },
      { id:"ds8", pts:5, text:"Door gaskets clean and sealing properly. Doors closing completely" },
      { id:"ds9", pts:5, text:"No expired product. Product rotation is up to date" },
      { id:"ds10",pts:5, text:"Chemicals stored separately from all food products" },
      { id:"ds11", pts:5, text:"Thermometers present and visible in all walk-ins" },
      { id:"ds12", pts:5, text:"Ice machine cleaned and inside free of mold" },
    ]
  },
  {
    id:"prep", title:"Prep", possible:76, emoji:"🥗",
    items:[
      { id:"p1",  pts:5, text:"Prep area clean and organized prior to and after all prep" },
      { id:"p2",  pts:5, text:"Proper hand washing before handling food and between tasks" },
      { id:"p3",  pts:5, text:"Product thawed using proper methods (36–38°F refrigerator method)" },
      { id:"p4",  pts:5, text:"Product marinated at proper temperature (36–38°F) and for proper time" },
      { id:"p5",  pts:5, text:"Chicken properly prepped according to recipe and brand standard" },
      { id:"p6",  pts:5, text:"Prep yields within acceptable range" },
      { id:"p7",  pts:5, text:"Breading station clean, properly set up, and flour changed on schedule" },
      { id:"p8",  pts:5, text:"Proper breading technique being followed. Product properly shaken" },
      { id:"p9",  pts:4, text:"Prep cooler maintaining proper temperature and product properly stored" },
      { id:"p10", pts:4, text:"All prep containers labeled with date, time, and use-by date" },
      { id:"p11", pts:4, text:"Batch cooking log current and being followed" },
      { id:"p12", pts:4, text:"Slaw prepped fresh daily within 24 hours. Proper texture (long stringy, creamy), correct color and portion" },
      { id:"p13", pts:4, text:"Tea fresh, properly prepared per recipe. Correct sweetness levels, properly labeled sweet/unsweet" },
      { id:"p14", pts:4, text:"Using scale for French Fries — fry portions weighed using a scale to ensure consistency" },
      { id:"p15", pts:4, text:"Production board posted, up to date, and being followed for current shift" },
      { id:"p16", pts:4, text:"Par levels: prep list filled out for current shift" },
      { id:"p17", pts:4, text:"Cleaning checklists posted and being followed" },
    ]
  },
  {
    id:"cooking", title:"Cooking", possible:200, emoji:"🔥",
    items:[
      { id:"co1",  pts:15, text:"Oil quality meets standard. Oil properly filtered and changed on schedule" },
      { id:"co2",  pts:15, text:"Fry baskets clean and in good condition. Proper basket usage followed" },
      { id:"co3",  pts:15, text:"Fryer temperatures calibrated and at correct temperature per product" },
      { id:"co4",  pts:15, text:"Cook times followed per recipe. Timers in use for all products" },
      { id:"co5",  pts:15, text:"Chicken fingers cooked to proper internal temperature (165°F minimum)" },
      { id:"co6",  pts:15, text:"Chicken not overcooked or undercooked. Proper color and texture" },
      { id:"co7",  pts:15, text:"Products not held beyond hold time. Hold times properly documented" },
      { id:"co8",  pts:15, text:"Hot holding equipment at proper temperature (140°F or above)" },
      { id:"co9",  pts:15, text:"Fry cook properly uniformed and following all safety procedures" },
      { id:"co10", pts:15, text:"Waste tracking log current and accurate" },
      { id:"co11", pts:10, text:"Product not cross contaminated in fryer. Allergen procedures followed" },
      { id:"co12", pts:10, text:"Fry station organized, clean, and free of grease buildup during service" },
      { id:"co13", pts:10, text:"Draining and seasoning procedures followed per recipe standard" },
      { id:"co14", pts:10, text:"Faucets pumped, not poured. Sauce properly applied per standard" },
      { id:"co15", pts:10, text:"Walls, racks, drip pans, and floors in good repair and clean" },
    ]
  },
  {
    id:"chemicals", title:"Chemicals / Dish Area", possible:70, emoji:"🧼",
    items:[
      { id:"ch1",  pts:5, text:"All chemicals properly labeled with concentration level identified" },
      { id:"ch2",  pts:5, text:"Sanitizer buckets properly mixed, tested, and changed every 2 hours" },
      { id:"ch3",  pts:5, text:"3-compartment sink properly set up: wash, rinse, sanitize" },
      { id:"ch4",  pts:5, text:"Dishes properly washed, rinsed, and sanitized. Air dried — not towel dried" },
      { id:"ch5",  pts:5, text:"Chemical storage organized, labeled, and stored away from food products" },
      { id:"ch6",  pts:5, text:"SDS (Safety Data Sheets) accessible and current for all chemicals" },
      { id:"ch7",  pts:5, text:"Dish machine clean and functioning properly. Temperature log current" },
      { id:"ch8",  pts:5, text:"Dish area clean and organized. Drains clean and flowing properly" },
      { id:"ch9",  pts:5, text:"Clean dishes stored in proper location, covered, and protected" },
      { id:"ch10", pts:5, text:"Mops, brooms, and cleaning supplies clean and properly stored" },
      { id:"ch11", pts:5, text:"Trash cans in dish area clean, free of odor, and properly lined" },
      { id:"ch12", pts:5, text:"Grease trap maintained and documented" },
      { id:"ch13", pts:5, text:"Test strips present and used when checking sanitizer PPM levels" },
      { id:"ch14", pts:5, text:"Sanitizer buckets present: 1 in FOH and 1 in kitchen" },
    ]
  },
  {
    id:"service", title:"Service", possible:9, emoji:"⭐",
    items:[
      { id:"sv1", pts:3, text:"Speed of service within target window. Drive-thru times being tracked" },
      { id:"sv2", pts:3, text:"Guest complaints handled promptly and professionally" },
      { id:"sv3", pts:3, text:"Order accuracy rate acceptable. Bag checks being performed" },
    ]
  },
  {
    id:"employee", title:"Employee", possible:27, emoji:"👔",
    items:[
      { id:"em1", pts:3, text:"All employees in proper uniform. Shirts clean and tucked in" },
      { id:"em2", pts:3, text:"Hair properly restrained. Hats or hair nets worn by all kitchen staff" },
      { id:"em3", pts:3, text:"No jewelry (except plain band rings). No nail polish in kitchen" },
      { id:"em4", pts:3, text:"No cell phone use in kitchen or at register during service" },
      { id:"em5", pts:3, text:"No eating or drinking in unapproved areas" },
      { id:"em6", pts:3, text:"Employees maintaining positive attitude and working efficiently" },
      { id:"em7", pts:3, text:"Proper hand washing observed throughout the shift" },
      { id:"em8", pts:3, text:"Sick employee policy followed. No visibly ill employees working" },
      { id:"em9", pts:3, text:"Employees following all safety procedures. No horseplay" },
    ]
  },
  {
    id:"foodQuality", title:"Food Quality", possible:60, emoji:"🍗",
    items:[
      { id:"fq1",  pts:5, text:"Chicken fingers — proper size, color, texture. Not overcooked or greasy" },
      { id:"fq2",  pts:5, text:"Slaw — fresh within 24 hours, proper texture (long stringy, creamy), correct color and portion" },
      { id:"fq3",  pts:5, text:"Tea — fresh, properly prepared per recipe, correct sweetness, properly labeled sweet/unsweet" },
      { id:"fq4",  pts:5, text:"Using scale for French Fries — fry portions weighed to ensure consistency" },
      { id:"fq5",  pts:5, text:"Production board — posted, up to date, and being followed for current shift" },
      { id:"fq6",  pts:5, text:"Dipping sauces at correct temperature and within expiration date" },
      { id:"fq7",  pts:5, text:"Bread fresh, proper texture and color. Correctly toasted per standard" },
      { id:"fq8",  pts:5, text:"French fries properly portioned, salted, and served at correct temperature" },
      { id:"fq9",  pts:5, text:"All condiments fresh, properly labeled, and within use-by date" },
      { id:"fq10", pts:5, text:"Plate/box presentation meets brand standard. Proper packaging used" },
      { id:"fq11", pts:5, text:"Food temperatures verified before service. Chicken 165°F minimum" },
      { id:"fq12", pts:5, text:"Overall food quality represents brand standard. Guest-ready product" },
    ]
  },
  {
    id:"misc", title:"Misc", possible:22, emoji:"📋",
    items:[
      { id:"m1", pts:3, text:"Inspection binder current, organized, and accessible" },
      { id:"m2", pts:3, text:"Food safety certifications current for all managers" },
      { id:"m3", pts:3, text:"Pest control service current and documented" },
      { id:"m4", pts:3, text:"Fire suppression system and fire extinguishers current and tagged" },
      { id:"m5", pts:3, text:"Operating permits and health certificate posted and current" },
      { id:"m6", pts:3, text:"Equipment maintenance log current and documented" },
      { id:"m7", pts:2, text:"First aid kit stocked and accessible" },
      { id:"m8", pts:2, text:"Ansul system clean. Filters replaced on schedule" },
    ]
  },
];
const TOTAL_POSSIBLE = INSPECT_SECTIONS.reduce((s,sec) => s + sec.possible, 0);

function inspectInitAnswers() {
  const a = {};
  INSPECT_SECTIONS.forEach(s => s.items.forEach(item => { a[item.id] = { answer:null, notes:"", photo:null }; }));
  return a;
}

function generateInspectPDF(info, answers) {
  const earned = INSPECT_SECTIONS.reduce((sum,s) =>
    s.items.reduce((is,item) => is + (answers[item.id]?.answer==="yes" ? item.pts : 0), sum), 0);
  const pct = ((earned/TOTAL_POSSIBLE)*100).toFixed(1);
  const rows = INSPECT_SECTIONS.map(sec => {
    const secE = sec.items.reduce((s,item) => s + (answers[item.id]?.answer==="yes" ? item.pts : 0), 0);
    const itemRows = sec.items.map(item => {
      const ans = answers[item.id];
      const bg = ans?.answer==="yes" ? "#e8f5e9" : ans?.answer==="no" ? "#ffebee" : "white";
      const photoHtml = ans?.photo ? `<img src="${ans.photo}" style="max-width:80px;max-height:60px;border-radius:4px;" />` : "";
      return `<tr style="background:${bg};border-bottom:1px solid #eee;">
        <td style="padding:6px 8px;font-size:11px;">${item.text}</td>
        <td style="padding:6px;text-align:center;font-size:11px;font-weight:700;">${item.pts}</td>
        <td style="padding:6px;text-align:center;font-size:11px;font-weight:700;">${ans?.answer ? ans.answer.toUpperCase() : "—"}</td>
        <td style="padding:6px;font-size:10px;color:#555;">${ans?.notes||""}</td>
        <td style="padding:6px;">${photoHtml}</td>
      </tr>`;
    }).join("");
    return `<tr><td colspan="5" style="background:#C8102E;color:white;padding:8px 10px;font-weight:700;font-size:13px;">${sec.emoji} ${sec.title} — ${secE}/${sec.possible} pts</td></tr>
      <tr style="background:#f9f9f9;font-size:10px;font-weight:700;color:#777;">
        <td style="padding:4px 8px;">ITEM</td><td style="padding:4px;text-align:center;">PTS</td>
        <td style="padding:4px;text-align:center;">Y/N</td><td style="padding:4px;">NOTES</td><td style="padding:4px;">PHOTO</td>
      </tr>${itemRows}`;
  }).join("");
  const scoreRows = INSPECT_SECTIONS.map(sec => {
    const e = sec.items.reduce((s,item) => s+(answers[item.id]?.answer==="yes"?item.pts:0),0);
    return `<tr style="border-bottom:1px solid #eee;"><td style="padding:6px 10px;font-size:12px;">${sec.title}</td>
      <td style="padding:6px;text-align:center;font-weight:700;color:#C8102E;">${e}</td>
      <td style="padding:6px;text-align:center;color:#666;">${sec.possible}</td></tr>`;
  }).join("");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Guthrie's Inspection</title>
  <style>body{font-family:'Segoe UI',sans-serif;margin:0;padding:20px;}table{width:100%;border-collapse:collapse;}</style>
  </head><body>
  <div style="text-align:center;border-bottom:3px solid #C8102E;padding-bottom:16px;margin-bottom:20px;">
    <div style="font-size:28px;font-weight:900;color:#C8102E;">Guthrie's</div>
    <div style="font-size:9px;letter-spacing:3px;color:#888;text-transform:uppercase;">Golden Fried Chicken Fingers</div>
    <div style="font-size:20px;font-weight:700;margin-top:4px;">Restaurant Inspection Report</div>
  </div>
  <table style="margin-bottom:16px;font-size:12px;"><tr>
    <td style="padding:4px 10px;"><b>Inspector:</b> ${info.inspectorName}</td>
    <td style="padding:4px 10px;"><b>Location:</b> ${info.location}</td>
    <td style="padding:4px 10px;"><b>Date:</b> ${info.date}</td>
  </tr><tr>
    <td style="padding:4px 10px;"><b>Start:</b> ${info.startTime}</td>
    <td style="padding:4px 10px;"><b>End:</b> ${info.endTime}</td>
    <td style="padding:4px 10px;"><b>Person in Charge:</b> ${info.personInCharge}</td>
  </tr><tr>
    <td style="padding:4px 10px;"><b>Store Manager:</b> ${info.storeManager}</td>
    <td style="padding:4px 10px;"><b>Health Inspection:</b> ${info.currentHealthInspection}</td>
    <td style="padding:4px 10px;"><b>Previous Score:</b> ${info.previousInspectionScore}</td>
  </tr></table>
  <div style="text-align:center;background:#C8102E;color:white;padding:12px;border-radius:6px;margin-bottom:20px;font-size:22px;font-weight:900;">
    TOTAL SCORE: ${earned} / ${TOTAL_POSSIBLE} — ${pct}%
  </div>
  <table style="margin-bottom:24px;">${rows}</table>
  <div style="font-size:16px;font-weight:700;margin-bottom:8px;color:#C8102E;">Score Card</div>
  <table style="max-width:400px;">
    <tr style="background:#C8102E;color:white;font-size:11px;font-weight:700;">
      <td style="padding:6px 10px;">CATEGORY</td><td style="padding:6px;text-align:center;">EARNED</td><td style="padding:6px;text-align:center;">POSSIBLE</td>
    </tr>${scoreRows}
    <tr style="background:#333;color:white;font-weight:700;">
      <td style="padding:8px 10px;">TOTAL</td>
      <td style="padding:8px;text-align:center;color:#ffcc00;">${earned}</td>
      <td style="padding:8px;text-align:center;">${TOTAL_POSSIBLE}</td>
    </tr>
  </table></body></html>`;
}

function InspectionSectionCard({ section, answers, setAnswer, collapsed, onToggle }) {
  const earned = section.items.reduce((s,item) => s+(answers[item.id]?.answer==="yes"?item.pts:0),0);
  const answered = section.items.filter(i=>answers[i.id]?.answer).length;
  const pct = earned/section.possible;
  return (
    <div style={{ margin:"0 12px 10px", borderRadius:10, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
      <button onClick={onToggle} style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"14px 16px", background:"white", border:"none",
        borderLeft:`4px solid ${R}`, cursor:"pointer", textAlign:"left"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:20 }}>{section.emoji}</span>
          <div>
            <div style={{ fontWeight:800, fontSize:15, color:"#1a1a1a" }}>{section.title}</div>
            <div style={{ fontSize:11, color:"#888", marginTop:1 }}>{answered}/{section.items.length} answered</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:18, fontWeight:900, color: pct>=0.85?"#2e7d32":pct>=0.60?"#e65100":answered>0?R:"#aaa" }}>
              {earned}
            </div>
            <div style={{ fontSize:10, color:"#bbb" }}>/ {section.possible}</div>
          </div>
          <span style={{ color:"#aaa", fontSize:18 }}>{collapsed?"▶":"▼"}</span>
        </div>
      </button>
      {!collapsed && (
        <div style={{ background:"#fafafa", padding:"10px 12px 12px" }}>
          {section.items.map(item => (
            <ItemRow key={item.id} item={item} ans={answers[item.id]}
              onAnswer={v => setAnswer(item.id,"answer",v)}
              onNotes={v  => setAnswer(item.id,"notes",v)}
              onPhoto={v  => setAnswer(item.id,"photo",v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RestaurantInspection({ onBack }) {
  const today = new Date().toISOString().split("T")[0];
  const [info, setInfo] = useState({
    inspectorName:"", location:"", date:today, startTime:"", endTime:"",
    personInCharge:"", storeManager:"", currentHealthInspection:"", previousInspectionScore:""
  });
  const [answers, setAnswersState] = useState(inspectInitAnswers);
  const [collapsed, setCollapsed] = useState(Object.fromEntries(INSPECT_SECTIONS.map(s=>[s.id,true])));
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const totalEarned = INSPECT_SECTIONS.reduce((sum,s) =>
    s.items.reduce((is,item) => is+(answers[item.id]?.answer==="yes"?item.pts:0),sum),0);
  const pct = (totalEarned/TOTAL_POSSIBLE)*100;
  const scoreColor = pct>=85?"#2e7d32":pct>=70?"#e65100":R;

  const setAnswer = (itemId,field,value) =>
    setAnswersState(prev => ({ ...prev, [itemId]:{ ...prev[itemId],[field]:value } }));

  const handlePrint = () => {
    const html = generateInspectPDF(info, answers);
    const win = window.open("","_blank"); win.document.write(html); win.document.close();
    win.onload = () => win.print();
  };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitStatus(null);
    try {
      const payload = { formType:"restaurant_inspection", ...info, totalEarned, totalPossible:TOTAL_POSSIBLE,
        percentage:pct.toFixed(1), timestamp:new Date().toISOString(),
        sections: INSPECT_SECTIONS.map(s=>({ title:s.title,
          earned:s.items.reduce((sum,item)=>sum+(answers[item.id]?.answer==="yes"?item.pts:0),0),
          possible:s.possible, items:s.items.map(item=>({ text:item.text, pts:item.pts,
            answer:answers[item.id]?.answer, notes:answers[item.id]?.notes, photo:answers[item.id]?.photo }))
        }))};
      const res = await fetch(WEBHOOK_URL,{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      setSubmitStatus(res.ok?"success":"error");
    } catch { setSubmitStatus("error"); }
    setSubmitting(false);
  };

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#f2f2f2", minHeight:"100vh", paddingBottom:40 }}>
      <Header title="Restaurant Inspection" subtitle="Operations Hub"
        onBack={onBack}
        right={
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:28, fontWeight:900, color:scoreColor, lineHeight:1 }}>{totalEarned}</div>
            <div style={{ fontSize:10, color:"#bbb" }}>of {TOTAL_POSSIBLE}</div>
          </div>
        }
      />

      {/* Progress bar */}
      <div style={{ background:"white", padding:"0 16px 10px", borderBottom:"1px solid #eee" }}>
        <div style={{ background:"#eee", borderRadius:4, height:5, marginTop:8 }}>
          <div style={{ height:5, borderRadius:4, background:scoreColor, width:`${pct.toFixed(1)}%`, transition:"width 0.3s" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontSize:10, color:"#aaa" }}>Score Progress</span>
          <span style={{ fontSize:10, fontWeight:700, color:scoreColor }}>{pct.toFixed(1)}%</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ margin:"12px 12px 10px", background:"white", borderRadius:10, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight:800, fontSize:13, color:R, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>Inspection Details</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelStyle}>Inspector Name *</label>
            <input style={inputStyle} placeholder="Enter your name" value={info.inspectorName} onChange={e=>setInfo(p=>({...p,inspectorName:e.target.value}))} />
          </div>
          <div><label style={labelStyle}>Location *</label><select style={inputStyle} value={info.location} onChange={e=>setInfo(p=>({...p,location:e.target.value}))}><option value="">Select location…</option>{LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
          <div><label style={labelStyle}>Date *</label><input type="date" style={inputStyle} value={info.date} onChange={e=>setInfo(p=>({...p,date:e.target.value}))} /></div>
          <div><label style={labelStyle}>Start Time *</label><input type="time" style={inputStyle} value={info.startTime} onChange={e=>setInfo(p=>({...p,startTime:e.target.value}))} /></div>
          <div><label style={labelStyle}>End Time *</label><input type="time" style={inputStyle} value={info.endTime} onChange={e=>setInfo(p=>({...p,endTime:e.target.value}))} /></div>
          <div><label style={labelStyle}>Person in Charge *</label><input style={inputStyle} placeholder="Name" value={info.personInCharge} onChange={e=>setInfo(p=>({...p,personInCharge:e.target.value}))} /></div>
          <div><label style={labelStyle}>Store Manager *</label><input style={inputStyle} placeholder="Name" value={info.storeManager} onChange={e=>setInfo(p=>({...p,storeManager:e.target.value}))} /></div>
          <div><label style={labelStyle}>Current Health Inspection *</label><input style={inputStyle} placeholder="Score / Grade" value={info.currentHealthInspection} onChange={e=>setInfo(p=>({...p,currentHealthInspection:e.target.value}))} /></div>
          <div><label style={labelStyle}>Previous Inspection Score *</label><input style={inputStyle} placeholder="Score" value={info.previousInspectionScore} onChange={e=>setInfo(p=>({...p,previousInspectionScore:e.target.value}))} /></div>
        </div>
      </div>

      {/* Expand/Collapse */}
      <div style={{ margin:"0 12px 10px", display:"flex", gap:8 }}>
        <button onClick={()=>setCollapsed(Object.fromEntries(INSPECT_SECTIONS.map(s=>[s.id,false])))}
          style={{ flex:1, padding:"8px", border:`1px solid ${R}`, borderRadius:7, background:"white", color:R, fontWeight:700, fontSize:12, cursor:"pointer" }}>Expand All</button>
        <button onClick={()=>setCollapsed(Object.fromEntries(INSPECT_SECTIONS.map(s=>[s.id,true])))}
          style={{ flex:1, padding:"8px", border:"1px solid #ddd", borderRadius:7, background:"white", color:"#666", fontWeight:700, fontSize:12, cursor:"pointer" }}>Collapse All</button>
      </div>

      {INSPECT_SECTIONS.map(section => (
        <InspectionSectionCard key={section.id} section={section} answers={answers} setAnswer={setAnswer}
          collapsed={collapsed[section.id]} onToggle={()=>setCollapsed(p=>({...p,[section.id]:!p[section.id]}))} />
      ))}

      {/* Score Card */}
      <div style={{ margin:"16px 12px", background:"white", borderRadius:10, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ background:R, color:"white", padding:"12px 16px", fontWeight:800, fontSize:15 }}>📊 Score Card</div>
        <div style={{ padding:16 }}>
          <div style={{ display:"flex", justifyContent:"center", gap:16, marginBottom:20, padding:16, background:"#f9f9f9", borderRadius:8 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:36, fontWeight:900, color:scoreColor }}>{totalEarned}</div>
              <div style={{ fontSize:11, color:"#888" }}>of {TOTAL_POSSIBLE} pts</div>
            </div>
            <div style={{ width:1, height:60, background:"#eee" }} />
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:36, fontWeight:900, color:scoreColor }}>{pct.toFixed(1)}%</div>
              <div style={{ fontSize:11, color:"#888" }}>Score</div>
            </div>
          </div>
          {INSPECT_SECTIONS.map(sec => {
            const e = sec.items.reduce((s,item)=>s+(answers[item.id]?.answer==="yes"?item.pts:0),0);
            const sp = e/sec.possible;
            return (
              <div key={sec.id} style={{ display:"flex", alignItems:"center", marginBottom:10, gap:10 }}>
                <div style={{ width:22, textAlign:"center" }}>{sec.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"#333" }}>{sec.title}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:sp>=0.85?"#2e7d32":sp>=0.60?"#e65100":R }}>{e} / {sec.possible}</span>
                  </div>
                  <div style={{ background:"#eee", borderRadius:4, height:6 }}>
                    <div style={{ height:6, borderRadius:4, width:`${(sp*100).toFixed(0)}%`, background:sp>=0.85?"#2e7d32":sp>=0.60?"#e65100":R, transition:"width 0.4s" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ margin:"12px 12px 0", background:"white", borderRadius:10, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight:800, fontSize:13, color:R, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>Export & Submit</div>
        <button onClick={handlePrint}
          style={{ width:"100%", padding:"13px", marginBottom:10, background:R, color:"white", border:"none", borderRadius:8, fontWeight:800, fontSize:15, cursor:"pointer", boxShadow:`0 3px 10px ${R}55` }}>
          📄 Download / Print PDF
        </button>
        <SubmitButton onSubmit={handleSubmit} submitting={submitting} submitStatus={submitStatus} color={R} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  FORM 2 — LP AUDIT
// ══════════════════════════════════════════════════════════════════════════════
const LP_ITEMS = [
  { id:"lp1",  pts:2,  text:"Office neat and clean" },
  { id:"lp2",  pts:12, text:"Verify safe" },
  { id:"lp3",  pts:12, text:"Verify deposit totals if applicable" },
  { id:"lp4",  pts:8,  text:"DSP correction entered weekly" },
  { id:"lp5",  pts:3,  text:"Ezcater orders entered on daily sheet" },
  { id:"lp6",  pts:7,  text:"Using shift log" },
  { id:"lp7",  pts:6,  text:"Invoices filed correctly" },
  { id:"lp8",  pts:12, text:"Using tamper resistant bags for deposit in sequence" },
  { id:"lp9",  pts:10, text:"Time edits daily" },
  { id:"lp10", pts:10, text:"Office/safe locked" },
  { id:"lp11", pts:8,  text:"Review last three minor shifts for breaks" },
  { id:"lp12", pts:4,  text:"Guest complaint log up to date on PC" },
  { id:"lp13", pts:6,  text:"Review minor files in TN locations only" },
];

const BLUE = "#1565c0";
const BLUE_LIGHT = "#e8f0fe";

function lpInitAnswers() {
  const a = {};
  LP_ITEMS.forEach(item => { a[item.id] = { answer:null, notes:"", photo:null }; });
  return a;
}

function generateLpPDF(info, answers) {
  const totalEarned = LP_ITEMS.reduce((sum, item) => sum + (answers[item.id]?.answer === "yes" ? item.pts : 0), 0);
  const pct = ((totalEarned/100)*100).toFixed(1);
  const rows = LP_ITEMS.map(item => {
    const ans = answers[item.id];
    const bg = ans?.answer==="yes"?"#e8f5e9":ans?.answer==="no"?"#ffebee":"white";
    const photoHtml = ans?.photo ? `<img src="${ans.photo}" style="max-width:80px;max-height:60px;border-radius:4px;" />` : "";
    return `<tr style="background:${bg};border-bottom:1px solid #eee;">
      <td style="padding:8px;font-size:12px;">${item.text}</td>
      <td style="padding:8px;text-align:center;font-weight:700;font-size:12px;">${item.pts}</td>
      <td style="padding:8px;text-align:center;font-weight:700;font-size:12px;">${ans?.answer?ans.answer.toUpperCase():"—"}</td>
      <td style="padding:8px;font-size:11px;color:#555;">${ans?.notes||""}</td>
      <td style="padding:8px;">${photoHtml}</td>
    </tr>`;
  }).join("");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Guthrie's Loss Prevention Audit</title>
  <style>body{font-family:'Segoe UI',sans-serif;margin:0;padding:20px;}table{width:100%;border-collapse:collapse;}</style>
  </head><body>
  <div style="text-align:center;border-bottom:3px solid #1565c0;padding-bottom:16px;margin-bottom:20px;">
    <div style="font-size:28px;font-weight:900;color:#C8102E;">Guthrie's</div>
    <div style="font-size:9px;letter-spacing:3px;color:#888;text-transform:uppercase;">Golden Fried Chicken Fingers</div>
    <div style="font-size:20px;font-weight:700;margin-top:4px;color:#1565c0;">Loss Prevention Audit Report</div>
  </div>
  <table style="margin-bottom:16px;font-size:12px;"><tr>
    <td style="padding:4px 10px;"><b>Auditor:</b> ${info.auditorName}</td>
    <td style="padding:4px 10px;"><b>Location:</b> ${info.location}</td>
    <td style="padding:4px 10px;"><b>Date:</b> ${info.date}</td>
  </tr><tr>
    <td style="padding:4px 10px;"><b>Manager on Duty:</b> ${info.managerOnDuty}</td>
    <td style="padding:4px 10px;"><b>Start Time:</b> ${info.startTime}</td>
    <td style="padding:4px 10px;"><b>End Time:</b> ${info.endTime}</td>
  </tr></table>
  <div style="text-align:center;background:#1565c0;color:white;padding:12px;border-radius:6px;margin-bottom:20px;font-size:22px;font-weight:900;">
    SCORE: ${totalEarned} / 100 PTS — ${pct}%
  </div>
  <table>
    <tr style="background:#1565c0;color:white;font-size:11px;font-weight:700;">
      <td style="padding:6px 8px;">AUDIT ITEM</td>
      <td style="padding:6px;text-align:center;">PTS</td>
      <td style="padding:6px;text-align:center;">YES / NO</td>
      <td style="padding:6px;">NOTES</td>
      <td style="padding:6px;">PHOTO</td>
    </tr>
    ${rows}
  </table>
  </body></html>`;
}

function LpAudit({ onBack }) {
  const today = new Date().toISOString().split("T")[0];
  const [info, setInfo] = useState({ auditorName:"", location:"", date:today, managerOnDuty:"", startTime:"", endTime:"" });
  const [answers, setAnswersState] = useState(lpInitAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const totalEarned = LP_ITEMS.reduce((sum, item) => sum + (answers[item.id]?.answer === "yes" ? item.pts : 0), 0);
  const deducted = LP_ITEMS.reduce((sum, item) => sum + (answers[item.id]?.answer === "no" ? item.pts : 0), 0);
  const answeredCount = LP_ITEMS.filter(item => answers[item.id]?.answer).length;
  const remaining = LP_ITEMS.reduce((sum, item) => sum + (!answers[item.id]?.answer ? item.pts : 0), 0);
  const pct = totalEarned;
  const scoreColor = pct >= 85 ? "#2e7d32" : pct >= 60 ? "#e65100" : R;

  const setAnswer = (itemId,field,value) =>
    setAnswersState(prev => ({ ...prev, [itemId]:{ ...prev[itemId],[field]:value } }));

  const handlePrint = () => {
    const html = generateLpPDF(info, answers);
    const win = window.open("","_blank"); win.document.write(html); win.document.close();
    win.onload = () => win.print();
  };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitStatus(null);
    try {
      const payload = { formType:"lp_audit", ...info, totalEarned, totalPossible:100,
        percentage:pct.toFixed(1), timestamp:new Date().toISOString(),
        items: LP_ITEMS.map(item=>({ text:item.text, pts:item.pts, answer:answers[item.id]?.answer, notes:answers[item.id]?.notes, photo:answers[item.id]?.photo }))
      };
      const res = await fetch(WEBHOOK_URL,{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      setSubmitStatus(res.ok?"success":"error");
    } catch { setSubmitStatus("error"); }
    setSubmitting(false);
  };

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#f2f2f2", minHeight:"100vh", paddingBottom:40 }}>
      <Header title="Loss Prevention Audit" subtitle="Operations Hub"
        onBack={onBack}
        right={
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:28, fontWeight:900, color:scoreColor, lineHeight:1 }}>{totalEarned}</div>
            <div style={{ fontSize:10, color:"#bbb" }}>of 100 pts</div>
          </div>
        }
      />

      {/* Progress */}
      <div style={{ background:"white", padding:"0 16px 10px", borderBottom:"1px solid #eee" }}>
        <div style={{ background:"#eee", borderRadius:4, height:5, marginTop:8 }}>
          <div style={{ height:5, borderRadius:4, background:scoreColor, width:`${pct}%`, transition:"width 0.3s" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontSize:10, color:"#aaa" }}>Score Progress</span>
          <span style={{ fontSize:10, fontWeight:700, color:scoreColor }}>{pct}%</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ margin:"12px 12px 10px", background:"white", borderRadius:10, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight:800, fontSize:13, color:BLUE, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>Audit Details</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelStyle}>Auditor Name *</label>
            <input style={inputStyle} placeholder="Enter your name" value={info.auditorName} onChange={e=>setInfo(p=>({...p,auditorName:e.target.value}))} />
          </div>
          <div><label style={labelStyle}>Location *</label><select style={inputStyle} value={info.location} onChange={e=>setInfo(p=>({...p,location:e.target.value}))}><option value="">Select location…</option>{LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
          <div><label style={labelStyle}>Date *</label><input type="date" style={inputStyle} value={info.date} onChange={e=>setInfo(p=>({...p,date:e.target.value}))} /></div>
          <div><label style={labelStyle}>Manager on Duty *</label><input style={inputStyle} placeholder="Name" value={info.managerOnDuty} onChange={e=>setInfo(p=>({...p,managerOnDuty:e.target.value}))} /></div>
          <div><label style={labelStyle}>Start Time</label><input type="time" style={inputStyle} value={info.startTime} onChange={e=>setInfo(p=>({...p,startTime:e.target.value}))} /></div>
          <div><label style={labelStyle}>End Time</label><input type="time" style={inputStyle} value={info.endTime} onChange={e=>setInfo(p=>({...p,endTime:e.target.value}))} /></div>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ margin:"0 12px 10px", background:"white", borderRadius:10, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ background:BLUE, color:"white", padding:"12px 16px", fontWeight:800, fontSize:14, display:"flex", justifyContent:"space-between" }}>
          <span>🔒 Loss Prevention Checklist</span>
          <span style={{ fontSize:12, opacity:0.85 }}>{totalEarned} / 100 pts</span>
        </div>
        <div style={{ padding:"10px 12px 12px", background:"#fafafa" }}>
          {LP_ITEMS.map(item => (
            <ItemRow key={item.id} item={item} ans={answers[item.id]}
              onAnswer={v => setAnswer(item.id,"answer",v)}
              onNotes={v  => setAnswer(item.id,"notes",v)}
              onPhoto={v  => setAnswer(item.id,"photo",v)}
              showPts={true}
            />
          ))}
        </div>
      </div>

      {/* Summary */}
      {answeredCount > 0 && (
        <div style={{ margin:"0 12px 12px", background:"white", borderRadius:10, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ fontWeight:800, fontSize:13, color:BLUE, marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>Summary</div>
          <div style={{ display:"flex", gap:12 }}>
            {[
              { label:"Score", val:totalEarned, color:"#2e7d32", bg:YES_BG },
              { label:"Deducted", val:deducted, color:R, bg:NO_BG },
              { label:"Remaining", val:remaining, color:"#888", bg:"#f5f5f5" },
            ].map(c => (
              <div key={c.label} style={{ flex:1, background:c.bg, borderRadius:8, padding:"12px 8px", textAlign:"center" }}>
                <div style={{ fontSize:28, fontWeight:900, color:c.color }}>{c.val}</div>
                <div style={{ fontSize:11, color:"#666", marginTop:2 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ margin:"0 12px", background:"white", borderRadius:10, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight:800, fontSize:13, color:BLUE, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>Export & Submit</div>
        <button onClick={handlePrint}
          style={{ width:"100%", padding:"13px", marginBottom:10, background:BLUE, color:"white", border:"none", borderRadius:8, fontWeight:800, fontSize:15, cursor:"pointer", boxShadow:`0 3px 10px ${BLUE}55` }}>
          📄 Download / Print PDF
        </button>
        <SubmitButton onSubmit={handleSubmit} submitting={submitting} submitStatus={submitStatus} color={BLUE} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  FORM 3 — R&M REQUEST
// ══════════════════════════════════════════════════════════════════════════════
const GREEN = "#2e7d32";
const PRIORITIES = [
  { val:"low",       label:"Low",       color:"#1565c0", desc:"No immediate impact on operations" },
  { val:"medium",    label:"Medium",    color:"#e65100", desc:"Minor impact, needs attention soon" },
  { val:"high",      label:"High",      color:"#c62828", desc:"Significant impact on operations" },
  { val:"emergency", label:"Emergency", color:"#6a1b9a", desc:"Immediate safety or operational risk" },
];

function generateRmPDF(form) {
  const pri = PRIORITIES.find(p=>p.val===form.priority);
  const photoHtml = form.photo ? `<img src="${form.photo}" style="max-width:300px;max-height:220px;border-radius:6px;border:1px solid #ddd;margin-top:10px;" />` : "";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>R&M Request</title>
  <style>body{font-family:'Segoe UI',sans-serif;margin:0;padding:20px;}
  .field{margin-bottom:16px;} .label{font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
  .value{font-size:14px;color:#222;padding:8px 12px;background:#f9f9f9;border-radius:6px;border-left:3px solid #2e7d32;}
  </style></head><body>
  <div style="text-align:center;border-bottom:3px solid #2e7d32;padding-bottom:16px;margin-bottom:24px;">
    <div style="font-size:28px;font-weight:900;color:#C8102E;">Guthrie's</div>
    <div style="font-size:9px;letter-spacing:3px;color:#888;text-transform:uppercase;">Golden Fried Chicken Fingers</div>
    <div style="font-size:20px;font-weight:700;margin-top:4px;color:#2e7d32;">R&M Service Request</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
    <div class="field"><div class="label">Location</div><div class="value">${form.location||"—"}</div></div>
    <div class="field"><div class="label">Date</div><div class="value">${form.date||"—"}</div></div>
    <div class="field"><div class="label">Work Order #</div><div class="value">${form.woNumber||"—"}</div></div>
    <div class="field"><div class="label">Submitted By</div><div class="value">${form.submittedBy||"—"}</div></div>
  </div>
  <div class="field"><div class="label">Priority</div>
    <div style="display:inline-block;padding:6px 16px;background:${pri?.color||"#333"};color:white;border-radius:20px;font-weight:800;font-size:13px;">${pri?.label||form.priority||"—"}</div>
  </div>
  <div class="field" style="margin-top:16px;"><div class="label">Issue to Resolve</div>
    <div style="font-size:14px;color:#222;padding:14px;background:#f9f9f9;border-radius:8px;border-left:3px solid #2e7d32;line-height:1.7;white-space:pre-wrap;">${form.issue||"—"}</div>
  </div>
  ${form.photo ? `<div class="field"><div class="label">Photo</div>${photoHtml}</div>` : ""}
  <div style="margin-top:24px;font-size:10px;color:#aaa;text-align:center;">Submitted: ${new Date().toLocaleString()}</div>
  </body></html>`;
}

const generateWO = () => `WO-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;

function RmRequest({ onBack }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ submittedBy:"", location:"", date:today, woNumber:generateWO(), priority:"", issue:"", photo:null });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const isValid = form.location && form.date && form.priority && form.issue.trim().length > 5;

  const handlePrint = () => {
    const html = generateRmPDF(form);
    const win = window.open("","_blank"); win.document.write(html); win.document.close();
    win.onload = () => win.print();
  };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitStatus(null);
    try {
      const payload = { formType:"rm_request", ...form, timestamp:new Date().toISOString() };
      const res = await fetch(WEBHOOK_URL,{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      setSubmitStatus(res.ok?"success":"error");
      if (res.ok) setSubmitted(true);
    } catch { setSubmitStatus("error"); }
    setSubmitting(false);
  };

  const priObj = PRIORITIES.find(p=>p.val===form.priority);

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#f2f2f2", minHeight:"100vh", paddingBottom:40 }}>
      <Header title="R&M Service Request" subtitle="Operations Hub" onBack={onBack} />

      {submitted && (
        <div style={{ margin:"12px 12px 0", padding:"16px", background:YES_BG, border:`1px solid ${YES_BD}`, borderRadius:10, textAlign:"center" }}>
          <div style={{ fontSize:28, marginBottom:6 }}>✅</div>
          <div style={{ fontWeight:800, fontSize:15, color:"#2e7d32" }}>Request Submitted!</div>
          <div style={{ fontSize:12, color:"#555", marginTop:4 }}>WO# {form.woNumber || "Pending"} — {form.location}</div>
          <button onClick={() => { setForm({ submittedBy:"", location:"", date:today, woNumber:generateWO(), priority:"", issue:"", photo:null }); setSubmitted(false); setSubmitStatus(null); }}
            style={{ marginTop:12, padding:"8px 20px", background:GREEN, color:"white", border:"none", borderRadius:7, fontWeight:700, cursor:"pointer", fontSize:13 }}>
            New Request
          </button>
        </div>
      )}

      {/* Form */}
      <div style={{ margin:"12px 12px 10px", background:"white", borderRadius:10, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight:800, fontSize:13, color:GREEN, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>Request Details</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelStyle}>Submitted By *</label>
            <input style={inputStyle} placeholder="Your name" value={form.submittedBy} onChange={e=>setForm(p=>({...p,submittedBy:e.target.value}))} />
          </div>
          <div>
            <label style={labelStyle}>Location *</label>
            <select style={inputStyle} value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))}><option value="">Select location…</option>{LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}</select>
          </div>
          <div>
            <label style={labelStyle}>Date *</label>
            <input type="date" style={inputStyle} value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} />
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelStyle}>Work Order #</label>
            <input style={{...inputStyle, background:"#f5f5f5", color:"#555"}} value={form.woNumber} readOnly />
          </div>
        </div>
      </div>

      {/* Priority */}
      <div style={{ margin:"0 12px 10px", background:"white", borderRadius:10, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight:800, fontSize:13, color:GREEN, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>Priority *</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {PRIORITIES.map(p => (
            <button key={p.val} onClick={() => setForm(prev=>({...prev,priority:p.val}))}
              style={{
                padding:"12px 10px", border:`2px solid ${form.priority===p.val ? p.color : "#e0e0e0"}`,
                borderRadius:8, cursor:"pointer", textAlign:"left",
                background: form.priority===p.val ? p.color : "white",
                transition:"all 0.15s"
              }}
            >
              <div style={{ fontWeight:800, fontSize:13, color: form.priority===p.val ? "white" : p.color }}>
                {p.label}
              </div>
              <div style={{ fontSize:10, color: form.priority===p.val ? "rgba(255,255,255,0.8)" : "#aaa", marginTop:2, lineHeight:1.4 }}>
                {p.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Issue */}
      <div style={{ margin:"0 12px 10px", background:"white", borderRadius:10, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight:800, fontSize:13, color:GREEN, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>Issue to Resolve *</div>
        <textarea value={form.issue} onChange={e=>setForm(p=>({...p,issue:e.target.value}))}
          placeholder="Describe the issue in detail — what is broken, where it is located, when it started, and any relevant context..."
          style={{ ...inputStyle, minHeight:120, resize:"vertical", lineHeight:1.6 }}
        />
        {/* Photo */}
        <div style={{ marginTop:12 }}>
          <div style={{ fontWeight:700, fontSize:12, color:"#888", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Photo (optional)</div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => fileRef.current.click()}
              style={{ padding:"8px 16px", border:"1px solid #ddd", borderRadius:7, background:"white", cursor:"pointer", color:"#555", fontSize:12, fontWeight:600 }}>
              📷 {form.photo ? "Replace Photo" : "Add Photo"}
            </button>
            {form.photo && (
              <>
                <img src={form.photo} alt="issue"
                  style={{ height:50, width:70, objectFit:"cover", borderRadius:6, border:"1px solid #ddd" }} />
                <button onClick={() => setForm(p=>({...p,photo:null}))}
                  style={{ fontSize:12, color:R, background:"none", border:"none", cursor:"pointer" }}>✕ Remove</button>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment"
            style={{ display:"none" }}
            onChange={e => {
              const file = e.target.files[0]; if (!file) return;
              const reader = new FileReader();
              reader.onload = ev => setForm(p=>({...p,photo:ev.target.result}));
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Request Preview Badge */}
      {form.priority && form.location && (
        <div style={{ margin:"0 12px 10px", padding:"12px 16px", background:priObj?.color+"18", border:`1px solid ${priObj?.color}44`, borderRadius:10, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ padding:"4px 12px", background:priObj?.color, color:"white", borderRadius:20, fontWeight:800, fontSize:12, flexShrink:0 }}>
            {priObj?.label}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#1a1a1a" }}>{form.location}</div>
            <div style={{ fontSize:11, color:"#888" }}>{form.woNumber ? `WO# ${form.woNumber}` : "WO# pending"} · {form.date}</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ margin:"0 12px", background:"white", borderRadius:10, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight:800, fontSize:13, color:GREEN, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>Export & Submit</div>
        <button onClick={handlePrint} disabled={!isValid}
          style={{
            width:"100%", padding:"13px", marginBottom:10,
            background: isValid ? GREEN : "#ccc",
            color:"white", border:"none", borderRadius:8, fontWeight:800, fontSize:15,
            cursor: isValid ? "pointer" : "default",
            boxShadow: isValid ? `0 3px 10px ${GREEN}55` : "none"
          }}
        >
          📄 Download / Print PDF
        </button>
        <SubmitButton onSubmit={handleSubmit} submitting={submitting} submitStatus={submitStatus} color={GREEN} />
        {!isValid && (
          <div style={{ marginTop:10, fontSize:11, color:"#aaa", textAlign:"center" }}>
            Complete Location, Priority, and Issue to enable export
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  FORM 4 — DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
const SHEET_ID = "1sDOlld_vsXQOamXWmV277jF-6Jl_XQGVU9d4gkcOov4";
const API_KEY = "AIzaSyCbUZJ49uk2OX3lDoeR2nBU9-4JlM8FAwQ";
const PURPLE = "#6a1b9a";

function fetchSheet(tabName) {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(tabName)}?key=${API_KEY}`)
    .then(r => { if (!r.ok) throw new Error(`Failed to fetch ${tabName}`); return r.json(); })
    .then(data => {
      if (!data.values || data.values.length < 2) return [];
      const headers = data.values[0].map(h => h.trim().toLowerCase());
      return data.values.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i] || ""; });
        return obj;
      });
    });
}

function parseScore(row) {
  const pctField = row.percentage || row.score || row["score %"] || row["score%"] || row.pct || "";
  const num = parseFloat(pctField);
  if (!isNaN(num)) return num;
  const earned = parseFloat(row.totalearned || row.earned || row.total_earned || "0");
  const possible = parseFloat(row.totalpossible || row.possible || row.total_possible || "1");
  return possible > 0 ? (earned / possible) * 100 : 0;
}

function parseLocation(row) {
  return row.location || row.store || row.site || "Unknown";
}

function parseDate(row) {
  return row.date || row.timestamp?.split("T")[0] || "—";
}

function scoreColor(pct, thresholds) {
  return pct >= thresholds[0] ? "#2e7d32" : pct >= thresholds[1] ? "#e65100" : R;
}

function KpiCard({ label, value, color }) {
  return (
    <div style={{ flex:1, background:"white", borderRadius:10, padding:"14px 10px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.08)", minWidth:0 }}>
      <div style={{ fontSize:24, fontWeight:900, color: color || "#1a1a1a", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, color:"#888", marginTop:4, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
    </div>
  );
}

function TrendTable({ rows, thresholds, accentColor }) {
  if (!rows.length) return <div style={{ fontSize:13, color:"#aaa", textAlign:"center", padding:16 }}>No data yet</div>;
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ background:accentColor, color:"white", fontSize:11, fontWeight:700 }}>
            <td style={{ padding:"8px 10px" }}>DATE</td>
            <td style={{ padding:"8px 10px" }}>LOCATION</td>
            <td style={{ padding:"8px 10px", textAlign:"right" }}>SCORE</td>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const c = scoreColor(r.score, thresholds);
            return (
              <tr key={i} style={{ borderBottom:"1px solid #eee" }}>
                <td style={{ padding:"8px 10px", color:"#555" }}>{r.date}</td>
                <td style={{ padding:"8px 10px", color:"#333", fontWeight:600 }}>{r.location}</td>
                <td style={{ padding:"8px 10px", textAlign:"right", fontWeight:800, color:c }}>{r.score.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard({ onBack }) {
  const [inspections, setInspections] = useState([]);
  const [lpAudits, setLpAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchSheet("Inspections").catch(() => []),
      fetchSheet("Loss Prevention Audits").catch(() => []),
    ])
      .then(([insp, lp]) => {
        setInspections(insp.map(r => ({ score: parseScore(r), location: parseLocation(r), date: parseDate(r) })));
        setLpAudits(lp.map(r => ({ score: parseScore(r), location: parseLocation(r), date: parseDate(r) })));
      })
      .catch(() => setError("Failed to load dashboard data. Check your connection and try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = (rows) => filter === "All" ? rows : rows.filter(r => r.location === filter);
  const avg = (rows) => rows.length ? rows.reduce((s, r) => s + r.score, 0) / rows.length : 0;
  const best = (rows) => {
    if (!rows.length) return "—";
    const byLoc = {};
    rows.forEach(r => { if (!byLoc[r.location]) byLoc[r.location] = []; byLoc[r.location].push(r.score); });
    let top = "", topAvg = -1;
    Object.entries(byLoc).forEach(([loc, scores]) => { const a = scores.reduce((s,v)=>s+v,0)/scores.length; if (a > topAvg) { topAvg = a; top = loc; } });
    return top || "—";
  };
  const worst = (rows) => {
    if (!rows.length) return "—";
    const byLoc = {};
    rows.forEach(r => { if (!byLoc[r.location]) byLoc[r.location] = []; byLoc[r.location].push(r.score); });
    let bot = "", botAvg = Infinity;
    Object.entries(byLoc).forEach(([loc, scores]) => { const a = scores.reduce((s,v)=>s+v,0)/scores.length; if (a < botAvg) { botAvg = a; bot = loc; } });
    return bot || "—";
  };
  const last10 = (rows) => [...rows].reverse().slice(0, 10);

  const fi = filtered(inspections);
  const fl = filtered(lpAudits);

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#f2f2f2", minHeight:"100vh", paddingBottom:40 }}>
      <Header title="Dashboard" subtitle="Operations Hub" onBack={onBack} />

      {/* Location Filter */}
      <div style={{ background:"white", padding:"10px 12px", borderBottom:"1px solid #eee", overflowX:"auto", whiteSpace:"nowrap" }}>
        {["All", ...LOCATIONS].map(loc => (
          <button key={loc} onClick={() => setFilter(loc)}
            style={{
              display:"inline-block", padding:"6px 14px", marginRight:8, border:"none",
              borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer",
              background: filter === loc ? PURPLE : "#f0f0f0",
              color: filter === loc ? "white" : "#666",
              transition:"all 0.15s"
            }}
          >
            {loc}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:36, marginBottom:12, animation:"spin 1s linear infinite" }}>⏳</div>
          <div style={{ fontSize:14, color:"#888", fontWeight:600 }}>Loading dashboard data…</div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ margin:12, padding:16, background:NO_BG, border:`1px solid ${NO_BD}`, borderRadius:10, textAlign:"center" }}>
          <div style={{ fontSize:24, marginBottom:8 }}>⚠️</div>
          <div style={{ fontSize:14, color:R, fontWeight:700 }}>{error}</div>
          <button onClick={() => window.location.reload()}
            style={{ marginTop:12, padding:"8px 20px", background:R, color:"white", border:"none", borderRadius:7, fontWeight:700, cursor:"pointer", fontSize:13 }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Restaurant Inspection KPIs */}
          <div style={{ margin:"12px 12px 0" }}>
            <div style={{ fontWeight:800, fontSize:14, color:R, marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:18 }}>🍗</span> Restaurant Inspections
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <KpiCard label="Avg Score" value={fi.length ? `${avg(fi).toFixed(1)}%` : "—"} color={fi.length ? scoreColor(avg(fi), [85, 70]) : "#aaa"} />
              <KpiCard label="Total" value={fi.length} color={PURPLE} />
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <KpiCard label="Best Location" value={best(fi)} color="#2e7d32" />
              <KpiCard label="Needs Work" value={worst(fi)} color={R} />
            </div>
          </div>

          <div style={{ margin:"0 12px 16px", background:"white", borderRadius:10, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
            <div style={{ background:R, color:"white", padding:"10px 14px", fontWeight:800, fontSize:13, display:"flex", justifyContent:"space-between" }}>
              <span>Recent Inspections</span>
              <span style={{ opacity:0.8, fontSize:11 }}>Last 10</span>
            </div>
            <TrendTable rows={last10(fi)} thresholds={[85, 70]} accentColor={R} />
          </div>

          {/* LP Audit KPIs */}
          <div style={{ margin:"0 12px" }}>
            <div style={{ fontWeight:800, fontSize:14, color:BLUE, marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:18 }}>🔒</span> Loss Prevention Audits
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <KpiCard label="Avg Score" value={fl.length ? `${avg(fl).toFixed(1)}%` : "—"} color={fl.length ? scoreColor(avg(fl), [85, 60]) : "#aaa"} />
              <KpiCard label="Total" value={fl.length} color={PURPLE} />
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <KpiCard label="Best Location" value={best(fl)} color="#2e7d32" />
              <KpiCard label="Needs Work" value={worst(fl)} color={R} />
            </div>
          </div>

          <div style={{ margin:"0 12px 16px", background:"white", borderRadius:10, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
            <div style={{ background:BLUE, color:"white", padding:"10px 14px", fontWeight:800, fontSize:13, display:"flex", justifyContent:"space-between" }}>
              <span>Recent LP Audits</span>
              <span style={{ opacity:0.8, fontSize:11 }}>Last 10</span>
            </div>
            <TrendTable rows={last10(fl)} thresholds={[85, 60]} accentColor={BLUE} />
          </div>

          {filter !== "All" && fi.length === 0 && fl.length === 0 && (
            <div style={{ textAlign:"center", padding:"30px 20px", color:"#aaa", fontSize:13 }}>
              No data found for {filter}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("home");

  if (screen === "inspection") return <RestaurantInspection onBack={() => setScreen("home")} />;
  if (screen === "lp")         return <LpAudit             onBack={() => setScreen("home")} />;
  if (screen === "rm")         return <RmRequest           onBack={() => setScreen("home")} />;
  if (screen === "dashboard")  return <Dashboard           onBack={() => setScreen("home")} />;
  return <HomeScreen onNav={setScreen} />;
}
