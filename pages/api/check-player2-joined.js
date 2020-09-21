import { query } from '../../sql'

export default async (req, res) => {
  switch(req.method) {
    case 'GET':
      return new Promise((resolve, reject) => {
        const checkJoin = 'select player2joined from games where game_id=$1'

        query(checkJoin, [req.query.gameid], (err, resp) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'There was a problem reading the database' });
            reject();
          } else {
            res.status(200).json({ joined: (resp.rows[0].player2joined) })
            resolve()
          }
        });
      });
    case 'POST':
      return new Promise((resolve, reject) => {
        const updateGames = 'UPDATE games set player2joined = true where game_id=$1';

        query(updateGames, [req.body.gameid], err => {
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