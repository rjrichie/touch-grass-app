require('dotenv').config();
const db = require('./db.js');

async function debugEvents() {
    try {
        console.log('Debugging events for user 1...\n');
        
        // Check user interests
        const { rows: userInterests } = await db.query(`
            SELECT ui.uid, i.interest, i.iid
            FROM userinterests ui
            JOIN interests i ON ui.iid = i.iid
            WHERE ui.uid = 1
        `);
        console.log('User interests:', userInterests);
        
        // Check all events
        const { rows: allEvents } = await db.query(`
            SELECT e.eid, e.name, e.datetime, i.interest
            FROM events e
            JOIN interests i ON e.iid = i.iid
            ORDER BY e.datetime
        `);
        console.log('\nAll events:', allEvents);
        
        // Check interest-events links
        const { rows: interestEvents } = await db.query(`
            SELECT ie.iid, ie.eid, i.interest, e.name
            FROM interestevents ie
            JOIN interests i ON ie.iid = i.iid
            JOIN events e ON ie.eid = e.eid
            ORDER BY ie.iid
        `);
        console.log('\nInterest-Event links:', interestEvents);
        
        // Test the actual query from the API
        const { rows: apiQuery } = await db.query(`
            SELECT DISTINCT e.eid, e.name, e.datetime, e.description, e.cost, e.numAttendees, i.interest
            FROM userinterests ui
            JOIN interestevents ie ON ui.iid=ie.iid
            JOIN events e ON e.eid=ie.eid
            JOIN interests i ON i.iid=e.iid
            WHERE ui.uid=$1
            AND e.datetime > now()
            ORDER BY e.datetime ASC
            LIMIT 100
        `, [1]);
        console.log('\nAPI query result:', apiQuery);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

debugEvents();
