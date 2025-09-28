require("dotenv").config();
const db = require('./db.js');
const eventCreator = require("./eventCreator.js");

(async () => {
    const row = await eventCreator.planEventRow("hiking", [{
        name: 'Casual hiking meetup @ Atlantic Station',
        datetime: '2025-09-27T11:40:20.702-04:00',
        description: 'Meetup: Casual hiking meetup at Atlantic Station. Address: 1380 Atlantic Dr NW, Atlanta, GA 30363. Expect about $12 per person. We will meet near the entrance. If you need a ride, coordinate in chat.',
        cost: 12,
        numAttendees: 0
    }]);
    console.log(row);
})();