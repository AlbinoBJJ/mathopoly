import React from 'react';
import type { Team, TeamColor } from '../../types';

interface ScoreBoardProps {
  teams: Team[];
  currentTurn: TeamColor;
  onUpdateScore: (teamId: TeamColor, delta: number) => void;
  onUpdateLaps: (teamId: TeamColor, delta: number) => void;
  onSelectTurn: (teamId: TeamColor) => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  teams,
  currentTurn,
  onUpdateScore,
  onUpdateLaps,
  onSelectTurn,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {teams.map((team) => {
        const isCurrentTurn = team.id === currentTurn;

        return (
          <div
            key={team.id}
            onClick={() => onSelectTurn(team.id)}
            className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              isCurrentTurn
                ? 'border-white scale-[1.01] shadow-md shadow-amber-500/20'
                : 'border-slate-700 opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: team.colorHex + '22', borderColor: team.colorHex }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-white text-xs">{team.name}</span>
              {isCurrentTurn && (
                <span className="bg-white text-slate-900 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  Vez
                </span>
              )}
            </div>

            <div className="text-lg font-black text-white mb-1.5">
              {team.score} <span className="text-[9px] font-normal text-slate-300">pts</span>
            </div>

            <div className="flex flex-col gap-1 border-t border-slate-700/50 pt-1.5 text-[10px] text-slate-300">
              <div className="flex justify-between items-center">
                <span>Voltas: {team.laps}</span>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onUpdateLaps(team.id, -1)}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-white font-bold cursor-pointer"
                    title="Diminuir volta"
                  >
                    -V
                  </button>
                  <button
                    onClick={() => onUpdateLaps(team.id, 1)}
                    className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-white font-bold cursor-pointer"
                    title="Adicionar volta"
                  >
                    +V
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
                <span className="text-slate-400">Pontos:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onUpdateScore(team.id, -50)}
                    className="px-1.5 py-0.5 bg-rose-900/60 hover:bg-rose-800 rounded text-white font-bold cursor-pointer"
                  >
                    -50
                  </button>
                  <button
                    onClick={() => onUpdateScore(team.id, 50)}
                    className="px-1.5 py-0.5 bg-emerald-700 hover:bg-emerald-600 rounded text-white font-bold cursor-pointer"
                  >
                    +50
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};