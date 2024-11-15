import React from 'react';

const ResultDisplay = ({ item, isDrawing }) => {
  return (
    <div className="result-display text-center bg-white shadow-lg">
      {isDrawing ? (
        <div className="text-center text-5xl font-bold animate-flip">{item}</div> 
      ) : item ? (
        <div className="text-center text-5xl font-bold bounce-animation">{item}</div>
      ) : (
        '抽選待ち'
      )}
    </div>
  );
};

export default ResultDisplay;
