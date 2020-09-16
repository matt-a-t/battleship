function TargetCell({ cell, rowIndex, cellIndex, cellClick }) {
  return (
    <div className="sheet-cell" onClick={() => cellClick(rowIndex, cellIndex)}>
      { cell === 'hit' && <div className="hit" /> }
      { cell === 'miss' && <div className="miss" /> }
    </div>
  )
}

export default TargetCell