import { query } from '../../sql'

export default async (req, res) => {
  switch(req.method) {
    case 'POST':
      return new Promise((resolve, reject) => {
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
          WHERE game_id = $1
        `

        query(placementQuery, [req.body.gameid], (err, resp) => {
          const row = resp.rows[0]
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
              SELECT ${hit ? hitsField : missField} FROM shots WHERE game_id = $1 
            `

            query(shotsQuery, [req.body.gameid], (err2, resp2) => {
              const row2 = resp2.rows[0]
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
                      if (hitSplit[j].trim() === wholeShip[i].trim()) {
                        numHits++
                      }
                    }
                  }
                }
                
                let shipSunk = false;
                if (numHits === wholeShip.length) {
                  shipSunk = true;
                }

                const updateShots = `
                  UPDATE shots
                  SET ${hit ? hitsField : missField} = '${hit ? row2[hitsField] : row2[missField]} | ${req.body.rowIndex} ${req.body.cellIndex}'
                  WHERE game_id = $1
                `;

                query(updateShots, [req.body.gameid], (err3) => {
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
                  WHERE game_id = $1
                `;

                query(updateTurn, [req.body.gameid], (err4) => {
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