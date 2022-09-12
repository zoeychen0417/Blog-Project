const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPromise = sqlite.open({
    filename: "./group-project.db",
    driver: sqlite3.Database,
});
module.exports = dbPromise;