import Axios from 'axios';
import TargetRow from './TargetRow'
import emptyBoard from '../data/emptyBoard';

function TargetSheet({ status, setWin, turn, checkTurn, setTurn, setSunkMessage }) {
  const [shots, setShots] = React.useState([]);
  const [targetBoard, setTargetBoard] = React.useState(emptyBoard);
  
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
    Axios.post('/api/fire', { rowIndex, cellIndex, gameid: status.gameId, player: status.player})
      .then(resp => {
        // https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig
        const newBoard = JSON.parse(JSON.stringify(targetBoard));
        if (resp.data.win) {
          setWin(true)
        }
        if (resp.data.hit) {
          newBoard[rowIndex][cellIndex] = 'hit'
        } else {
          newBoard[rowIndex][cellIndex] = 'miss'
        }

        if (resp.data.shipSunk) {
          setSunkMessage(`You sunk their ${resp.data.shipHit}`)
        } else {
          setSunkMessage('')
        }

        setTargetBoard(newBoard);
        setTurn(false)
        checkTurn();
      })
  }

  function cellClick(rowIndex, cellIndex) {
    if (turn && validateShot(rowIndex, cellIndex)) {
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