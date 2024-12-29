import { useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import { Piece, Position } from "../../models";
import { Board } from "../../models/Board";
import { Pawn } from "../../models/Pawn";
// import {
//   bishopMove,
//   kingMove,
//   knightMove,
//   pawnMove,
//   queenMove,
//   rookMove,
// } from "../../referee/rules";
import { PieceType, TeamType } from "../../Types";
import Chessboard from "../Chessboard/Chessboard";
import { Howl } from "howler";
import MovesHistory from "./components/MovesHistory/MovesHistory";
import useCurrentMoves from "./hooks/useCurrentMoves";
import "./Referee.css";
const moveSound = new Howl({
  src: ["/sounds/move-self.mp3"],
});

const captureSound = new Howl({
  src: ["/sounds/capture.mp3"],
});

const checkmateSound = new Howl({
  src: ["/sounds/move-check.mp3"],
});

export default function Referee() {
  const [board, setBoard] = useState<Board>(initialBoard.clone());
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);
  const checkmateModalRef = useRef<HTMLDivElement>(null);
  const { whiteMoves, blackMoves, storeUserMoves } = useCurrentMoves();
  // Function to play a move
  // It plays a move on the board
  // It also sets the board state to the new board state
  // It also plays a sound if the move is valid
  // It also sets the checkmate modal to show if the move is a checkmate
  // It also sets the promotion modal to show if the move is a promotion
  // It also sets the promotion pawn to the piece that is being promoted
  function playMove(playedPiece: Piece, destination: Position): boolean {
    // console.log(playedPiece, destination);
    // If the playing piece doesn't have any moves return
    if (playedPiece.possibleMoves === undefined) return false;

    // Prevent the inactive team from playing
    if (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1)
      return false;
    if (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0)
      return false;

    let playedMoveIsValid = false;

    const validMove = playedPiece.possibleMoves?.some((m) =>
      m.samePosition(destination)
    );

    if (!validMove) return false;

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    // If the destination is the same as the initial position of a piece then the piece is captured
    const capturedPiece = board.pieces.find((p) => p.samePosition(destination));
    
    // playMove modifies the board thus we
    // need to call setBoard
    setBoard(() => {
      const clonedBoard = board.clone();
      clonedBoard.totalTurns += 1;
      // Playing the move
      playedMoveIsValid = clonedBoard.playMove(
        enPassantMove,
        validMove,
        playedPiece,
        destination
      );
      debugger;

      if(capturedPiece) {
        captureSound.play();
      }
      else if (playedMoveIsValid) {
        moveSound.play();
      }
     

      if (clonedBoard.winningTeam !== undefined) {
        checkmateModalRef.current?.classList.remove("hidden");
        checkmateSound.play();
      }

      return clonedBoard;
    });

    // This is for promoting a pawn
    let promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;

    // If the destination is the promotion row and the piece is a pawn
    if (destination.y === promotionRow && playedPiece.isPawn) {
      modalRef.current?.classList.remove("hidden");
      setPromotionPawn((previousPromotionPawn) => {
        const clonedPlayedPiece = playedPiece.clone();
        clonedPlayedPiece.position = destination.clone();
        return clonedPlayedPiece;
      });
    }
    // console.log(playedMoveIsValid, playedPiece, destination);
    if (playedMoveIsValid) {
      storeUserMoves(destination, playedPiece, capturedPiece);
    }
    return playedMoveIsValid;
  }
  // Create the function which store the user's moves in  n x 2 array each row[0] is white move and row[1] is black move store the move in this standard format like e4, q4, e5, q5, qxe4, kxqe4 etc.
  // which i'll call in playMove function if it's a valid move

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = board.pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.isPawn &&
            (p as Pawn).enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  //TODO
  //Add stalemate!
  // function isValidMove(
  //   initialPosition: Position,
  //   desiredPosition: Position,
  //   type: PieceType,
  //   team: TeamType
  // ) {
  //   let validMove = false;
  //   switch (type) {
  //     case PieceType.PAWN:
  //       validMove = pawnMove(
  //         initialPosition,
  //         desiredPosition,
  //         team,
  //         board.pieces
  //       );
  //       break;
  //     case PieceType.KNIGHT:
  //       validMove = knightMove(
  //         initialPosition,
  //         desiredPosition,
  //         team,
  //         board.pieces
  //       );
  //       break;
  //     case PieceType.BISHOP:
  //       validMove = bishopMove(
  //         initialPosition,
  //         desiredPosition,
  //         team,
  //         board.pieces
  //       );
  //       break;
  //     case PieceType.ROOK:
  //       validMove = rookMove(
  //         initialPosition,
  //         desiredPosition,
  //         team,
  //         board.pieces
  //       );
  //       break;
  //     case PieceType.QUEEN:
  //       validMove = queenMove(
  //         initialPosition,
  //         desiredPosition,
  //         team,
  //         board.pieces
  //       );
  //       break;
  //     case PieceType.KING:
  //       validMove = kingMove(
  //         initialPosition,
  //         desiredPosition,
  //         team,
  //         board.pieces
  //       );
  //   }

  //   return validMove;
  // }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

    setBoard((previousBoard) => {
      const clonedBoard = board.clone();
      clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(promotionPawn)) {
          results.push(
            new Piece(piece.position.clone(), pieceType, piece.team, true)
          );
        } else {
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);

      clonedBoard.calculateAllMoves();

      return clonedBoard;
    });

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.OUR ? "w" : "b";
  }

  function restartGame() {
    checkmateModalRef.current?.classList.add("hidden");
    setBoard(initialBoard.clone());
  }

  return (
    <div
      className={`container ${
        board.totalTurns % 2 === 1 ? "bg-white" : "bg-black"
      }`}
    >
      {/* put this div and MovesHistory in a flex column */}
      <div className="" >
        <p
          className={board.totalTurns % 2 === 1 ? "color-black" : "color-white"}
          style={{
            fontSize: "24px",
            textAlign: "center",
            paddingBlock: "1rem",
            marginBlock: "0",
          }}
        >
          {board.totalTurns % 2 === 1 ? "White's turn" : "Black's turn"}
        </p>
        <div className="modal hidden" ref={modalRef}>
          <div className="modal-body">
            <img
              onClick={() => promotePawn(PieceType.ROOK)}
              src={`/assets/images/rook_${promotionTeamType()}.png`}
              alt="rook"
            />
            <img
              onClick={() => promotePawn(PieceType.BISHOP)}
              src={`/assets/images/bishop_${promotionTeamType()}.png`}
              alt="bishop"
            />
            <img
              onClick={() => promotePawn(PieceType.KNIGHT)}
              src={`/assets/images/knight_${promotionTeamType()}.png`}
              alt="knight"
            />
            <img
              onClick={() => promotePawn(PieceType.QUEEN)}
              src={`/assets/images/queen_${promotionTeamType()}.png`}
              alt="queen"
            />
          </div>
        </div>
        <div className="modal hidden" ref={checkmateModalRef}>
          <div className="modal-body">
            <div className="checkmate-body">
              <span>
                The winning team is{" "}
                {board.winningTeam === TeamType.OUR ? "white" : "black"}!
              </span>
              <button onClick={restartGame}>Play again</button>
            </div>
          </div>
        </div>

        <Chessboard playMove={playMove} pieces={board.pieces} />
      </div>
      <MovesHistory whiteMoves={whiteMoves} blackMoves={blackMoves} />
    </div>
  );
}
