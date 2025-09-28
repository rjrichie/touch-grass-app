// AI Event Agent – Single Export (JS/ESM)
// Returns a DB-ready row matching your `events` table schema.
// Default export: planEventRow(interest, existingEvents, opts?)
//
// Install: npm i @google/generative-ai zod node-fetch luxon cheerio
// package.json: { "type": "module" }
// Env: GEMINI_API_KEY, SERPAPI_KEY (for Google Maps via SerpAPI)
// Run (demo): node plan-event.js "hiking"

// ------------------ env ------------------

const ENV = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
    SERPAPI_KEY: process.env.SERPAPI_KEY || "",
    DEFAULT_CITY: process.env.DEFAULT_CITY || "Atlanta, GA",
    DEFAULT_CAMPUS: process.env.DEFAULT_CAMPUS || "Georgia Tech",
    DEFAULT_TZ: process.env.DEFAULT_TZ || "America/New_York",
    WINDOW_DAYS: Number(process.env.WINDOW_DAYS || 21),
};

// ------------------ deps ------------------
require("dotenv").config();

const { z } = require("zod");
const { DateTime } = require("luxon");
const cheerio = require("cheerio");


// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { DateTime } from "luxon";
// import { z } from "zod";
// import * as cheerio from "cheerio";

// ------------------ schemas ------------------
const ExistingEventSchema = z.object({
    name: z.string(),
    datetime: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
});

const EventRowSchema = z.object({
    // matches your DB table columns
    name: z.string(),
    datetime: z.string(), // TIMESTAMPTZ ISO (with offset)
    description: z.string(),
    cost: z.number(), // NUMERIC(5,2)
    numAttendees: z.number().int().nonnegative().default(0),
});

// ------------------ helpers ------------------
const normalize = (s = "") => s.toLowerCase().replace(/\s+/g, " ").trim();
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function conflict(existing, startISO, endISO) {
    const start = DateTime.fromISO(startISO);
    const end = endISO ? DateTime.fromISO(endISO) : start.plus({ hours: 2 });
    return existing.some(ev => {
        const s = DateTime.fromISO(ev.datetime || ev.start);
        if (!s.isValid) return false;
        const e = DateTime.fromISO(ev.end || (ev.datetime || ev.start)).plus({ hours: 2 });
        return s < end && start < e;
    });
}

function pickGoodDate(tz, withinDays, existing) {
    const now = DateTime.now().setZone(tz);
    const cand = [];
    for (let d = 0; d <= withinDays; d++) {
        const day = now.plus({ days: d });
        const w = day.weekday; // 1=Mon
        if (w === 4 || w === 5) cand.push(day.set({ hour: 19, minute: 0, second: 0, millisecond: 0 })); // Thu/Fri 7pm
        if (w === 6) { // Sat
            cand.push(day.set({ hour: 11 }));
            cand.push(day.set({ hour: 14 }));
        }
        if (w === 7) cand.push(day.set({ hour: 13 })); // Sun 1pm
    }
    for (const c of cand) {
        const iso = c.toISO();
        if (iso && !conflict(existing, iso)) return iso;
    }
    // fallback: next weekday 7pm
    for (let d = 0; d <= withinDays; d++) {
        const t = now.plus({ days: d }).set({ hour: 19, minute: 0, second: 0 });
        const iso = t.toISO();
        if (iso && !conflict(existing, iso)) return iso;
    }
    return now.plus({ days: 3 }).set({ hour: 19 }).toISO();
}

function baselineCostUSD(categoryOrIdea) {
    const c = normalize(categoryOrIdea);
    if (c.includes("hike") || c.includes("park")) return 0;
    if (c.includes("board")) return 10;
    if (c.includes("mini")) return 15;
    if (c.includes("arcade")) return 20;
    if (c.includes("bowling")) return 18;
    if (c.includes("museum")) return 15;
    if (c.includes("sports") || c.includes("game")) return 35; // sports watch party
    if (c.includes("movie")) return 16;
    return 12;
}

function estPopularityScore(rating, reviews) {
    if (!rating || !reviews) return 0.5;
    const r = clamp((rating - 3) / 2, 0, 1);
    const v = clamp(Math.log10((reviews || 1) + 1) / 3, 0, 1);
    return clamp(0.6 * r + 0.4 * v, 0, 1);
}

