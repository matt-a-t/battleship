import sqlite3 from 'sqlite3';
import { resolve } from 'path'
const sql = sqlite3.verbose();
const filePath = resolve('sql/battleship.db');

export default async (req, res) => {
  switch(req.method) {
    case 'GET':
      return new Promise((resolve, reject) => {
        var db = new sql.Database(
          filePath,
          sqlite3.OPEN_READONLY,
          err => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: 'There was a problem connecting to the database.' });
              reject();
            }
          }
        )

        const query = 'select player_turn, player_won, last_shot from games where game_id=$gameId'

        db.get(query, { $gameId: req.query.gameid }, (err, row) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem with the query' });
            reject();
          } else {
            let turn = false;
            let lose = false;
            if (row.player_turn === parseInt(req.query.player)) {
              turn = true;
            }
            if (row.player_won !== 0 && row.player_won !== parseInt(req.query.player)) {
              lose = true;
            }

            res.status(200).json({ turn, lose, lastShot: row.last_shot })
            resolve();
          }
        })
      })
  }
}