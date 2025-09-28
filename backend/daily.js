// the default export should be run daily

const db = require("./db.js");

function getInterests() {
    try {
        const { interests } = db.query("SELECT iid FROM interests");
        return interests;
    } catch(e) {
        console.error("couldn't get interests");
        return [];
    }
}
function getEventCount(iid) {
    try {
        const { events } = db.query(`
            SELECT COUNT(*) FROM events e
            JOIN interestevents ie ON ie.eid=e.eid
            WHERE ie.iid=$1 AND e.datetime > now()
        `);
        return {iid, eventCount};
    } catch(e) {
        console.error("couldn't get matching events");
        return 0;
    }
}

function expectedAttendance({iid, eventCount}) {
    try {
        const { expectedAttendance } = db.query(`
            SELECT COALESCE(
                SUM(
                    CASE
                      WHEN u.totalSeen < 10 THEN 0.2
                      ELSE u.totalAccepted::numeric / NULLIF(u.totalSeen, 0)
                    END
            ), 0) AS interest_score
            FROM userinterests ui
            JOIN users u ON u.id = ui.uid
            WHERE ui.iid = $1;
        `, [iid])
        return {iid, expectedAttendance, eventCount}
    } catch(e) {
        console.error(e);
        return 0;
    }
}

function enoughEvents({iid, eventCount, expectedAttendees}) {
    try {
        const { gap } = db.query(`
            WITH params AS (
                SELECT
                    $1::bigint AS iid,
                    $2::int AS eventCount,
                    $3::numeric AS expectedAttendees
            )
            SELECT FLOOR(p.expectedAttendees / i.minAttendees) - p.eventCount as gap
            FROM interests i
            CROSS JOIN params p
            WHERE i.iid=params.iid
        `, [iid, eventCount, expectedAttendees])
        return {iid, gap};
    } catch(e) {
        console.error(e);
        return 0;
    }
}

function getEvents(iid) {
    try {
        const { events } = db.query(`
            SELECT * 
            FROM events e 
            JOIN interestevents ie ON e.eid=ie.eid 
            WHERE ie.iid=$1`,
            [iid]
        );
        return {iid, events};
    } catch(e) {
        console.error(e);
        return {};
    }
}
export default function createEvents() {
    const underservedEvents = getInterests()
        .map(getEventCount)
        .map(expectedAttendance)
        .map(enoughEvents)
        .filter(({iid, gap}) => gap > 0)
        .map(({ iid }) => getEvents(iid));



}