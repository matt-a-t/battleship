import { query } from '../../sql'

export default async (req, res) => {
  switch(req.method) {
    case 'GET':
      return new Promise((resolve, reject) => {
        const selectGames = 'select game_id from games where game_id=$1 and player1ready = 1 and player2ready = 1'

        query(selectGames, [req.query.gameid], (err, resp) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem with the query' });
            reject();
          } else {
            if (resp.rows[0]) { res.status(200).json( { ready: true }); resolve(); }
            else { res.status(200).json( {ready: false }); resolve(); }
          }
        })
      });
    case 'POST':
      return new Promise((resolve, reject) => {
        let readyField = '';
        let placementTable = '';
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
        const readyQuery = `UPDATE games set ${readyField}= 1 where game_id=$1`;
        
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

        query(readyQuery, [req.body.game_id], err => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem updating the game' });
            reject();
          }
        });

        query(placementQuery, [req.body.game_id]), err => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem updating the game' });
            reject();
          }
        }
        
        res.status(204).end();
        resolve();
      });
      default:
        res.status(404).end();
  }
}