CREATE TABLE games (
  game_id TEXT PRIMARY KEY,
  player2joined INTEGER,
  player1ready INTEGER,
  player2ready INTEGER,
  player_turn INTEGER,
  player_won INTEGER,
);

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

CREATE TABLE shots (
  game_id INTEGER,
  player1_hits TEXT,
  player1_misses TEXT,
  player2_hits TEXT,
  player2_misses TEXT,
  FOREIGN KEY (game_id) REFERENCES games (game_id)
      ON DELETE CASCADE ON UPDATE NO ACTION
);