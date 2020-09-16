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
        );

        const query = 'select player2joined from games where game_id=$gameId'

        db.get(query, { $gameId: req.query.gameid }, (err, row) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem reading the database' });
            reject();
          } else {
            res.status(200).json({ joined: (row.player2joined === 1) })
            resolve()
          }
        });

        db.close();
      });
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

          const query = 'UPDATE games set player2joined = 1 where game_id=$gameId';

          db.run(query, { $gameId: req.body.gameid }, err => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: 'There was a problem updating the database' });
              reject();
            } else {
              res.status(204).end();
              resolve();
            }
          })
        })
    default:
      res.status(404).end()
  }
}