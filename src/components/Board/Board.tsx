import React, { useState } from 'react';
import type { Team } from '../../types';

interface BoardProps {
  teams: Team[];
  children?: React.ReactNode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

interface TokenPosition {
  x: number;
  y: number;
}

export const Board: React.FC<BoardProps> = ({ teams, children, isFullscreen, onToggleFullscreen }) => {
  const [tokenPositions, setTokenPositions] = useState<Record<string, TokenPosition>>({
    red: { x: 88, y: 88 },
    blue: { x: 92, y: 88 },
    green: { x: 88, y: 92 },
    yellow: { x: 92, y: 92 },
  });

  const [draggingTeam, setDraggingTeam] = useState<string | null>(null);

  const handleDragStart = (teamId: string) => {
    setDraggingTeam(teamId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingTeam) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTokenPositions((prev) => ({
      ...prev,
      [draggingTeam]: {
        x: Math.max(3, Math.min(97, x)),
        y: Math.max(3, Math.min(97, y)),
      },
    }));

    setDraggingTeam(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Barra de Ferramentas / Tela Cheia sutil */}
      <div className="w-full flex justify-between items-center mb-1 px-1 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 drop-shadow">
          Arraste os peões UNO sobre as casas
        </span>
        <button
          onClick={onToggleFullscreen}
          className="px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg border border-slate-700 transition-colors flex items-center gap-1 shadow z-30 cursor-pointer"
        >
          {isFullscreen ? '⤫ Sair da Tela Cheia' : '⤢ Tela Cheia'}
        </button>
      </div>

      {/* Tabuleiro Quadrado Maximizado na Altura da Tela */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="bg-slate-900 border-4 border-slate-700 rounded-3xl shadow-2xl relative overflow-hidden select-none bg-contain bg-no-repeat bg-center aspect-square h-[88vh] max-h-[88vh]"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}meu_tabuleiro.svg')`,
        }}
      >
        {/* Centro do Tabuleiro - Caixa de Dados Proporcional */}
        <div className="absolute inset-[15%] bg-slate-950/95 rounded-2xl border-2 border-slate-800 p-3 sm:p-4 flex flex-col justify-between items-center z-10 shadow-2xl backdrop-blur-md overflow-hidden">
          {children}
        </div>

        {/* Peões Arrastáveis */}
        {teams.map((team) => {
          const pos = tokenPositions[team.id] || { x: 50, y: 50 };

          return (
            <div
              key={team.id}
              draggable
              onDragStart={() => handleDragStart(team.id)}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-2xl cursor-grab active:cursor-grabbing z-20 flex items-center justify-center text-[10px] sm:text-xs font-black text-white transition-transform hover:scale-125 absolute"
              style={{
                backgroundColor: team.colorHex,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              title={`Arrastar peão ${team.name}`}
            >
              {team.name[0]}
            </div>
          );
        })}
      </div>
    </div>
  );
};