import React from 'react';

const ResultDisplay = ({ chars, isDrawing }) => {
  return (
    <div className="flex justify-center space-x-30">
      {chars.map((char, index) => (
        <div
          key={index}
          className={`text-2xl text-center font-semibold border rounded bg-white shadow-lg flex items-center justify-center ${
            isDrawing && !char ? 'animate-flip' : !isDrawing ? 'bounce-animation' : ''
          }`}
          style={{
            width: '90px',
            height: '90px',
            transform: 'scale(2)',
            transition: 'transform 0.5s',
          }}
        >
          {char || ' '}
        </div>
      ))}
    </div>
  );
};

export default ResultDisplay;
