import React, { useState } from 'react';

interface DiceRollerProps {
  onDiceRolled: (total: number) => void;
}

const DICE_DOTS: Record<number, string> = {
  1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅',
};

export const DiceRoller: React.FC<DiceRollerProps> = ({ onDiceRolled }) => {
  const [dice1, setDice1] = useState<number>(1);
  const [dice2, setDice2] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    let rolls = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      rolls++;

      if (rolls >= 12) {
        clearInterval(interval);
        const final1 = Math.floor(Math.random() * 6) + 1;
        const final2 = Math.floor(Math.random() * 6) + 1;
        setDice1(final1);
        setDice2(final2);
        setIsRolling(false);
        onDiceRolled(final1 + final2);
      }
    }, 70);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto">
      <div className="flex gap-4 mb-3">
        <div
          onClick={rollDice}
          className={`w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl shadow-2xl border-4 border-slate-300 cursor-pointer select-none transition-transform ${
            isRolling ? 'animate-bounce' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {DICE_DOTS[dice1]}
        </div>
        <div
          onClick={rollDice}
          className={`w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl shadow-2xl border-4 border-slate-300 cursor-pointer select-none transition-transform ${
            isRolling ? 'animate-bounce' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {DICE_DOTS[dice2]}
        </div>
      </div>

      <button
        onClick={rollDice}
        disabled={isRolling}
        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider disabled:opacity-50"
      >
        {isRolling ? 'Rolando Dados...' : `Rolar Dados (${dice1 + dice2})`}
      </button>
    </div>
  );
};