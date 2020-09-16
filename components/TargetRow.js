import TargetCell from './TargetCell'

function TargetRow({ row, rowIndex, cellClick }) {
  return (
    <div className="sheet-row">
      {
        row.map((cell, i) => (
          <TargetCell
            key={`${rowIndex}-${i}`}
            cell={cell}
            rowIndex={rowIndex}
            cellIndex={i}
            cellClick={cellClick}
          />
        ))
      }
    </div>
  )
}

export default TargetRow