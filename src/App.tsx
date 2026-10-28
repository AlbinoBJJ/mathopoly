import React, { useState, useRef, useEffect } from 'react';
import type { Team, TeamColor, Question } from './types';
import { Board } from './components/Board/Board';
import { ScoreBoard } from './components/Controls/ScoreBoard';
import { DiceRoller } from './components/Controls/DiceRoller';
import { ChallengeModal } from './components/Cards/ChallengeModal';
import questionsData from './data/questions.json';

const INITIAL_TEAMS: Team[] = [
  { id: 'red', name: 'Vermelho', colorHex: '#ED1C24', score: 0, laps: 0, position: 0 },
  { id: 'blue', name: 'Azul', colorHex: '#0055A5', score: 0, laps: 0, position: 0 },
  { id: 'green', name: 'Verde', colorHex: '#22B14C', score: 0, laps: 0, position: 0 },
  { id: 'yellow', name: 'Amarelo', colorHex: '#FFC90E', score: 0, laps: 0, position: 0 },
];

export const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [currentTurn, setCurrentTurn] = useState<TeamColor>('red');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(5);
  const [lastDiceSum, setLastDiceSum] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Novos estados para gerenciamento de perguntas e Pensa Rápido
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [isPensaRapidoAtivo, setIsPensaRapidoAtivo] = useState(false);
  
  const appRef = useRef<HTMLDivElement>(null);
  const questions: Question[] = questionsData as Question[];

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!appRef.current) return;
    if (!document.fullscreenElement) {
      appRef.current.requestFullscreen().catch((err) => {
        alert(`Erro ao tentar modo tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const nextTurn = () => {
    const order: TeamColor[] = ['red', 'blue', 'green', 'yellow'];
    setCurrentTurn(order[(order.indexOf(currentTurn) + 1) % order.length]);
    setLastDiceSum(null);
  };

  const handleDiceRolled = (total: number) => {
    setLastDiceSum(total);
  };

  const triggerCategoryChallenge = (category: string) => {
    const available = questions.filter(
      (q) =>
        q.level === selectedLevel &&
        q.category === category &&
        !usedQuestions.includes(q.id)
    );

    if (available.length === 0) {
      alert("As perguntas deste nível e categoria acabaram! O histórico será resetado.");
      setUsedQuestions([]);
      return;
    }

    const chosen = available[Math.floor(Math.random() * available.length)];
    setUsedQuestions([...usedQuestions, chosen.id]);
    setIsPensaRapidoAtivo(false);
    setActiveQuestion(chosen);
  };

  // Função para Desafios Especiais (Pensa Rápido e Desafio Geral)
  const triggerSpecialChallenge = (type: 'pensa_rapido' | 'desafio_geral') => {
    const levelToSearch = type === 'pensa_rapido' ? 1 : selectedLevel;
    
    const available = questions.filter(
      (q) => q.level === levelToSearch && !usedQuestions.includes(q.id)
    );
    
    if (available.length === 0) {
      alert("Perguntas esgotadas. Resetando histórico...");
      setUsedQuestions([]);
      return;
    }

    const chosen = available[Math.floor(Math.random() * available.length)];
    setUsedQuestions([...usedQuestions, chosen.id]);
    setIsPensaRapidoAtivo(type === 'pensa_rapido');
    setActiveQuestion(chosen);
  };

  // Mecânica de Sorte ou Revés interativa
  const handleSorteReves = () => {
    const isSorte = Math.random() > 0.5;
    if (isSorte) {
      alert("🍀 SORTE!\n\nAvance 2 casas ou ganhe 50 pontos extras!");
    } else {
      const defender = confirm(
        "☠️ REVÉS!\n\nPerca 50 pontos ou tente um DESAFIO PARA SE DEFENDER!\nDeseja tentar a defesa resolvendo uma questão de 1 nível ACIMA?"
      );
      if (defender) {
        const nextLevel = Math.min(selectedLevel + 1, 9);
        const available = questions.filter(
          (q) => q.level === nextLevel && !usedQuestions.includes(q.id)
        );
        if (available.length > 0) {
          const chosen = available[Math.floor(Math.random() * available.length)];
          setUsedQuestions([...usedQuestions, chosen.id]);
          setIsPensaRapidoAtivo(false);
          setActiveQuestion(chosen);
        } else {
          alert("Não há perguntas de nível superior disponíveis. Você escapou do revés!");
        }
      }
    }
  };

  return (
    <div 
      ref={appRef} 
      className={`min-h-screen bg-slate-950 text-slate-100 p-2 font-sans flex flex-col justify-between overflow-x-hidden ${isFullscreen ? 'h-screen overflow-y-auto' : ''}`}
    >
      {/* Grid de 3 Colunas Ocupando 100% da Largura da Tela */}
      <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-center my-auto flex-1 px-1">
        
        {/* COLUNA ESQUERDA (lg:col-span-3) - Placar Vertical */}
        <div className="lg:col-span-3 flex flex-col gap-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-800 pb-1.5">
            Placar e Turnos
          </h2>
          <ScoreBoard
            teams={teams}
            currentTurn={currentTurn}
            onUpdateScore={(id, d) => setTeams((p) => p.map((t) => (t.id === id ? { ...t, score: t.score + d } : t)))}
            onUpdateLaps={(id, d) => setTeams((p) => p.map((t) => (t.id === id ? { ...t, laps: Math.max(0, t.laps + d) } : t)))}
            onSelectTurn={(id) => setCurrentTurn(id)}
          />
        </div>

        {/* COLUNA CENTRAL (lg:col-span-6) - Tabuleiro Quadrado Gigante */}
        <div className="lg:col-span-6 flex justify-center items-center w-full">
          <Board 
            teams={teams} 
            isFullscreen={isFullscreen} 
            onToggleFullscreen={toggleFullscreen}
          >
            <div className="text-center flex flex-col items-center gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Vez da Equipe
              </span>
              <div
                className="px-4 py-1 rounded-full text-xs font-black border shadow-md"
                style={{
                  backgroundColor: teams.find((t) => t.id === currentTurn)?.colorHex + '33',
                  borderColor: teams.find((t) => t.id === currentTurn)?.colorHex,
                  color: '#ffffff',
                }}
              >
                {teams.find((t) => t.id === currentTurn)?.name} {lastDiceSum ? `(Andou ${lastDiceSum})` : ''}
              </div>
            </div>

            <DiceRoller onDiceRolled={handleDiceRolled} />
          </Board>
        </div>

        {/* COLUNA DIREITA (lg:col-span-3) - Nível e Desafios nas Sobras */}
        <div className="lg:col-span-3 flex flex-col gap-3 max-h-[92vh] overflow-y-auto">
          
          {/* Card de Identidade e Nível / Pontuação */}
<div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl flex flex-col gap-3">
  <div className="flex items-center gap-2.5 border-b border-slate-800 pb-2.5">
    <span className="text-2xl">🎲</span>
    <div>
      <h1 className="text-base font-black text-amber-400 tracking-wider">
        MATHOPOLY
      </h1>
      <p className="text-[10px] text-slate-400">Ambiente Interativo</p>
    </div>
  </div>

  <div className="flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
    <label className="text-xs font-bold text-slate-300 uppercase">Dificuldade (Pontos):</label>
    <select
      value={selectedLevel}
      onChange={(e) => setSelectedLevel(Number(e.target.value))}
      className="bg-slate-900 text-amber-400 text-xs font-bold py-1 px-2 rounded-lg border border-slate-600 focus:outline-none cursor-pointer"
    >
      {[
        { level: 1, pts: 25 },
        { level: 2, pts: 50 },
        { level: 3, pts: 75 },
        { level: 4, pts: 100 },
        { level: 5, pts: 125 },
        { level: 6, pts: 150 },
        { level: 7, pts: 200 },
        { level: 8, pts: 250 },
        { level: 9, pts: 300 },
      ].map((item) => (
        <option key={item.level} value={item.level}>
          Perguntas de {item.pts} pts
        </option>
      ))}
    </select>
  </div>
</div>

          {/* Casas do Tabuleiro (Categorias) */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase text-center border-b border-slate-800 pb-2">
              Casas do Tabuleiro
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button onClick={() => triggerCategoryChallenge('operacoes')} className="py-2 bg-amber-950 hover:bg-amber-900 text-amber-100 text-[10px] font-bold rounded border border-amber-800/50">
                ➕ Operações
              </button>
              <button onClick={() => triggerCategoryChallenge('fracoes')} className="py-2 bg-sky-900 hover:bg-sky-800 text-sky-100 text-[10px] font-bold rounded border border-sky-800/50">
                🍕 Frações
              </button>
              <button onClick={() => triggerCategoryChallenge('geometria')} className="py-2 bg-red-900 hover:bg-red-800 text-red-100 text-[10px] font-bold rounded border border-red-800/50">
                📐 Geometria
              </button>
              <button onClick={() => triggerCategoryChallenge('algebra')} className="py-2 bg-purple-900 hover:bg-purple-800 text-purple-100 text-[10px] font-bold rounded border border-purple-800/50">
                🧮 Álgebra
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-2">
              <button 
                onClick={() => triggerSpecialChallenge('pensa_rapido')} 
                className="py-2.5 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider cursor-pointer"
              >
                ⏱️ Pensa Rápido (Lvl 1)
              </button>
              <button 
                onClick={() => handleSorteReves()} 
                className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-lg text-xs uppercase tracking-wider cursor-pointer"
              >
                🃏 Sorte ou Revés
              </button>
              <button 
                onClick={() => triggerSpecialChallenge('desafio_geral')} 
                className="py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-black rounded-lg text-xs uppercase tracking-wider shadow-rose-900/50 shadow-lg cursor-pointer"
              >
                ⚔️ Desafio Geral (Todos!)
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Modal de Desafio */}
      {activeQuestion && (
        <ChallengeModal
          question={activeQuestion}
          isPensaRapido={isPensaRapidoAtivo}
          onClose={(pts) => {
            if (pts > 0) {
              setTeams((p) => p.map((t) => (t.id === currentTurn ? { ...t, score: t.score + pts } : t)));
            }
            setActiveQuestion(null);
            nextTurn();
          }}
        />
      )}
    </div>
  );
};

export default App;