require('dotenv').config();
const db = require('./db.js');

async function updateEventDates() {
    try {
        console.log('Updating event dates to future dates...\n');
        
        // Update all events to have future dates (next 30 days)
        const { rows: events } = await db.query('SELECT eid, name FROM events ORDER BY eid');
        
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const daysFromNow = i + 1; // Start from tomorrow
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + daysFromNow);
            futureDate.setHours(14 + (i % 8), 0, 0, 0); // Spread events throughout the day
            
            const isoString = futureDate.toISOString();
            
            await db.query(
                'UPDATE events SET datetime = $1 WHERE eid = $2',
                [isoString, event.eid]
            );
            
            console.log(`Updated ${event.name} to ${isoString}`);
        }
        
        console.log('\n✅ All event dates updated to future dates!');
        
        // Verify the updates
        const { rows: updatedEvents } = await db.query(`
            SELECT eid, name, datetime 
            FROM events 
            ORDER BY datetime
        `);
        
        console.log('\nUpdated events:');
        updatedEvents.forEach(event => {
            console.log(`- ${event.name}: ${event.datetime}`);
        });
        
    } catch (error) {
        console.error('Error updating event dates:', error);
    } finally {
        process.exit(0);
    }
}

updateEventDates();
