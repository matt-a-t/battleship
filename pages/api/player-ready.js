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

        const query = 'select game_id from games where game_id=$gameId'

        db.get(query, { $gameId: req.query.gameid }, (err, row) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem with the query' });
            reject();
          } else {
            if (row) { res.status(200).json( { ready: true }); resolve(); }
            else { res.status(200).json( {ready: false }); resolve(); }
          }
        })
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

        let query = '';
        if (req.body.player === "1") { 
          query = 'UPDATE games set player1ready = 1 where game_id=$gameId'
        }
        else if (req.body.player === "2") { 
          query = `UPDATE games set player2ready = 1 where game_id=$gameId`
        }
        else {
          res.status(400).json({ error: 'You must specify a player number' });
          reject();
        }

        db.run(query, { $gameId: req.body.game_id }, err => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem updating the game' });
            reject();
          } else {
            res.status(204).end();
            resolve();
          }
        });

        db.close();
      });
      default:
        res.status(404).end();
  }
}