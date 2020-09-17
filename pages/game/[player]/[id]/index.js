import { useRouter } from 'next/router'

import GameStatus from '../../../../components/GameStatus';
import TargetSheet from '../../../../components/TargetSheet';
import PlayerSheet from '../../../../components/PlayerSheet';
import initialStatus from '../../../../data/initialStatus';
import emptyBoard from '../../../../data/emptyBoard';
import Axios from 'axios';

function Board() {
  const router = useRouter();
  const [status, setStatus] = React.useState(initialStatus);
  const [lose, setLose] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [turn, setTurn] = React.useState(false);
  const [sunkMessage, setSunkMessage] = React.useState('');
  const [playerBoard, setPlayerBoard] = React.useState(emptyBoard);

  React.useEffect(() => {
    setStatus({ ...status, gameId: router.query.id, player: router.query.player })
    if (router.query.player === '2') {
      Axios.post('/api/check-player2-joined', { gameid: router.query.id });
    }
  }, [router.query.id, router.query.player])

  function checkTurn() {
    const interval = setInterval(() => {
      Axios.get(`/api/player-turn?gameid=${status.gameId}&player=${status.player}`)
        .then(resp => {
          if (resp.data.lose) {
            clearInterval(interval)
            setLose(true)
          }
          if (resp.data.turn) {
            setTurn(true)
            clearInterval(interval)
            if (resp.data.lastShot) {
              const shotArray = resp.data.lastShot.split(' ')
              const rowIndex = shotArray[0]
              const cellIndex = shotArray[1]
              // https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig
              const newBoard = JSON.parse(JSON.stringify(playerBoard));
              
              if (newBoard[rowIndex][cellIndex] === 'ship') {
                newBoard[rowIndex][cellIndex] = 'hit'
              } else {
                newBoard[rowIndex][cellIndex] = 'miss'
              }
              setPlayerBoard(newBoard);
            }
          }
        })
    }, 5000)
  }

  return (
    <div>
      <GameStatus 
        status={status} 
        setStatus={setStatus}
        lose={lose}
        win={win}
        turn={turn}
        checkTurn={checkTurn}
        player={router.query.player}
        sunkMessage={sunkMessage}
      />
      <div id="game-boards">
        <PlayerSheet
          status={status}
          setStatus={setStatus}
          playerBoard={playerBoard}
          setPlayerBoard={setPlayerBoard}
        />
        <TargetSheet
          status={status}
          setWin={setWin}
          turn={turn}
          checkTurn={checkTurn}
          setTurn={setTurn}
          setSunkMessage={setSunkMessage}
        />
      </div>
    </div>
  )
}

export default Board;