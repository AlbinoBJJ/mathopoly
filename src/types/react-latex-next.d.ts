declare module 'react-latex-next' {
  import * as React from 'react';
  export interface LatexProps {
    children?: string;
    delimiters?: Array<{ left: string; right: string; display: boolean }>;
  }
  export default class Latex extends React.Component<LatexProps> {}
}