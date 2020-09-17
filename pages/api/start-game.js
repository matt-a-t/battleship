import { v4 as uuidv4 } from 'uuid'
import { resolve } from 'path'
import sqlite3 from 'sqlite3';

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
        
        const newGameId = uuidv4();
    
        const query = `
          INSERT INTO games (game_id, player2joined, player1ready, player2ready, player_turn, player_won)
          VALUES ($newGameId, 0, 0, 0, 1, 0)
        `
        
        db.run(query, { $newGameId: newGameId }, err => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem creating the game.'});
            reject();
          } else {
            const shotsInsert = `
              INSERT INTO shots (game_id, player1_hits, player1_misses, player2_hits, player2_misses)
              VALUES ($newGameId, '', '', '', '')
            `
            db.run(shotsInsert, { $newGameId: newGameId }, err2 => {
              if (err2) {
                console.log(err2);
                res.status(500).json({ error: 'There was a problem creating the game.'});
                reject();
              } else {
                res.status(200).json({ newGameId });
                resolve();
                db.close();
              }
            });
          }
        });
      });
    default:
      res.status(404).end();
  }
}