import React from 'react';

interface GeometryViewerProps {
  svgType: string;
  svgParams: Record<string, number | string>;
}

export const GeometryViewer: React.FC<GeometryViewerProps> = ({ svgType, svgParams }) => {
  if (svgType === 'angle') {
    const angleA = Number(svgParams.angleA) || 50;
    const labelX = String(svgParams.labelX || 'X');

    return (
      <div className="flex justify-center my-3 bg-slate-900 p-4 rounded-lg border border-slate-700">
        <svg width="240" height="120" viewBox="0 0 240 120" className="text-white">
          {/* Linha de base */}
          <line x1="20" y1="100" x2="220" y2="100" stroke="#94a3b8" strokeWidth="3" />
          {/* Vértice central */}
          <circle cx="120" cy="100" r="4" fill="#f59e0b" />
          
          {/* Linha inclinada representando o ângulo */}
          <line x1="120" y1="100" x2="180" y2="30" stroke="#f59e0b" strokeWidth="3" />

          {/* Arco do ângulo conhecido */}
          <path d="M 150 100 A 30 30 0 0 0 140 77" fill="none" stroke="#22c55e" strokeWidth="2" />
          <text x="155" y="85" fill="#22c55e" fontSize="12" fontWeight="bold">
            {angleA}°
          </text>

          {/* Arco do ângulo desconhecido (X) */}
          <path d="M 140 77 A 30 30 0 0 0 90 100" fill="none" stroke="#ef4444" strokeWidth="2" />
          <text x="95" y="75" fill="#ef4444" fontSize="14" fontWeight="bold">
            {labelX}
          </text>
        </svg>
      </div>
    );
  }

  return null;
};