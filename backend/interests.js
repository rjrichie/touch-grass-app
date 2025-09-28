require("dotenv").config();
const db = require("./db.js");

(async () => {
  try {
    const interests = [
      "Sports",
      "Gaming",
      "Music",
      "Art",
      "Technology",
      "Food",
      "Movies",
      "Fitness",
      "Reading",
      "Travel",
      "Photography",
      "Dance"
    ];

    for (const interest of interests) {
      await db.query(
        `INSERT INTO interests (interest) VALUES ($1)`,
        [interest]
      );
    }

    console.log("✅ Interests seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding interests:", err);
  } finally {
    db.pool.end();
  }
})();
