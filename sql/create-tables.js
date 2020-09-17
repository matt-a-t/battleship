const sqlite3 = require('sqlite3');
const sql = sqlite3.verbose();

const createGames = `
  CREATE TABLE games (
    game_id TEXT PRIMARY KEY,
    player2joined INTEGER,
    player1ready INTEGER,
    player2ready INTEGER,
    player_turn INTEGER,
    last_shot TEXT,
    player_won INTEGER
  );
`;

const createP1Placements = `
  CREATE TABLE player1_placements (
    game_id INTEGER,
    carrier TEXT,
    battleship TEXT,
    destroyer TEXT,
    submarine TEXT,
    patrolboat TEXT,
    FOREIGN KEY (game_id) REFERENCES games (game_id)
        ON DELETE CASCADE ON UPDATE NO ACTION
  );
`;

const createP2Placements = `
  CREATE TABLE player2_placements (
    game_id INTEGER,
    carrier TEXT,
    battleship TEXT,
    destroyer TEXT,
    submarine TEXT,
    patrolboat TEXT,
    FOREIGN KEY (game_id) REFERENCES games (game_id)
        ON DELETE CASCADE ON UPDATE NO ACTION
  );
`;

const createShipStatus = `
  CREATE TABLE ship_status (
    game_id INTEGER,
    player1_carrier TEXT,
    player1_battleship TEXT,
    player1_destroyer TEXT,
    player1_submarine TEXT,
    player1_patrolboat TEXT,
    player2_carrier TEXT,
    player2_battleship TEXT,
    player2_destroyer TEXT,
    player2_submarine TEXT,
    player2_patrolboat TEXT,
    FOREIGN KEY (game_id) REFERENCES games (game_id)
        ON DELETE CASCADE ON UPDATE NO ACTION
  );
`
const createShots = `
  CREATE TABLE shots (
    game_id INTEGER,
    player1_hits TEXT,
    player1_misses TEXT,
    player2_hits TEXT,
    player2_misses TEXT,
    FOREIGN KEY (game_id) REFERENCES games (game_id)
        ON DELETE CASCADE ON UPDATE NO ACTION
  );
`;

const queryArray = [createGames, createP1Placements, createP2Placements, createShipStatus, createShots]

const db = new sql.Database('./sql/battleship.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE ,  err => {
  if (err) {
    return console.error(err)
  } else {
    for (let i=0; i < queryArray.length; i++) {
      db.run(queryArray[i], (err2) => {
        if (err2) {
          console.error(err2);
        } else {
        }
      })
    }
    console.log('Created database and tables')
  }
})
