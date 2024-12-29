import { useState } from "react";
import { Piece, Position } from "../../../models";
import { PieceType, TeamType } from "../../../Types";
import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "../../../Constants";

const useCurrentMoves = () => {
  const [whiteMoves, setWhiteMoves] = useState<
    { Piece: PieceType; position: [string, string] }[]
  >([]);
  const [whiteCapturedMoves, setWhiteCapturedMoves] = useState<PieceType[]>([]);
  const [blackMoves, setBlackMoves] = useState<
    { Piece: PieceType; position: [string, string] }[]
  >([]);
  const [blackCapturedMoves, setBlackCapturedMoves] = useState<PieceType[]>([]);

  function storeUserMoves(
    destination: Position,
    playedPiece: Piece,
    capturedPiece?: Piece,
  ) {
    if (playedPiece.team === TeamType.OUR) {
      setWhiteMoves((previousMoves) => [
        ...previousMoves,
        {
          Piece: playedPiece.type,
          position: [
            HORIZONTAL_AXIS[destination.x],
            VERTICAL_AXIS[destination.y],
          ],
        },
      ]);
    } else {
      setBlackMoves((previousMoves) => [
        ...previousMoves,
        {
          Piece: playedPiece.type,
          position: [
            HORIZONTAL_AXIS[destination.x],
            VERTICAL_AXIS[destination.y],
          ],
        },
      ]);
    }
    if (capturedPiece !== undefined) {
      if (playedPiece.team === TeamType.OUR) {
        setWhiteCapturedMoves((previousMoves) => [
          ...previousMoves,
          capturedPiece.type,
        ]);
      } else {
        setBlackCapturedMoves((previousMoves) => [
          ...previousMoves,
          capturedPiece.type,
        ]);
      }
    }
  }
//   console.log(whiteMoves, blackMoves);
  return {
    whiteMoves,
    whiteCapturedMoves,
    blackMoves,
    blackCapturedMoves,
    storeUserMoves,
  };
};

export default useCurrentMoves;
