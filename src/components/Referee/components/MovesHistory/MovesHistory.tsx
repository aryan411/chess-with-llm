import { PieceType } from "../../../../Types";
import "./MovesHistory.css";

const MovesHistory = ({
  whiteMoves,
  blackMoves,
}: {
  whiteMoves: { Piece: PieceType; position: [string, string] }[];
  blackMoves: { Piece: PieceType; position: [string, string] }[];
}) => {
  return (
    <div className="movesContainer">
      <table className="movesTable">
        <thead className="tableHeader">
          <tr>
            <th className="headerCell">#</th>
            <th className="headerCell">White</th>
            <th className="headerCell">Black</th>
          </tr>
        </thead>
        <tbody>
          {whiteMoves.map((whiteMove, index) => {
            const blackMove = blackMoves[index];
            return (
              <tr key={index} className={`tableRow ${index % 2 === 0 ? 'evenRow' : ''}`}>
                <td className="tableCell">{index + 1}.</td>
                <td className="tableCell">{`${whiteMove.Piece[0]} ${whiteMove.position[0]}${whiteMove.position[1]}`}</td>
                <td className="tableCell">
                  {blackMove && `${blackMove.Piece[0]} ${blackMove.position[0]}${blackMove.position[1]}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MovesHistory;
