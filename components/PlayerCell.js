function PlayerCell({ cell, rowIndex, cellIndex, cellClick }) {
  return (
    <div className="sheet-cell" onClick={() => cellClick(rowIndex, cellIndex)}>
      {
        cell === 'ship' && <div className="ship-piece" />
      }
      {
        cell === 'miss' && <div className="marker miss" />
      }
      {
        cell === 'hit' && <div className="ship-piece"><div className="marker hit" /></div>
      }
    </div>
  );
}

export default PlayerCell;