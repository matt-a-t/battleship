import { useRouter } from 'next/router'

import GameStatus from '../../../../components/GameStatus';
import TargetSheet from '../../../../components/TargetSheet';
import PlayerSheet from '../../../../components/PlayerSheet';
import emptyBoard from '../../../../data/emptyBoard';
import initialStatus from '../../../../data/initialStatus';
import Axios from 'axios';

function Board() {
  const router = useRouter();
  const [status, setStatus] = React.useState(initialStatus);

  React.useEffect(() => {
    setStatus({ ...status, gameId: router.query.id, player: router.query.player })
    if (router.query.player === '2') {
      Axios.post('/api/check-player2-joined', { gameid: router.query.id });
    }
  }, [router.query.id, router.query.player])

  const [playerBoard, setPlayerBoard] = React.useState(emptyBoard);
  const [targetBoard, setTargetBoard] = React.useState(emptyBoard);

  return (
    <div>
      <GameStatus status={status} setStatus={setStatus} />
      <div id="game-boards">
        <PlayerSheet
          status={status}
          setStatus={setStatus}
          playerBoard={playerBoard}
          setPlayerBoard={setPlayerBoard}
        />
        <TargetSheet 
          status={status}
          setStatus={setStatus}
          targetBoard={targetBoard}
          setTargetBoard={setTargetBoard}
        />
      </div>
    </div>
  )
}

export default Board;