function estProximityScore(address) {
    const a = normalize(address);
    if (!a) return 0.5;
    const near = ["midtown", "atlantic station", "westside", "howell mill", "centennial", "tech square", "home park", "ponce", "old fourth ward", "ansley", "grant park"];
    return near.some(k => a.includes(k)) ? 0.8 : 0.5;
}

function scoreOption(o) {
    const pop = clamp(o.popularityScore ?? 0.5, 0, 1);
    const prox = clamp(o.proximityScore ?? 0.5, 0, 1);
    const av = clamp(o.availabilityScore ?? 0.5, 0, 1);
    const cost = o.estPerPersonCost ?? baselineCostUSD(o.category || o.ideaTitle);
    const costScore = clamp(1 - cost / 40, 0, 1);
    return 0.3 * prox + 0.3 * pop + 0.2 * av + 0.2 * costScore;
}

async function ogImage(url) {
    try {
        const r = await fetch(url, { timeout: 8000 });
        const html = await r.text();
        const $ = cheerio.load(html);
        return (
            $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') || undefined
        );
    } catch { return undefined; }
}

// ------------------ Phase 1: ideate (Gemini) ------------------
// const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const genAIModel = "gemini-2.5-pro"
async function ideate(interest, city) {
    if (!ENV.GEMINI_API_KEY) {
        // simple fallback ideas if key missing
        const base = [
            `Casual ${interest} meetup`,
            `${interest} + food near campus`,
            `${interest} at Atlantic Station`,
            `${interest} at The Battery`,
            `${interest} at Piedmont Park`,
        ];
        return base.map(t => ({ title: t }));
    }
    let GoogleGenerativeAI;
    try {
        ({ GoogleGenerativeAI } = await import("@google/generative-ai"));
    } catch(e) {
        console.warn("[warn] @google/generative-ai not available; using fallback ideas.");
        const base = [`Casual ${interest} meetup`, `${interest} at Atlantic Station`];
        return base.map((t) => ({ title: t }));
    }
    const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: genAIModel });
    const prompt = `You are brainstorming fast for Georgia Tech students in ${city}.\nReturn 15-25 ideas for the interest: "${interest}".\nHigh variety, safe, free+paid mix, use public venues/areas when possible.\nReturn in JSON format: {ideas: [{"title": string, "rationale": string, "tags": string[]}]}`;
    const res = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }]}] });
    const text = res.response.text();
    console.log(text);
    try {
        return JSON.parse(text)["ideas"];
    } catch {
        console.log("COULDN'T PARSE TEXT");
        const manual_parsed = text
            .split(/\n|\r/)
            .map(x => x.replace(/^[-*]\s*/, ""))
            .filter(Boolean)
            .slice(0, 15)
            .map(t => ({ title: t }) );
        console.log(manual_parsed);
        return manual_parsed;
    }
}

// ------------------ Phase 2: research (SerpAPI Maps) ------------------
async function mapsSearch(q, num = 5) {
    if (!ENV.SERPAPI_KEY) return [];
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google_maps");
    url.searchParams.set("q", q);
    url.searchParams.set("ll", `@33.7756,-84.3963,14z`); // GT area
    url.searchParams.set("type", "search");
    url.searchParams.set("api_key", ENV.SERPAPI_KEY);
    const r = await fetch(url);
    const j = await r.json();
    return (j.local_results || []).slice(0, num).map(x => ({
        name: x.title,
        rating: x.rating,
        reviews: x.reviews,
        address: x.address,
        phone: x.phone,
        website: x.website,
        mapsUrl: x.place_link,
        category: x.type,
        hours: x.hours,
    }));
}

async function research(ideas, city) {
    const out = [];
    for (const idea of ideas) {
        const places = await mapsSearch(`${idea.title} ${city}`, 5);
        for (const p of places) {
            const est = baselineCostUSD(p.category || idea.title); //TODO: make this genai
            out.push({
                ideaTitle: idea.title,
                venueName: p.name,
                address: p.address,
                website: p.website,
                mapsUrl: p.mapsUrl,
                category: p.category,
                estPerPersonCost: est,
                popularityScore: estPopularityScore(p.rating, p.reviews),
                proximityScore: estProximityScore(p.address),
                availabilityScore: p.hours ? 0.7 : 0.5,
            });
        }
    }
    // de-dupe idea+venue
    const seen = new Set();
    return out.filter(o => {
        const k = `${normalize(o.ideaTitle)}|${normalize(o.venueName)}`;
        if (seen.has(k)) return false; seen.add(k); return true;
    });
}

