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


// configure JWT
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "devsecret"
function sign(user) {
    const payload = {
        uid: user.id,
        email: user.email,
    }
    const options = {
        expiresIn: '7d',
    }
    return jwt.sign(payload, JWT_SECRET, options);
}
function auth(req, res, next) {
    const token = (req.headers.authorization || "")
        .replace(/^Bearer\s+/i, "");
    if (!token) {
        return res
            .status(401)
            .json({error: "Missing Token"});
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res
            .status(401)
            .json({ error: "Invalid Token" });
    }
}


// configure auth
app.post("/auth/register", async (req, res) => {
    const { first, last, email, password } = req.body || {};
    if (!first || !last || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const hash = await bcrypt.hash(password, 10);
    console.log(typeof hash, hash);
    try {
        const { rows } = await db.query(
            `INSERT INTO users (first, last, email, password)
               VALUES ($1,$2,$3,$4)
               RETURNING id, first, last, email`,
            [first, last, email, hash]
        );
        return res.json({ user: rows[0], token: sign(rows[0]) });
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
        token: sign(user)
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
    const uid = req.user?.uid;
    if (uid === undefined) {
        return res.status(400).json({ error: "missing uid field" });
    }

    try {
        const {rows} = await db.query(
            `SELECT DISTINCT e.eid, e.name, e.datetime, e.cost
            FROM userinterests ui
            JOIN interestevents ie ON ui.iid=ie.iid
            JOIN events e ON e.eid=ie.eid
            WHERE ui.uid=$1
            AND e.datetime > now()
            ORDER BY e.datetime ASC
            LIMIT 100`,
            [uid]
        );
        res.json(rows);
    } catch(e) {
        console.log(e);
        res.status(500).json({"error": "failed to fetch personalized events"});
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
                WHERE uid=$3`,
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
app.put("/profile", auth, async (req,res) => {
    const uid = req.user.uid;
    const { first, last, interests } = req.body || {}
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




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
})