export type TeamColor = 'red' | 'blue' | 'green' | 'yellow';

export interface Team {
  id: TeamColor;
  name: string;
  colorHex: string;
  score: number;
  laps: number;
  position: number; // Índice da casa no tabuleiro (0 a N)
}

export type ChallengeCategory = 
  | 'geometria' 
  | 'algebra' 
  | 'operacoes' 
  | 'xadrez' 
  | 'damas' 
  | 'graficos';

export interface BaseQuestion {
  id: string;
  level: number;
  tags?: string[];
  category: string;
  title: string;
  statement: string;
  answer: string;
  explanation?: string;
  timeLimit: number;
  points: number;
}

export interface GeometryQuestion extends BaseQuestion {
  category: 'geometria';
  svgType: 'angle' | 'triangle' | 'rectangle' | 'circle';
  svgParams: Record<string, number | string>;
}

export interface ChessQuestion extends BaseQuestion {
  category: 'xadrez';
  fen: string; // Forsyth-Edwards Notation da posição
  solutionMove: string; // Exemplo: "Nxd5" ou "Qxf7#"
}

export interface StandardQuestion extends BaseQuestion {
  category: 'algebra' | 'operacoes' | 'damas' | 'graficos';
  formula?: string; // Expressão em LaTeX se necessário
}

export type Question = GeometryQuestion | ChessQuestion | StandardQuestion;

export interface BoardCell {
  id: number;
  title: string;
  category: ChallengeCategory | 'start' | 'bonus' | 'luck';
  description?: string;
}