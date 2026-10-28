import React, { useState, useEffect, useRef } from 'react';
import type { Question } from '../../types';
import { ChessViewer } from './ChessViewer';
import { GeometryViewer } from './GeometryViewer';

interface ChallengeModalProps {
  question: Question;
  onClose: (awardedPoints: number) => void;
  isPensaRapido?: boolean;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({ question, onClose, isPensaRapido }) => {
  // Se for Pensa Rápido, o tempo é 15s, senão usa o tempo da questão
  const initialTime = isPensaRapido ? 15 : question.timeLimit;
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  // Instâncias de áudio
  const tickSound = useRef(new Audio('https://www.myinstants.com/media/sounds/clock-ticking-sound-effect.mp3'));
  const buzzerSound = useRef(new Audio('https://www.myinstants.com/media/sounds/wrong-answer-sound-effect.mp3'));

  useEffect(() => {
    tickSound.current.volume = 0.5;
    buzzerSound.current.volume = 1.0;
    
    // Limpa os áudios ao desmontar o componente
    return () => {
      tickSound.current.pause();
      buzzerSound.current.pause();
    };
  }, []);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        // Toca o tic-tac nos últimos 10 segundos
        if (newTime <= 10 && newTime > 0) {
          tickSound.current.play().catch(() => {});
        }
        
        // Quando zera
        if (newTime <= 0) {
          tickSound.current.pause();
          buzzerSound.current.play().catch(() => {});
          setShowAnswer(true); // Revela a resposta automaticamente
          setTimerActive(false);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleRevealAnswer = () => {
    setShowAnswer(true);
    setTimerActive(false);
    tickSound.current.pause();
  };

  const isTimeOut = timeLeft <= 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`bg-slate-800 border-4 w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col text-white relative transition-colors ${isTimeOut ? 'border-red-600' : 'border-slate-600'}`}>
        
        {isPensaRapido && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 font-black px-4 py-1 rounded-full animate-bounce">
            ⚡ PENSA RÁPIDO!
          </div>
        )}

        <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4 mt-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/30">
              {question.category}
            </span>
            <h2 className="text-xl font-bold mt-1">{question.title}</h2>
          </div>

          <div className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xl border ${
            timeLeft <= 10 && !isTimeOut ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse' : 
            isTimeOut ? 'bg-red-600 text-white border-red-800' : 'bg-slate-700 text-slate-200 border-slate-600'
          }`}>
            {isTimeOut ? 'ESGOTADO' : `⏱️ ${timeLeft}s`}
          </div>
        </div>

        <p className="text-xl font-medium text-slate-100 mb-6 text-center leading-relaxed">
          {question.statement}
        </p>

        {question.category === 'xadrez' && <ChessViewer fen={question.fen} />}
        {question.category === 'geometria' && <GeometryViewer svgType={question.svgType} svgParams={question.svgParams} />}

        {showAnswer ? (
          <div className="mt-2 p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-200">
            <h3 className="font-bold text-emerald-400 mb-1">Gabarito Oficial:</h3>
            <p className="text-2xl font-black text-white mb-2 text-center">{question.answer}</p>
            {question.explanation && (
              <p className="text-sm text-emerald-300/80 border-t border-emerald-800/50 pt-2 mt-2">
                <strong>Explicação:</strong> {question.explanation}
              </p>
            )}
          </div>
        ) : (
          <button onClick={handleRevealAnswer} className="mt-4 w-full py-3 bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-xl font-bold text-amber-400 transition-colors text-lg">
            🔍 Revelar Gabarito
          </button>
        )}

        <div className="grid grid-cols-2 gap-3 mt-6 pt-3 border-t border-slate-700">
          <button onClick={() => onClose(0)} className="py-3 bg-rose-600/80 hover:bg-rose-600 text-white font-bold rounded-xl text-lg">
            ❌ Errou (+0)
          </button>
          <button onClick={() => onClose(question.points)} className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-lg">
            ✅ Acertou (+{question.points})
          </button>
        </div>
      </div>
    </div>
  );
};