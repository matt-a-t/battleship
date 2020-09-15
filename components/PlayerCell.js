import React from 'react';

import ShipPiece from './ShipPiece';

function PlayerCell({ cell, rowIndex, cellIndex, cellClick }) {
  return (
    <div className="sheet-cell" onClick={() => cellClick(rowIndex, cellIndex)}>
      {
        cell === 'ship' && <ShipPiece />
      }
    </div>
  );
}

export default PlayerCell;