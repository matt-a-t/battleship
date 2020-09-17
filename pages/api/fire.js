import sqlite3 from 'sqlite3';
import { resolve } from 'path'
const sql = sqlite3.verbose();
const filePath = resolve('sql/battleship.db');

export default async (req, res) => {
  switch(req.method) {
    case 'POST':
      return new Promise((resolve, reject) => {
        const db = new sql.Database(
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
        let hitsField = '';
        let missField = '';
        let playerTurn = '0';
        if (req.body.player === "1") { 
          placementTable = 'player2_placements';
          hitsField = 'player1_hits';
          missField = 'player1_misses';
          playerTurn = '2'
        }
        else if (req.body.player === "2") { 
          placementTable = 'player1_placements';
          hitsField = 'player2_hits';
          missField = 'player2_misses';
          playerTurn = '1'
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
            let hit = false;
            let shipHit = '';
            let wholeShip = [];
            const ships = Object.keys(row);
            for (let i=0; i < ships.length; i++) {
              let shipSplit = row[ships[i]].split('|');
              for (let j=0; j < shipSplit.length; j++) {
                if (shipSplit[j] === `${req.body.rowIndex} ${req.body.cellIndex}`) {
                  hit = true;
                  shipHit = ships[i];
                  wholeShip = shipSplit;
                }
              }
            }

            const shotsQuery = `
              SELECT ${hit ? hitsField : missField} FROM shots WHERE game_id = $gameId 
            `

            db.get(shotsQuery, { $gameId: req.body.gameid }, (err2, row2) => {
              if (err2) {
                console.log(err2);
                res.status(500).json({ error: 'There was a problem with the query' });
                reject();
              } else {
                let numHits = 1;
                if (hit) {
                  const hitSplit = row2[hitsField].split('|');
                  for (let i=0; i < wholeShip.length; i++) {
                    for (let j=0; j < hitSplit.length; j++) {
                      console.log(hitSplit[j])
                      console.log(wholeShip[i])
                      if (hitSplit[j].trim() === wholeShip[i].trim()) {
                        numHits++
                      }
                    }
                  }
                }
                
                console.log(numHits)
                let shipSunk = false;
                if (numHits === wholeShip.length) {
                  shipSunk = true;
                }

                const updateShots = `
                  UPDATE shots
                  SET ${hit ? hitsField : missField} = '${hit ? row2[hitsField] : row2[missField]} | ${req.body.rowIndex} ${req.body.cellIndex}'
                  WHERE game_id = $gameId
                `;

                db.run(updateShots, { $gameId: req.body.gameid }, (err3) => {
                  if (err3) {
                    console.log(err3);
                    res.status(500).json({ error: 'There was a problem with the query' });
                    reject();
                  }
                })

                // 17 hits to win
                let win = false;
                if (hit && row2[hitsField].split('|').length === 17) {
                  win = true;
                }

                const updateTurn = `
                  UPDATE games 
                  SET player_turn = ${playerTurn}, last_shot = '${req.body.rowIndex} ${req.body.cellIndex}'  
                  WHERE game_id = $gameId
                `;

                db.run(updateTurn, { $gameId: req.body.gameid }, (err4) => {
                  if (err4) {
                    console.log(err4);
                    res.status(500).json({ error: 'There was a problem with the query' });
                    reject();
                  }
                })

                if (shipSunk) {
                  res.status(200).json({ hit, win, shipSunk, shipHit })
                } else {
                  res.status(200).json({ hit, win })
                  resolve();
                }
              }
            })
          }
        })
      })
    default:
      res.status(404).end()
  }
}