import React, { useState } from 'react';
import { Chess } from 'chess.js';

const Chessboard = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });

  const renderSquare = (i) => {
    const file = 'abcdefgh'[i % 8];
    const rank = 8 - Math.floor(i / 8);
    const square = file + rank;
    const piece = game.get(square);
    const isBlack = (i + Math.floor(i / 8)) % 2 === 1;
    const isSelected = selectedSquare === square;
    const isLegalMove = legalMoves.includes(square);

    return (
      <div
        key={i}
        onClick={() => handleSquareClick(square)}
        className={`square ${isBlack ? 'black' : 'white'} ${isSelected ? 'selected' : ''} ${isLegalMove ? 'legal' : ''}`}
      >
        {piece ? getPieceUnicode(piece) : ''}
      </div>
    );
  };

  const handleSquareClick = (square) => {
    if (selectedSquare) {
      if (legalMoves.includes(square)) {
        const move = game.move({ from: selectedSquare, to: square });
        if (move) {
          // Update captured pieces
          if (move.captured) {
            setCapturedPieces((prev) => ({
              ...prev,
              [move.color]: [...prev[move.color], move.captured],
            }));
          }
          setGame(new Chess(game.fen())); // Update the game state
        }
      }
      setSelectedSquare(null); // Deselect after move
      setLegalMoves([]); // Clear legal moves
    } else {
      setSelectedSquare(square); // Select square
      const moves = game.moves({ square, verbose: true }).map(move => move.to);
      setLegalMoves(moves); // Set legal moves
    }
  };

  const getPieceUnicode = (piece) => {
    const pieceMap = {
      p: '♟',
      r: '♜',
      n: '♞',
      b: '♝',
      q: '♛',
      k: '♚',
      P: '♙',
      R: '♖',
      N: '♘',
      B: '♗',
      Q: '♕',
      K: '♔',
    };
    return pieceMap[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
  };

  const renderCapturedPieces = (color) => {
    return capturedPieces[color].map((piece, index) => (
      <span key={index} className="captured-piece">
        {getPieceUnicode({ type: piece, color })}
      </span>
    ));
  };

  return (
    <div className="chess-container">
      <div className="chessboard">
        {[...Array(64)].map((_, i) => renderSquare(i))}
      </div>
      <div className="captured-pieces">
        <div>
          <h3>White</h3>
          <div>{renderCapturedPieces('w')}</div>
        </div>
        <div>
          <h3>Black</h3>
          <div>{renderCapturedPieces('b')}</div>
        </div>
      </div>
    </div>
  );
};

export default Chessboard;
