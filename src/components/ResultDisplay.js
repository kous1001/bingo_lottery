import React from 'react';

const ResultDisplay = ({ chars, isDrawing, finalResult, charGroup, resultIndex, metaDatas}) => {
  // 判断字符是否仍在抽签中
  const isSpinning = (char, index) => {
    if (!isDrawing) return false; // 如果整体抽签已结束，不旋转
    // 检查当前字符是否与最终结果相同
    // return char !== finalResult[index];
    return true;
  };
  const familyNameLength = metaDatas[resultIndex][0]?.length;
  const depart = metaDatas[resultIndex][2]
  const bgColor = (depart === "ADM") ?  "#e2fa40" :
                  (depart === "ADV") ?  "#9F1E49" :
                  (depart === "FT") ?  "#ed73a7" :
                  (depart === "CS") ?  "#D0EF84" : "yellow";
                
  const familyChars = chars.slice(0, familyNameLength);
  const givenChars = chars.slice(familyNameLength);
  return (
    <div className="flex justify-center items-center">
      {/* Family Name Container */}
      <div className="flex flex-col items-center" style={{ height: `${90*2}px`}}>
        {/* Depart displayed only after drawing */}
        {!isDrawing && (
          <div
            style={{
              position: 'relative', // 👑を絶対配置で中央揃えするため
              width: '120px',
              height: '40px',
              background: `${bgColor}`,
              borderRadius: '15px',
              textAlign: 'center',
              lineHeight: '40px',
              fontSize: '1.2rem',
              marginBottom:"35px",
              fontWeight: 'bold',
            }}
          >
            {/* 👑アイコン */}
            <span
              style={{
                position: 'absolute', // 絶対配置
                top: '-37px', // departの上部に配置
                left: '50%',
                transform: 'translateX(-50%) scale(1.4)', // 中央揃え
                fontSize: '1.5rem',
              }}
            >
              👑
            </span>
            {/* depart文字列 */}
            <span>{depart}</span>
          </div>
        )}
        {/* Family name characters */}
        <div className={`flex ${!isDrawing ? 'familyNameContainer' : ''}`} style={{ position: 'relative', height: `${125}px`}}>
           {/* 読み方を表示する部分 */}
           {!isDrawing &&
                      <div
                      style={{
                        marginTop:'-3%',
                        position: 'absolute',
                        top: '-1.5rem', // 調整可能
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '1.2rem',
                        color: '#FF4040', // テキスト色
                        fontWeight: 'bold',
                      }}
                    >
                      {metaDatas[resultIndex][3].split('%')[0]}
                    </div>                           
                  }
          {familyChars.map((char, index) => {
            const adjustedIndex = Math.min(index, 2);
            return (
              <div
                className="slot-wrapper"
                key={index}
                style={{
                  transform: `scale(${isDrawing ? 2 : 1.2})`,
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
                  {/* <div className="slot-face left">抽</div>
                  <div className="slot-face right">選</div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
  
      {/* Given Name Container */}
      <div className="flex" style={{position: 'relative', height: `${90 * 2}px`}}>
         {/* 読み方を表示する部分 */}
         {!isDrawing &&
                      <div
                      style={{
                        marginTop:'-3.9%',
                        position: 'absolute',
                        top: '-1.5rem', // 調整可能
                        textAlign: 'center',
                        fontSize: '1.4rem',
                        color: '#FF4040', // テキスト色
                        fontWeight: 'bold',
                      }}
                    >
                      {metaDatas[resultIndex][3].split('%')[1]}
                    </div>                           
                  }
        {givenChars.map((char, index) => {
          const adjustedIndex = Math.min(index + familyNameLength - 1, 3);
          return (
            <div
              className="slot-wrapper"
              key={index}
              style={{
                transform: `scale(${isDrawing ? 2 : 2})`,
              }}
            >
              <div
                className={`slot-cube ${isSpinning(char, index+familyNameLength) ? 'spinning' : ''}`}
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
                {/* <div className="slot-face left">抽</div>
                <div className="slot-face right">選</div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultDisplay;