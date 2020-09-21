import { query } from '../../sql'

export default async (req, res) => {
  switch(req.method) {
    case 'GET':
      return new Promise((resolve, reject) => {
        const selectGames = 'select player_turn, player_won, last_shot from games where game_id=$1'

        query(selectGames, [req.query.gameid], (err, resp) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem with the query' });
            reject();
          } else {
            const row = resp.row[0];
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