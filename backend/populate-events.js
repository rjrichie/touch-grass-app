require('dotenv').config();
const db = require('./db.js');

// Sample events for each interest
const sampleEvents = [
  // Sports events
  {
    interest: 'Sports',
    events: [
      {
        name: 'GT vs UGA Watch Party',
        datetime: '2024-11-25 15:30:00-05:00',
        description: 'Watch the big rivalry game with fellow Yellow Jackets! Pizza and drinks provided. Come early for the best seats!',
        cost: 0.00,
        numAttendees: 8
      },
      {
        name: 'Morning Campus Hike',
        datetime: '2024-11-24 07:00:00-05:00',
        description: 'Start your day with an energizing hike around campus trails and nearby nature paths. Perfect for all fitness levels!',
        cost: 0.00,
        numAttendees: 4
      }
    ]
  },
  // Technology events
  {
    interest: 'Technology',
    events: [
      {
        name: 'Weekend Hackathon: AI Solutions',
        datetime: '2024-12-03 18:00:00-05:00',
        description: 'Build innovative AI solutions in 48 hours! All skill levels welcome. Prizes and free meals included.',
        cost: 0.00,
        numAttendees: 22
      },
      {
        name: 'CS 2110 Study Group',
        datetime: '2024-12-07 19:00:00-05:00',
        description: 'Collaborative study session focusing on data structures and algorithms. Bring your laptop and notes!',
        cost: 0.00,
        numAttendees: 5
      }
    ]
  },
  // Music events
  {
    interest: 'Music',
    events: [
      {
        name: 'Acoustic Jam Session',
        datetime: '2024-12-04 19:00:00-05:00',
        description: 'Bring your instruments or just your voice! Open mic style session for musicians of all levels.',
        cost: 0.00,
        numAttendees: 8
      }
    ]
  },
  // Art events
  {
    interest: 'Art',
    events: [
      {
        name: 'Watercolor Painting Workshop',
        datetime: '2024-12-02 15:00:00-05:00',
        description: 'Express your creativity with watercolors! All supplies provided. Create art while making new friends.',
        cost: 5.00,
        numAttendees: 7
      }
    ]
  },
  // Food events
  {
    interest: 'Food',
    events: [
      {
        name: 'Hands-On Cooking Class',
        datetime: '2024-11-26 17:00:00-05:00',
        description: 'Learn to cook healthy college meals on a budget. We\'ll make three different dishes together!',
        cost: 10.00,
        numAttendees: 6
      }
    ]
  },
  // Fitness events
  {
    interest: 'Fitness',
    events: [
      {
        name: 'Sunset Yoga Session',
        datetime: '2024-11-23 18:30:00-05:00',
        description: 'Wind down with a peaceful yoga session on the lawn. All levels welcome. Mats provided!',
        cost: 0.00,
        numAttendees: 7
      }
    ]
  },
  // Gaming events
  {
    interest: 'Gaming',
    events: [
      {
        name: 'Board Game Night Café',
        datetime: '2024-11-28 19:00:00-05:00',
        description: 'Discover new board games and connect with fellow strategists. Pizza and snacks provided!',
        cost: 0.00,
        numAttendees: 9
      }
    ]
  },
  // Reading events
  {
    interest: 'Reading',
    events: [
      {
        name: 'Cozy Book Club Gathering',
        datetime: '2024-11-29 16:00:00-05:00',
        description: 'This month we\'re reading "The Seven Husbands of Evelyn Hugo". Join us for discussion, tea, and literary conversations!',
        cost: 0.00,
        numAttendees: 8
      }
    ]
  },
  // Dance events
  {
    interest: 'Dance',
    events: [
      {
        name: 'Beginner Salsa Dance Workshop',
        datetime: '2024-11-30 20:00:00-05:00',
        description: 'Learn the basics of salsa dancing in a fun, no-pressure environment. No partner needed!',
        cost: 0.00,
        numAttendees: 11
      }
    ]
  },
  // Movies events
  {
    interest: 'Movies',
    events: [
      {
        name: 'Outdoor Movie Night: Studio Ghibli',
        datetime: '2024-12-01 19:30:00-05:00',
        description: 'Watch "Spirited Away" under the stars! Blankets and popcorn provided. Perfect for a chill evening.',
        cost: 0.00,
        numAttendees: 18
      }
    ]
  },
  // Travel events
  {
    interest: 'Travel',
    events: [
      {
        name: 'Spring Break Planning Meetup',
        datetime: '2024-12-05 18:00:00-05:00',
        description: 'Planning a trip for spring break? Join others looking for travel buddies and share tips for budget-friendly adventures!',
        cost: 0.00,
        numAttendees: 12
      }
    ]
  },
  // Photography events
  {
    interest: 'Photography',
    events: [
      {
        name: 'Photography Walk Around Campus',
        datetime: '2024-12-06 14:00:00-05:00',
        description: 'Explore GT campus with fellow photography enthusiasts. All skill levels welcome! Cameras provided if needed.',
        cost: 0.00,
        numAttendees: 6
      }
    ]
  }
];

async function populateEvents() {
  try {
    console.log('Populating events database...\n');
    
    for (const interestGroup of sampleEvents) {
      console.log(`Creating events for interest: ${interestGroup.interest}`);
      
      // Get or create the interest
      let { rows: interestRows } = await db.query(
        'SELECT iid FROM interests WHERE interest = $1',
        [interestGroup.interest]
      );
      
      let iid;
      if (interestRows.length === 0) {
        const result = await db.query(
          'INSERT INTO interests (interest) VALUES ($1) RETURNING iid',
          [interestGroup.interest]
        );
        iid = result.rows[0].iid;
        console.log(`  Created new interest: ${interestGroup.interest} (ID: ${iid})`);
      } else {
        iid = interestRows[0].iid;
        console.log(`  Found existing interest: ${interestGroup.interest} (ID: ${iid})`);
      }
      
      // Create events for this interest
      for (const event of interestGroup.events) {
        const { rows: eventRows } = await db.query(
          `INSERT INTO events (iid, name, datetime, description, cost, numAttendees)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING eid`,
          [iid, event.name, event.datetime, event.description, event.cost, event.numAttendees]
        );
        
        const eid = eventRows[0].eid;
        console.log(`    Created event: ${event.name} (ID: ${eid})`);
        
        // Link event to interest
        await db.query(
          'INSERT INTO interestevents (iid, eid) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [iid, eid]
        );
      }
    }
    
    console.log('\n✅ Events database populated successfully!');
    
    // Show summary
    const { rows: totalEvents } = await db.query('SELECT COUNT(*) as count FROM events');
    const { rows: totalInterests } = await db.query('SELECT COUNT(*) as count FROM interests');
    
    console.log(`\nSummary:`);
    console.log(`- Total interests: ${totalInterests[0].count}`);
    console.log(`- Total events: ${totalEvents[0].count}`);
    
  } catch (error) {
    console.error('Error populating events:', error);
  } finally {
    process.exit(0);
  }
}

populateEvents();
