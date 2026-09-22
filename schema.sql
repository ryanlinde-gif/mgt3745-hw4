-- schema.sql
-- One table, because the HW3 feature stores one kind of thing: a coach contact.
-- A second table is ADR-003 territory.
--
-- Column names use snake_case because that is the SQL convention; the SELECT in
-- worker.js aliases them back to the camelCase keys the page already expects,
-- so app.js needs no renaming.
CREATE TABLE IF NOT EXISTS entries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  coach_name   TEXT NOT NULL,
  school       TEXT NOT NULL,
  contact_date TEXT NOT NULL,
  status       TEXT NOT NULL,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