// ------------------ Phase 3: select ------------------
function selectBest(options) {
    if (!options.length) return undefined;
    return options.map(o => ({ o, s: scoreOption(o) })).sort((a,b) => b.s - a.s)[0].o;
}

// ------------------ Phase 4: finalize (DB row) ------------------
async function finalize(winner, opts) {
    const tz = opts.timezone || ENV.DEFAULT_TZ;
    const within = opts.windowDays ?? ENV.WINDOW_DAYS;
    const whenISO = pickGoodDate(tz, within, opts.existingEvents || []);
    const predicted = Math.max(0, Math.min(999.99, winner.estPerPersonCost ?? baselineCostUSD(winner.category || winner.ideaTitle)));
    const cost = Math.round(predicted * 100) / 100; // 2 decimals

    // Nice but optional: grab an image for your frontend (not stored in DB row)
    let image; if (winner.website) image = await ogImage(winner.website); if (!image && winner.mapsUrl) image = await ogImage(winner.mapsUrl);

    const description = `Meetup: ${winner.ideaTitle} at ${winner.venueName}. ${winner.address ? `Address: ${winner.address}. `: ""}Expect about $${cost} per person. We will meet near the entrance. If you need a ride, coordinate in chat.`;

    const row = {
        name: `${winner.ideaTitle} @ ${winner.venueName}`,
        datetime: whenISO, // ISO with TZ offset → TIMESTAMPTZ
        description,
        cost,
        numAttendees: 0,
    };
    return { row: EventRowSchema.parse(row), extras: { image, venue: {
                name: winner.venueName, address: winner.address, website: winner.website, mapsUrl: winner.mapsUrl, category: winner.category
            }}};
}

// ------------------ Default export ------------------
/**
 * planEventRow(interest, existingEvents, opts?) => { name, datetime, description, cost, numAttendees }
 * existingEvents: [{ name, datetime } | { name, start, end }]
 * opts: { city, campus, timezone, windowDays }
 */
async function planEventRow(interest, existingEvents = [], opts = {}) {
    ExistingEventSchema.array().parse(
        existingEvents.map(e =>
            ({
                name: String(e.name || ""),
                datetime: e.datetime,
                start: e.start,
                end: e.end,
            })
        ));

    const city = opts.city || ENV.DEFAULT_CITY;
    const ideas = await ideate(interest, city);
    let options = await research(ideas, city);

    // remove overlaps by very-similar names vs. provided events
    const similar = (a,b) => {
        const A = new Set(normalize(a).split(" ")); const B = new Set(normalize(b).split(" "));
        const inter = new Set([...A].filter(x => B.has(x))).size; const uni = new Set([...A, ...B]).size || 1;
        return inter/uni;
    };
    options = options.filter(o =>
        !existingEvents.some(ev =>
            similar(ev.name, `${o.ideaTitle} @ ${o.venueName}`) > 0.7)
    );

    if (!options.length) {
        options = [{
            ideaTitle: `Casual ${interest} meetup`,
            venueName: "Atlantic Station",
            address: "1380 Atlantic Dr NW, Atlanta, GA 30363",
            website: "https://atlanticstation.com/",
            mapsUrl: "https://maps.google.com/?q=Atlantic+Station",
            category: interest,
            estPerPersonCost: baselineCostUSD(interest),
            popularityScore: 0.6, proximityScore: 0.7, availabilityScore: 0.7,
        }];
    }

    const winner = selectBest(options);
    if (!winner) throw new Error("No viable options found.");

    const { row /*, extras */ } = await finalize(winner, {
        timezone: opts.timezone || ENV.DEFAULT_TZ,
        windowDays: opts.windowDays ?? ENV.WINDOW_DAYS,
        existingEvents,
    });

    // Return *only* the DB row to match your schema exactly.
    return row;
}

// ------------------ CLI demo ------------------
// if (import.meta.url === (new URL(`file://${process.argv[1]}`)).href) {
//     (async () => {
//         const interest = process.argv[2] || "hiking";
//         const row = await planEventRow(interest, [], { timezone: ENV.DEFAULT_TZ });
//         console.log(JSON.stringify(row, null, 2));
//     })().catch(e => { console.error(e); process.exit(1); });
// }
//
module.exports = {
    planEventRow
}