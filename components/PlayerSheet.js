import React from 'react';

import PlayerRow from './PlayerRow';

function PlayerSheet({ setStatus, playerBoard, cellClick }) {
  return (
    <div className="sheet">
      {
        playerBoard.map((row, i) => {
          return (
            <PlayerRow
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

export default PlayerSheet;