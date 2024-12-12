import React from 'react';

const ResultDisplay = ({ chars, isDrawing, finalResult, charGroup, resultIndex, metaDatas}) => {
  // 判断字符是否仍在抽签中
  const isSpinning = (char, index) => {
    if (!isDrawing) return false; // 如果整体抽签已结束，不旋转
    // 检查当前字符是否与最终结果相同
    return char !== finalResult[index];
  };
  const givenNameLength = metaDatas[resultIndex][0].length;
  const depart = metaDatas[resultIndex][2]

  return (
    <div className="flex justify-center" style={{ height: `${90 * 2}px` }}>
    {chars.map((char, index) => {
      const adjustedIndex = Math.min(index, 3); // 4以上は3に制限
      return (
        <div
          key={index}
          className="slot-wrapper"
          style={{
            transform: 'scale(2)',
          }}
        >
          <div
            className={`slot-cube ${isSpinning(char, adjustedIndex) ? 'spinning' : ''}`}
          >
            <div className="slot-face front">{char || ' '}</div>
            <div className="slot-face back">
              {charGroup[adjustedIndex][Math.floor(Math.random() * charGroup[adjustedIndex].length)] || ' '}
            </div>
            <div className="slot-face top">
              {charGroup[adjustedIndex][Math.floor(Math.random() * charGroup[adjustedIndex].length)] || ' '}
            </div>
            <div className="slot-face bottom">
              {charGroup[adjustedIndex][Math.floor(Math.random() * charGroup[adjustedIndex].length)] || ' '}
            </div>
            <div className="slot-face left">抽</div>
            <div className="slot-face right">選</div>
          </div>
        </div>
      );
    })}
  </div>  
  );
};

export default ResultDisplay;