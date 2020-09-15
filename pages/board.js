import React from 'react';

import GameStatus from '../components/GameStatus';
import TargetSheet from '../components/TargetSheet';
import PlayerSheet from '../components/PlayerSheet';
import emptyBoard from '../data/emptyBoard';
import initialStatus from '../data/initialStatus';
import ships from '../data/ships';

function Board() {
  const [status, setStatus] = React.useState(initialStatus);
  const [playerBoard, setPlayerBoard] = React.useState(emptyBoard);

  function validatePlacement(rowIndex, cellIndex, shipSize, direction) {
    switch (direction) {
      case 'up':
        if (rowIndex - shipSize < -1) { return false; }
        break;
      case 'right':
        if (cellIndex + shipSize > 10) { return false; }
        break;
      case 'down':
        if (rowIndex + shipSize > 10) { return false; }
        break;
      case 'left':
        if (cellIndex - shipSize < -1) { return false; }
        break;
      default:
        console.error('invalid direction passed to validatePlacement')
    }

    const { placement } = status;
    const shipIds = Object.keys(placement);
    // loop through placed ships to determine if spot is valid
    for (let i=0; i < shipIds.length; i++) {
      if (typeof placement[shipIds[i]] !== 'undefined') {
        for (let j=0; j < placement[shipIds[i]].length; j++) {
          if (typeof placement[shipIds[i]][j] !== 'undefined' && typeof placement[shipIds[i]][j] !== 'undefined') {
            for (let k=0; k < shipSize; k++) {
              switch (direction) {
                case 'up':
                  if (rowIndex - k === placement[shipIds[i]][j].rowIndex && cellIndex === placement[shipIds[i]][j].cellIndex) {
                    return false;
                  }
                  break;
                case 'right':
                  if (rowIndex === placement[shipIds[i]][j].rowIndex && cellIndex + k === placement[shipIds[i]][j].cellIndex) {
                    return false;
                  }
                  break;
                case 'down':
                  if (rowIndex + k === placement[shipIds[i]][j].rowIndex && cellIndex === placement[shipIds[i]][j].cellIndex) {
                    return false;
                  }
                  break;
                case 'left':
                  if (rowIndex === placement[shipIds[i]][j].rowIndex && cellIndex - k === placement[shipIds[i]][j].cellIndex) {
                    return false;
                  }
                  break;
                default:
                  break;
              }
              if (rowIndex === placement[shipIds[i]][j].rowIndex && cellIndex === placement[shipIds[i]][j].cellIndex) {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  function placeShip(rowIndex, cellIndex, direction, ship) {
    for (let i=0; i < ship.size; i++) {
      switch (direction) {
        case 'up':
          placeShipPiece(rowIndex - i, cellIndex, ship.id);
          break;
        case 'right':
          placeShipPiece(rowIndex, cellIndex + i, ship.id);
          break;
        case 'down':
          placeShipPiece(rowIndex + i, cellIndex, ship.id);
          break;
        case 'left':
          placeShipPiece(rowIndex, cellIndex - i, ship.id);
          break;
        default:
          break;
      }
    }
  }

  function removeShip(ship) {
    status.placement[ship].map(cell => {
      removeShipPiece(cell.rowIndex, cell.cellIndex, ship);
      return null;
    });
    const newPlacement = { ...status.placement };
    
    newPlacement[ship] = [];
    setStatus({ ...status, placement: newPlacement })
  }

  function placementError(ship) {
    setStatus({...status, message: `Error placing ${ship}`, error: true });
  }

  function placeShipPiece(rowIndex, cellIndex, shipId) {
    const newBoard = [...playerBoard];
    newBoard[rowIndex][cellIndex] = 'ship';
    setPlayerBoard(newBoard);

    const newPlacement = { ...status.placement };
    newPlacement[shipId].push({ rowIndex, cellIndex });
    setStatus({ ...status, placement: newPlacement })
  }

  function removeShipPiece(rowIndex, cellIndex, ship) {
    const newBoard = [...playerBoard];
    newBoard[rowIndex][cellIndex] = 'empty';
    setPlayerBoard(newBoard);
  }

  function cellClick(rowIndex, cellIndex) {
    const { currentlyPlacing, placementDirection, placement } = status;
    const isValid = validatePlacement(rowIndex, cellIndex, ships[currentlyPlacing].size, placementDirection)
    if (isValid) {
      if (placement[currentlyPlacing]) {
        removeShip(currentlyPlacing);
      }
      placeShip(rowIndex, cellIndex, placementDirection, ships[currentlyPlacing])
    } else {
      console.log('error')
      placementError(ships[currentlyPlacing].name);
    }
  }

  return (
    <div>
      <GameStatus status={status} setStatus={setStatus} />
      <div id="game-boards">
        <PlayerSheet
          setStatus={setStatus}
          playerBoard={playerBoard}
          cellClick={cellClick}
        />
        <TargetSheet />
      </div>
    </div>
  )
}

export default Board;