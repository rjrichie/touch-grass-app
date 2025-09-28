// configure express
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const bcrypt = require("bcryptjs")

const db = require("./db.js");


// configure auth
app.post("/auth/register", async (req, res) => {
    const { first, last, email, password } = req.body || {};
    if (!first || !last || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const hash = await bcrypt.hash(password, 10);
    try {
        const { rows } = await db.query(
            `INSERT INTO users (first, last, email, password)
               VALUES ($1,$2,$3,$4)
               RETURNING id, first, last, email`,
            [first, last, email, hash]
        );
        return res.json({ user: rows[0], token: "dummy-token" });
    } catch (e) {
        if (e.code === "23505") {
            return res.status(409).json({ error:"Email already in use" });
        }
        console.error(e);
        return res.status(500).json({ error:"Failed to register" });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const { rows } = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
    const user = rows[0];
    if (!user) {
        return res.status(401).json({error: "Invalid credentials"});
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({
        user: { id: user.id, first: user.first, last: user.last, email: user.email },
        token: "dummy-token"
    });
});


// lookups
app.get("/interests", async (_req, res) => {
    const { rows } = await db.query(
        `SELECT i.iid, i.interest,
            COALESCE(ui.cnt,0)::int as USER_COUNT,
            COALESCE(ei.cnt,0)::int as EVENT_COUNT
        FROM interests i 
        LEFT JOIN (
            SELECT iid, count(*)::int as cnt from userinterests GROUP BY iid
        ) ui ON ui.iid=i.iid
        LEFT JOIN (
            SELECT iid, COUNT(*)::int as cnt from interestevents GROUP BY iid
        ) ei on ei.iid=i.iid
        ORDER BY i.interest
        `
    )
    res.json(rows);
})

app.get("/tags", async(_req, res) => {
    const { rows } = await db.query(
        `SELECT t.tid, t.tag,
            COALESCE(ut.cnt, 0)::int AS user_count,
            COALESCE(et.cnt, 0)::int AS event_count
         FROM tags t
         LEFT JOIN (SELECT tid, COUNT(*)::int cnt FROM usertags GROUP BY tid) ut ON ut.tid=t.tid
         LEFT JOIN (SELECT tid, COUNT(*)::int cnt FROM eventtags GROUP BY tid) et ON et.tid=t.tid
         ORDER BY t.tag`
    );
    res.json(rows);
});

app.get("/events", async(req, res) => {
    // Returns upcoming events. If uid is provided, the response will include
    // whether each event aligns with that user's interests (is_interested).
    const uid = req.query.uid || null;

    try {
        const { rows } = await db.query(
            `SELECT e.eid, e.name, e.datetime, e.description, e.cost, e.numattendees,
                    i.interest,
                    CASE WHEN ui.uid IS NOT NULL THEN true ELSE false END AS is_interested
             FROM events e
             LEFT JOIN interests i ON i.iid = e.iid
             LEFT JOIN userinterests ui ON ui.iid = e.iid AND ui.uid = $1
             WHERE e.datetime > now()
             ORDER BY e.datetime ASC
             LIMIT 500`,
            [uid]
        );

        const events = rows.map(row => ({
            id: String(row.eid),
            title: row.name,
            description: row.description,
            // Keep a machine-readable ISO so frontend can sort reliably
            datetimeISO: row.datetime,
            date: new Date(row.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            time: new Date(row.datetime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            location: 'Student Center',
            organizer: 'AI Organized',
            attendees: row.numattendees || 0,
            maxAttendees: 20,
            tags: row.interest ? [row.interest] : [],
            isInterested: !!row.is_interested,
            isAttending: false
        }));

        res.json(events);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'failed to fetch events' });
    }
});

app.get("/events/:eid", async(req, res) => {
    const { eid } = req.params;

    try {
        const { rows } = await db.query(
            `SELECT e.eid, e.name, e.datetime, e.interest, e.cost, e.numAttendees,
                COALESCE(i.interest, NULL) as interest
            FROM events e 
            LEFT JOIN interests i on i.iid=e.iid
            WHERE e.eid=$1`,
            [eid]
        );
        if (rows.length === 0) {
            res.status(404).json({ error: "Failed to find event" });
        }
        return res.json(rows[0]);
    } catch(e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch event" });
    }
});

class ProfileSetters {
    static async update_name(client, uid, first, last) {
        await client.query(`
                UPDATE users 
                SET first=COALESCE($1,first),
                    last=COALESCE($2,last)
                WHERE id=$3`,
            [first ?? null, last ?? null, uid]
        );
    }
    static clean(arr) {
        const cleaned = arr
            .map(s => String(s).trim())
            .filter(Boolean); // removes falsey values from the array
        return [...new Set(cleaned)]; // remove duplicates
    }
    static async update_interests(client, uid, interests) {
        await client.query(`DELETE FROM userinterests WHERE uid = $1`, [uid]);

        for (const interest of interests) {
            // First, try to find existing interest
            let { rows } = await client.query(
                `SELECT iid FROM interests WHERE interest = $1`,
                [interest]
            );
            
            let iid;
            if (rows.length > 0) {
                iid = rows[0].iid;
            } else {
                // Insert new interest
                const result = await client.query(
                    `INSERT INTO interests (interest) VALUES ($1) RETURNING iid`,
                    [interest]
                );
                iid = result.rows[0].iid;
            }
            
            await client.query(
                `INSERT INTO userinterests (uid, iid)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING`,
                [uid, iid]
            );
        }
    }
}
app.put("/profile", async (req,res) => {
    const { uid, first, last, interests } = req.body || {}
    if (!uid) {
        return res.status(400).json({ error: "User ID is required" });
    }
    if (first !== undefined && typeof first !== "string")
        return res.status(400).json({ error: "first must be a string" });
    if (last !== undefined && typeof last !== "string")
        return res.status(400).json({ error: "last must be a string" });
    if (interests !== undefined && !Array.isArray(interests))
        return res.status(400).json({ error: "interests must be an array of strings" });

    const client = await db.pool.connect();
    try {
        await client.query("BEGIN");
        if (first !== undefined || last !== undefined) {
            await ProfileSetters.update_name(client, uid, first, last);
        }
        if (interests !== undefined) {
            const names = ProfileSetters.clean(interests);
            await ProfileSetters.update_interests(client, uid, names);
        }
        await client.query("COMMIT");
        return res.json({uid, status: "success"});
    } catch(e) {
        await client.query("ROLLBACK");
        console.error(e);
        return res.status(500).json({ error: "Failed to update profile" });
    } finally{
        client.release();
    }
});

// Get user stats
app.get("/user/:uid", async (req, res) => {
    const { uid } = req.params;
    
    try {
        // Get user basic info
        const { rows: userRows } = await db.query(
            `SELECT id, first, last, email, totalSeen, totalAccepted, created_at 
             FROM users WHERE id = $1`,
            [uid]
        );
        
        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const user = userRows[0];
        
        // Get user interests
        const { rows: interestRows } = await db.query(`
            SELECT i.interest
            FROM userinterests ui
            JOIN interests i ON ui.iid = i.iid
            WHERE ui.uid = $1
            ORDER BY i.interest
        `, [uid]);
        
        const interests = interestRows.map(row => row.interest);
        
        // Get events attended count (from totalAccepted)
        const eventsAttended = user.totalaccepted || 0;
        
        // Get events seen count (from totalSeen)
        const eventsSeen = user.totalseen || 0;
        
        res.json({
            id: user.id,
            first: user.first,
            last: user.last,
            email: user.email,
            interests,
            eventsSeen,
            eventsAttended,
            createdAt: user.created_at
        });
        
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: "Failed to fetch user stats" });
    }
});




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
})