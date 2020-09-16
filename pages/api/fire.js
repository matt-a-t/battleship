import sqlite3 from 'sqlite3';
import { resolve } from 'path'
const sql = sqlite3.verbose();
const filePath = resolve('sql/battleship.db');

export default async (req, res) => {
  switch(req.method) {
    case 'POST':
      return new Promise((resolve, reject) => {
        var db = new sql.Database(
          filePath,
          sqlite3.OPEN_READWRITE,
          err => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: 'There was a problem connecting to the database.' });
              reject();
            }
          }
        );

        let placementTable = '';
        if (req.body.player === "1") { 
          placementTable = 'player2_placements';
        }
        else if (req.body.player === "2") { 
          placementTable = 'player1_placements';
        }
        else {
          res.status(400).json({ error: 'You must specify a player number' });
          reject();
        }

        const placementQuery = `
          SELECT carrier, battleship, destroyer, submarine, patrolboat 
          FROM ${placementTable}
          WHERE game_id = $gameId
        `

        db.get(placementQuery, { $gameId: req.body.gameid }, (err, row) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem with the query' });
            reject();
          } else {
            console.log(row);
          }
        })
      })
    default:
      res.status(404).end()
  }
}