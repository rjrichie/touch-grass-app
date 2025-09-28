-- Drop in dependency order (safe re-run)
DROP TABLE IF EXISTS eventtags CASCADE;
DROP TABLE IF EXISTS interestevents CASCADE;
DROP TABLE IF EXISTS usertags CASCADE;
DROP TABLE IF EXISTS userinterests CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id             BIGSERIAL PRIMARY KEY,
  first          TEXT NOT NULL,
  last           TEXT NOT NULL,
  email          TEXT UNIQUE NOT NULL,
  password       TEXT NOT NULL,
  totalSeen      INTEGER NOT NULL DEFAULT 0,
  totalAccepted  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Interests
CREATE TABLE IF NOT EXISTS interests (
  iid          BIGSERIAL PRIMARY KEY,
  interest     TEXT NOT NULL,
  numUsers     INTEGER NOT NULL DEFAULT 0,
  minAttendees INTEGER NOT NULL DEFAULT 8,
  numEvents    INTEGER NOT NULL DEFAULT 0
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  tid       BIGSERIAL PRIMARY KEY,
  tag       TEXT NOT NULL,
  numUsers  INTEGER NOT NULL DEFAULT 0
);

-- Events (FK type must match referenced PK type -> BIGINT)
CREATE TABLE IF NOT EXISTS events (
  eid           BIGSERIAL PRIMARY KEY,
  iid           BIGINT REFERENCES interests(iid) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  datetime      TIMESTAMPTZ NOT NULL,
  description   TEXT NOT NULL,
  cost          NUMERIC(5,2),
  numAttendees  INTEGER NOT NULL DEFAULT 0
);

-- User ↔ Interest (many-to-many)
CREATE TABLE IF NOT EXISTS userinterests (
  uid  BIGINT REFERENCES users(id) ON DELETE CASCADE,
  iid  BIGINT REFERENCES interests(iid) ON DELETE CASCADE,
  PRIMARY KEY (uid, iid)
);
CREATE INDEX IF NOT EXISTS idx_userinterests_iid ON userinterests(iid);

-- User ↔ Tag (many-to-many)
CREATE TABLE IF NOT EXISTS usertags (
  uid  BIGINT REFERENCES users(id) ON DELETE CASCADE,
  tid  BIGINT REFERENCES tags(tid) ON DELETE CASCADE,
  PRIMARY KEY (uid, tid)
);
CREATE INDEX IF NOT EXISTS idx_usertags_tid ON usertags(tid);

-- Interest ↔ Event (one-to-many as a link table — optional if events.iid is enough)
CREATE TABLE IF NOT EXISTS interestevents (
  iid BIGINT REFERENCES interests(iid) ON DELETE CASCADE,
  eid BIGINT REFERENCES events(eid) ON DELETE CASCADE,
  PRIMARY KEY (iid, eid)
);
CREATE INDEX IF NOT EXISTS idx_interestevents_eid ON interestevents(eid);

-- Event ↔ Tag (many-to-many)
CREATE TABLE IF NOT EXISTS eventtags (
  eid BIGINT REFERENCES events(eid) ON DELETE CASCADE,
  tid BIGINT REFERENCES tags(tid) ON DELETE CASCADE,
  PRIMARY KEY (eid, tid)
);
CREATE INDEX IF NOT EXISTS idx_eventtags_tid ON eventtags(tid);
