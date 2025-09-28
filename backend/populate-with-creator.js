require('dotenv').config();
const db = require('./db');
const { planEventRow } = require('./eventCreator');

async function getInterests() {
  const { rows } = await db.query('SELECT iid, interest FROM interests ORDER BY interest');
  return rows;
}

async function existingEvents() {
  const { rows } = await db.query('SELECT eid, name, datetime FROM events');
  return rows;
}

function similarName(a, b) {
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const A = new Set(norm(a).split(' '));
  const B = new Set(norm(b).split(' '));
  const inter = [...A].filter(x => B.has(x)).length;
  const uni = new Set([...A, ...B]).size || 1;
  return inter / uni;
}

async function insertEvent(iid, row) {
  const { rows } = await db.query(
    `INSERT INTO events (iid, name, datetime, description, cost, numAttendees)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING eid`,
    [iid, row.name, row.datetime, row.description, row.cost, row.numAttendees]
  );
  const eid = rows[0].eid;
  await db.query('INSERT INTO interestevents (iid, eid) VALUES ($1,$2) ON CONFLICT DO NOTHING', [iid, eid]);
  return eid;
}

async function populate() {
  console.log('[populate] loading interests...');
  const interests = await getInterests();
  const existing = await existingEvents();

  if (!interests.length) {
    console.log('[populate] no interests found. Run the interests seeder first.');
    process.exit(1);
  }

  console.log(`[populate] found ${interests.length} interests`);

  // For each interest, plan an event and insert it. Use Promise.all to parallelize.
  const promises = interests.map(async ({ iid, interest }) => {
    try {
      console.log(`[populate] planning event for interest: ${interest}`);
      // planEventRow expects existing events array (with name/datetime) to avoid conflicts
      const existingForCreator = existing.map(e => ({ name: e.name, datetime: e.datetime }));
      const row = await planEventRow(interest, []);

      // crude duplicate detection: skip if very similar name already exists
      const isDup = existing.some(e => similarName(e.name, row.name) > 0.7);
      if (isDup) {
        console.log(`[populate] skipping duplicate-ish event: ${row.name}`);
        return null;
      }

      const eid = await insertEvent(iid, row);
      console.log(`[populate] inserted event ${row.name} -> eid=${eid}`);
      return eid;
    } catch (e) {
      console.error(`[populate] failed for interest ${interest}:`, e && e.message ? e.message : e);
      return null;
    }
  });

  const results = await Promise.all(promises);
  const inserted = results.filter(Boolean);
  console.log(`[populate] finished. inserted ${inserted.length} events.`);
  process.exit(0);
}

populate().catch(e => { console.error(e); process.exit(1); });

async function getAllInterests() {
  const { rows } = await db.query('SELECT iid, interest FROM interests ORDER BY interest');
  return rows;
}

async function getExistingEventsForInterest(iid) {
  const { rows } = await db.query(
    `SELECT e.eid, e.name, e.datetime FROM events e JOIN interestevents ie ON e.eid = ie.eid WHERE ie.iid = $1`,
    [iid]
  );
  return rows;
}

async function insertEvent(iid, row) {
  const { rows } = await db.query(
    `INSERT INTO events (iid, name, datetime, description, cost, numAttendees)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING eid`,
    [iid, row.name, row.datetime, row.description, row.cost, row.numAttendees]
  );
  const eid = rows[0].eid;
  await db.query('INSERT INTO interestevents (iid, eid) VALUES ($1, $2) ON CONFLICT DO NOTHING', [iid, eid]);
  return eid;
}

async function populate() {
  try {
    console.log('Fetching interests...');
    const interests = await getAllInterests();
    if (!interests.length) {
      console.log('No interests found. Please seed interests first.');
      process.exit(1);
    }

    // For each interest, plan one or more events
    const tasks = interests.map(async (interestRow) => {
      const iid = interestRow.iid;
      const interest = interestRow.interest;
      console.log(`Preparing events for interest: ${interest}`);

      const existing = await getExistingEventsForInterest(iid);
      const existingSimple = existing.map(e => ({ name: e.name, datetime: e.datetime }));

      // generate a single event row for this interest (could be expanded)
      try {
        const planned = await planEventRow(interest, []);
        // check for near-duplicates by name
        const duplicate = existing.some(e => String(e.name).toLowerCase().trim() === String(planned.name).toLowerCase().trim());
        if (duplicate) {
          console.log(`  Skipping duplicate event: ${planned.name}`);
          return null;
        }

        const eid = await insertEvent(iid, planned);
        console.log(`  Inserted event (${eid}): ${planned.name}`);
        return eid;
      } catch (err) {
        console.error(`  Failed to plan/insert event for interest ${interest}:`, err.message || err);
        return null;
      }
    });

    const results = await Promise.all(tasks);
    const created = results.filter(Boolean).length;
    console.log(`Finished. Created ${created} new events.`);
  } catch (err) {
    console.error('Error populating with creator:', err);
  } finally {
    process.exit(0);
  }
}

populate();
