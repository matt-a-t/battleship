import React from 'react';

import PlayerCell from './PlayerCell';

function PlayerRow({ row, rowIndex, cellClick }) {
  return (
    <div className="sheet-row">
      {
        row.map((cell, i) => (
          <PlayerCell
            key={`${rowIndex}-${i}`}
            cell={cell}
            rowIndex={rowIndex}
            cellIndex={i}
            cellClick={cellClick}
          />
        ))
      }
    </div>
  );
}

export default PlayerRow;