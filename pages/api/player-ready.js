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

        const query = 'select game_id from games where game_id=$gameId and player1ready = 1 and player2ready = 1'

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

        let readyField = '';
        let placementTable = '';
        // console.log(req.body.placement);
        if (req.body.player === "1") { 
          readyField = 'player1ready'
          placementTable =  'player1_placements'
        }
        else if (req.body.player === "2") { 
          readyField = 'player2ready'
          placementTable = 'player2_placements'
        }
        else {
          res.status(400).json({ error: 'You must specify a player number' });
          reject();
        }
        const readyQuery = `UPDATE games set ${readyField}= 1 where game_id=$gameId`;
        
        const { placement } = req.body;
        const placementQuery = `
          INSERT INTO ${placementTable} (game_id, carrier, battleship, destroyer, submarine, patrolboat)
          VALUES (
            $gameId,
            '${ placement.carrier.map(c => (`${c.rowIndex} ${c.cellIndex}`)).join('|')}',
            '${ placement.battleship.map(c => (`${c.rowIndex} ${c.cellIndex}`)).join('|')}',
            '${ placement.destroyer.map(c => (`${c.rowIndex} ${c.cellIndex}`)).join('|')}',
            '${ placement.submarine.map(c => (`${c.rowIndex} ${c.cellIndex}`)).join('|')}',
            '${ placement.patrolboat.map(c => (`${c.rowIndex} ${c.cellIndex}`)).join('|')}'

          )
        `;

        db.run(readyQuery, { $gameId: req.body.game_id }, err => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem updating the game' });
            reject();
          }
        });

        db.run(placementQuery, { $gameId: req.body.game_id }), err => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem updating the game' });
            reject();
          }
        }

        db.close();

        res.status(204).end();
        resolve();
      });
      default:
        res.status(404).end();
  }
}