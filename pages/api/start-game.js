import { v4 as uuidv4 } from 'uuid'
import { query } from '../../sql'

export default async (req, res) => {
  switch(req.method) {
    case 'POST':
      return new Promise((resolve, reject) => {
        const newGameId = uuidv4();
    
        const insertGames = `
          INSERT INTO games (game_id, player2joined, player1ready, player2ready, player_turn, player_won)
          VALUES ($1, false, false, false, 1, false)
        `
        
        query(insertGames, [newGameId], err => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem creating the game.'});
            reject();
          } else {
            const shotsInsert = `
              INSERT INTO shots (game_id, player1_hits, player1_misses, player2_hits, player2_misses)
              VALUES ($1, '', '', '', '')
            `
            query(shotsInsert, [newGameId], err2 => {
              if (err2) {
                console.log(err2);
                res.status(500).json({ error: 'There was a problem creating the game.'});
                reject();
              } else {
                res.status(200).json({ newGameId });
                resolve();
              }
            });
          }
        });
      });
    default:
      res.status(404).end();
  }
}