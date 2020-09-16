import Axios from 'axios';
import TargetRow from './TargetRow'

function TargetSheet({ status, setStatus, targetBoard, setTargetBoard }) {
  const [shots, setShots] = React.useState([]);
  
  function validateShot(rowIndex, cellIndex) {
    for (let i=0; i < shots.length; i++) {
      if (rowIndex === shots[i].rowIndex && cellIndex === shots[i].cellIndex) {
        return false;
      }
    }
    return true;
  }

  function fire(rowIndex, cellIndex) {
    setShots([...shots, { rowIndex, cellIndex }])
    Axios.post('/fire', { rowIndex, cellIndex, gameid: status.gameId, player: status.player})
      .then(resp => {
        const newBoard = [...targetBoard];
        if (resp.data.win) {
          setStatus({ ...status, win: true })
        }
        if (resp.data.hit) {
          newBoard[rowIndex][cellIndex] = 'hit'
        } else {
          newBoard[rowIndex][cellIndex] = 'miss'
        }

        setTargetBoard(newBoard);
      })
    const interval = setInterval(() => {
      Axios.get(`/api/player-turn?gameid=${status.gameId}`)
        .then(resp => {
          if (resp.data.lose) {
            setStatus({ ...status, lose: true })
          }
          if (resp.data.turn) {
            setStatus({ ...status, playerTurn: true })
          }
        })
    })
  }

  function cellClick(rowIndex, cellIndex) {
    if (status.playerTurn && validateShot(rowIndex, cellIndex)) {
      fire(rowIndex, cellIndex);
    }
  }

  return (
    <div className="sheet">
      {
        targetBoard.map((row, i) => {
          return (
            <TargetRow
              key={i}
              row={row}
              rowIndex={i}
              cellClick={cellClick}
            />
          )
        })
      }
    </div>
  );
}

export default TargetSheet;