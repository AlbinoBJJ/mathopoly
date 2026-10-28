import React from 'react';
import { Chessboard } from 'react-chessboard';

interface ChessViewerProps {
  fen: string;
}

export const ChessViewer: React.FC<ChessViewerProps> = ({ fen }) => {
  return (
    <div className="w-full max-w-70 sm:max-w-[320px] mx-auto my-2 rounded-lg overflow-hidden border-2 border-slate-600 shadow-md pointer-events-none">
      <Chessboard
        options={{
          position: fen,
        }}
      />
    </div>
  );
};