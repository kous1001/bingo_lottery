import React, { useState, useEffect } from 'react';
import ResultDisplay from './ResultDisplay';
import UsedList from './UsedList';
import InputDrawer from './InputDrawer';
import '../App.css';
import confetti from 'canvas-confetti';
import NotificationCard from './NotificationCard';

const LotteryApp = () => {
  const [items, setItems] = useState([]);
  const [metaDatas, setMetaDatas] = useState([]);
  const [resultIndex, setResultIndex] = useState(0);
  const [charGroup, setChatGroup] = useState([]);
  const [selectedChars, setSelectedChars] = useState([]);
  const [usedItems, setUsedItems] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWaiting, setShowWaiting] = useState(true);
  const [bonusPoints, setBonusPoints] = useState([]);
  const [drawCount, setDrawCount] = useState(0); // 抽選回数を追跡
  const [notificationMessage, setNotificationMessage] = useState(null); // お知らせメッセージ
  const [finalChars, setFinalChars] = useState([]); // 添加新的 state

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false); // 退出全屏时，恢复显示全屏按钮
      }
    };

    // 监听全屏变化事件
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 持续显示 confetti 当 items 为空
  useEffect(() => {
    let confettiInterval = null;
    if (items.length === 0) {
      confettiInterval = setInterval(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 2000);
    }
    return () => {
      if (confettiInterval) clearInterval(confettiInterval);
    };
  }, [items]);
  
  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true); // 设置为全屏状态
    }
  };

  const handleAddItems = (newItems) => {
    if (!newItems || newItems.length === 0) return; // newItemsが空の場合は何もしない

    // 重複しないアイテムをフィルタリング
    const filteredItems = newItems.filter(item => (!items.includes(item) && !usedItems.some(([key, value]) => key === item)));

    // 必要な場合のみ状態を更新
    if (filteredItems.length > 0) {
      setItems([...items, ...filteredItems]); // 現在のitemsに新しいアイテムを追加
    }

    setIsDrawerOpen(false); // ドロワーを閉じる
  };

  // function getMaxStringLength(array) {
  //   // 配列の要素を1つずつ確認し、文字列の長さの最大値を求める
  //   return array.reduce((maxLength, str) => {
  //     return Math.max(maxLength, str.length);
  //   }, 0); // 初期値は0
  // }

  function groupCharactersByIndex(array) {
    const result = [];
    
    // 配列の各要素を1文字ずつ処理
    array.forEach((str) => {
      for (let i = 0; i < str.length; i++) {
        // `result` の長さが不足している場合は空の配列を追加
        if (!result[i]) {
          result[i] = [];
        }
        // 各文字を適切なグループに追加
        result[i].push(str[i]);
      }
    });
  
    return result;
  }

  const updatePossibleChars = () => {
    setChatGroup(groupCharactersByIndex(items));
  }
  const findPersonIndex = (arr, name) =>  arr?.findIndex(item => item[0] + item[1] === name);
  const handleDraw = () => {
    if (isDrawing || items.length === 0) return;
    setShowWaiting(false); // 点击「スタート」后隐藏「抽選待ち」
    setIsDrawing(true);
    
    // ボーナスポイントチェック
    const previousBonus = bonusPoints.find((bp) => bp.round === drawCount);
    const bonus = bonusPoints.find((bp) => bp.round === drawCount + 1);
    const upcomingBonus = bonusPoints.find((bp) => bp.round === drawCount + 2);
  
    //get char from items
    updatePossibleChars();    
    const drawItems = bonus ? bonus.items : items;
    const randomItem = drawItems[Math.floor(Math.random() * drawItems.length)];
    //inspect index of randomItem and pass it to the resultDisplay Component
    setResultIndex(findPersonIndex(metaDatas, randomItem));
    const charArray = randomItem.split(''); // 分解所选项目为字符
    setFinalChars(charArray); // 设置最终结果
    const slots = Array(charArray.length).fill(null); // 初始化空槽位
    setSelectedChars(slots);
    const audioStart = new Audio('/assets/sounds/ドラムロール.mp3');
    audioStart
    .play()
    .then(() => {
      if (previousBonus) {
        setNotificationMessage(null); // ボーナス後の通常抽選で通知をクリア
      }
    })
    .catch((err) => console.error('音声再生エラー:', err));

    // 控制每个字符独立旋转并停止
    charArray.forEach((_, index) => {
      if(items.length !== 1){
        let currentChar = ""; // 当前字符
        const interval = setInterval(() => {
          const possibleChars = items
            .map((item) => item[index] || "") // 获取所有项目中当前位置的字符
            .filter((char) => char); // 移除空字符

          // 随机选择一个字符
          currentChar =
            possibleChars[Math.floor(Math.random() * possibleChars.length)];

          // 设置旋转中的字符
          setSelectedChars((prev) => {
            const newChars = [...prev];
            newChars[index] = currentChar;
            return newChars;
          });
        }, 50); // 每50ms更新一次字符

        // 定时停止当前字符旋转
        setTimeout(() => {
          clearInterval(interval);

          // 停止旋转后设置最终字符
          setSelectedChars((prev) => {
            const newChars = [...prev];
            newChars[index] = charArray[index];
            return newChars;
          });

          // 如果是最后一个字符，完成抽签逻辑
          if (index === charArray.length - 1) {
            setTimeout(() => {
              setItems((prev) => prev.filter((item) => item !== randomItem)); // 从项目中移除已选项
              setUsedItems((prev) => [
                ...prev,
                [randomItem, findPersonIndex(metaDatas, randomItem)],
              ]); // 添加到已使用列表
              setIsDrawing(false);
              //delete the same item form bonuspoints
              const newBonusPoints = bonusPoints.map((obj) => {
                if (obj.items) {
                  obj.items = obj.items.filter((item) => item !== randomItem);
                }
                return obj;
              }).filter((obj) => !(obj.items && obj.items.length === 0)); // itemsが空なら削除
              setBonusPoints(newBonusPoints);

              // 触发礼炮效果
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              audioStart.pause();
              audioStart.currentTime = 0;
              const audio = new Audio("/assets/sounds/レベルアップ.mp3");
              audio
                .play()
                .then(() => {                
                  // 「レベルアップ」音声再生後に通知を設定
                  if (upcomingBonus) {
                    if (upcomingBonus.round === 5) {
                      setNotificationMessage({
                        title: "次はボーナスポイントの抽選を行います",
                        topic: "一番テニス🎾がうまい役員はは誰でしょうか？",
                      });
                    } else if (upcomingBonus.round === 15) {
                      setNotificationMessage({
                        title: "次はボーナスポイントの抽選を行います",
                        topic:"一番お酒🍺のことを愛している事業部長は誰でしょうか？",
                      });
                    } else if (upcomingBonus.round === 20) {
                      setNotificationMessage({
                        title: "次はボーナスポイントの抽選を行います",
                        topic: "一番バイク🏍が好きな事業部長は誰でしょうか？",
                      });
                    } else {
                      setNotificationMessage({
                        title: "次はボーナスポイントの抽選を行います",
                        topic: "",
                      });
                    }
                  }

                  if (bonus) {
                    if (bonus.round === 5) {
                      setNotificationMessage({
                        title: "",
                        topic: "一番テニス🎾がうまい役員はは誰でしょうか？",
                        answer: "👇🎾こちらの方でしょうか🎾👇",
                      });
                    } else if (bonus.round === 15) {                    
                      setNotificationMessage({
                        title: "",
                        topic: "一番お酒のことを愛している事業部長は誰でしょうか？",
                        answer: "👇🍺こちらの方でしょうか🍺👇",
                      });              
                    } else if (bonus.round === 20) {                
                      setNotificationMessage({
                        title: "",
                        topic: "一番バイクが好きな事業部長は誰でしょうか？",
                        answer: "👇🏍こちらの方でしょうか🏍👇",
                      });                
                    } else {
                      setNotificationMessage({
                        title: "",
                        topic: "★ボーナスポイント★",
                        // answer: "👇こちらの方です~👇",
                      });
                    }
                  }
                })
                .catch((err) => console.error("音声再生エラー:", err));
            }, 500);
          }
        }, 300 * (index + 1)); // 每个字符停止的延迟时间
      } else {     
        setSelectedChars((prev) => {
          const newChars = [...prev];
          newChars[index] = charArray[index];
          return newChars;
        });

        if (index === charArray.length - 1) {
          setItems((prev) => prev.filter((item) => item !== randomItem)); // 从项目中移除已选项
          setUsedItems((prev) => [...prev, [randomItem, findPersonIndex(metaDatas, randomItem)]]); // 添加到已使用列表
          setIsDrawing(false);
          //delete the same item form bonuspoints
          const newBonusPoints = bonusPoints.map(obj =>{
            if(obj.items){
              obj.items = obj.items.filter(item => item !== randomItem);
            }
            return obj;
          })
          setBonusPoints(newBonusPoints);

          // 触发礼炮效果
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          const audio = new Audio('/assets/sounds/レベルアップ.mp3');
          audio.play().catch((err) => console.error('音声再生エラー:', err));                
        }
      }
    });
    setDrawCount((prev) => prev + 1); // 抽選回数を増加
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ...">
      {/* Define rocket size variables */}
      {(() => {
        const rocketScale = 3; // Base scale factor - adjust this to change overall size
        const baseWidth = 60; // Base width
        const baseHeight = 120; // Base height
        const rocketWidth = baseWidth * rocketScale;
        const rocketHeight = baseHeight * rocketScale;
        const headWidth = (baseWidth / 2) * rocketScale;
        const headHeight = (baseHeight / 3) * rocketScale;
        const bodyWidth = headWidth;
        const bodyHeight = ((2 * baseHeight) / 3) * rocketScale;
        const finWidth = rocketWidth;
        const finHeight = (baseHeight / 6) * rocketScale;
        const flameWidth = (headWidth * 2) / 3;
        const flameHeight = headHeight;
        const fontSize = 12 * rocketScale;

        return (
          <>
            {/* Left Side - Two Rockets */}
            {bonusPoints.some(
              (bonusPoint) => bonusPoint.round === drawCount
            ) && (
              <>
                <div className="fixed left-0 w-1/6 h-screen">
                  <div
                    className="absolute left-4 bottom-0 animate-rocket"
                    style={{
                      width: rocketWidth,
                      height: rocketHeight,
                      zIndex: 10,
                    }}
                  >
                    {/* First Left Rocket */}
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: headWidth,
                          height: headHeight,
                          background: "#ff0000",
                          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                        }}
                      ></div>
                      <div
                        style={{
                          width: bodyWidth,
                          height: bodyHeight,
                          background:
                            "linear-gradient(to right, #d1d5db, #e5e7eb, #d1d5db)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-around",
                          color: "#000",
                          fontWeight: "bold",
                          fontSize: `${fontSize}px`,
                        }}
                      >
                        <span>A</span>
                        <span>D</span>
                        <span>V</span>
                      </div>
                      <div
                        style={{
                          width: finWidth,
                          height: finHeight,
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            width: finHeight,
                            height: finHeight,
                            background: "#ff0000",
                            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                          }}
                        ></div>
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            width: finHeight,
                            height: finHeight,
                            background: "#ff0000",
                            clipPath: "polygon(0 0, 0 100%, 100% 100%)",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: flameWidth,
                        height: flameHeight,
                        background:
                          "linear-gradient(to top, #fef08a, #fde047, #facc15, #fb923c)",
                        clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                        animation: "flicker 0.3s infinite",
                      }}
                    ></div>
                  </div>

                  <div
                    className="absolute left-48 bottom-0 animate-rocket-delayed"
                    style={{
                      width: rocketWidth,
                      height: rocketHeight,
                      zIndex: 10,
                    }}
                  >
                    {/* Second Left Rocket - Same structure */}
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: headWidth,
                          height: headHeight,
                          background: "#ff0000",
                          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                        }}
                      ></div>
                      <div
                        style={{
                          width: bodyWidth,
                          height: bodyHeight,
                          background:
                            "linear-gradient(to right, #d1d5db, #e5e7eb, #d1d5db)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-around",
                          color: "#000",
                          fontWeight: "bold",
                          fontSize: `${fontSize}px`,
                        }}
                      >
                        <span>F</span>
                        <span>T</span>
                      </div>
                      <div
                        style={{
                          width: finWidth,
                          height: finHeight,
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            width: finHeight,
                            height: finHeight,
                            background: "#ff0000",
                            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                          }}
                        ></div>
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            width: finHeight,
                            height: finHeight,
                            background: "#ff0000",
                            clipPath: "polygon(0 0, 0 100%, 100% 100%)",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: flameWidth,
                        height: flameHeight,
                        background:
                          "linear-gradient(to top, #fef08a, #fde047, #facc15, #fb923c)",
                        clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                        animation: "flicker 0.3s infinite",
                      }}
                    ></div>
                  </div>
                </div>
              </>
            )}

            {/* Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <h1 className="text-4xl font-bold mb-5">🎉NAME BINGO🎉</h1>
              <h2 className="mb-5">ROUND: {drawCount}</h2>
              {notificationMessage && (
                <NotificationCard message={notificationMessage} />
              )}
              {showWaiting && (
                <div className="text-white text-4xl font-bold border rounded shadow-lg bg-gray-700 p-6 mb-6">
                  抽選待ち
                </div>
              )}
              {!showWaiting && (
                <>
                  <div
                    className="w-full justify-center"
                    style={{ height: `${90 * 2}px` }}
                  >
                    <ResultDisplay
                      chars={selectedChars}
                      isDrawing={isDrawing}
                      metaDatas={metaDatas}
                      resultIndex={resultIndex}
                      charGroup={charGroup}
                      finalResult={finalChars} // 新增这行，传入最终结果
                    />
                  </div>
                </>
              )}
              <div className="flex justify-center items-center space-x-4 mt-10">
                <button
                  className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 active:bg-green-700 transition mb-4"
                  onClick={handleDraw}
                  disabled={isDrawing || items.length === 0}
                >
                  {items.length > 0 ? "スタート" : "終わり"}
                </button>
                {!isFullscreen && (
                  <button
                    className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition mb-4"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    抽選項目追加
                  </button>
                )}
                {!isFullscreen && (
                  <button
                    className="bg-purple-500 text-white py-2 px-6 rounded hover:bg-purple-600 transition mb-4"
                    onClick={handleFullscreen}
                  >
                    フルスクリーン表示
                  </button>
                )}
              </div>
              <p className="text-3xl font-bold text-fuchsia-700 mt-3">
                これまで出てきたお名前
              </p>
              <UsedList items={usedItems} metaDatas={metaDatas} />
              <InputDrawer
                isOpen={isDrawerOpen}
                onAddItems={handleAddItems}
                bonusPoints={bonusPoints}
                setBonusPoints={setBonusPoints}
                metaDatas={metaDatas}
                setMetaDatas={setMetaDatas}
                toggleDrawer={() => setIsDrawerOpen(false)}
              />
            </div>

            {/* Right Side - Two Rockets */}
            {bonusPoints.some(
              (bonusPoint) => bonusPoint.round === drawCount
            ) && (
              <>
                <div className="fixed right-0 w-1/6 h-screen">
                  <div
                    className="absolute right-4 bottom-0 animate-rocket"
                    style={{
                      width: rocketWidth,
                      height: rocketHeight,
                      zIndex: 10,
                    }}
                  >
                    {/* First Right Rocket */}
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: headWidth,
                          height: headHeight,
                          background: "#ff0000",
                          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                        }}
                      ></div>
                      <div
                        style={{
                          width: bodyWidth,
                          height: bodyHeight,
                          background:
                            "linear-gradient(to right, #d1d5db, #e5e7eb, #d1d5db)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-around",
                          color: "#000",
                          fontWeight: "bold",
                          fontSize: `${fontSize}px`,
                        }}
                      >
                        <span>A</span>
                        <span>D</span>
                        <span>M</span>
                      </div>
                      <div
                        style={{
                          width: finWidth,
                          height: finHeight,
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            width: finHeight,
                            height: finHeight,
                            background: "#ff0000",
                            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                          }}
                        ></div>
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            width: finHeight,
                            height: finHeight,
                            background: "#ff0000",
                            clipPath: "polygon(0 0, 0 100%, 100% 100%)",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: flameWidth,
                        height: flameHeight,
                        background:
                          "linear-gradient(to top, #fef08a, #fde047, #facc15, #fb923c)",
                        clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                        animation: "flicker 0.3s infinite",
                      }}
                    ></div>
                  </div>

                  <div
                    className="absolute right-48 bottom-0 animate-rocket-delayed"
                    style={{
                      width: rocketWidth,
                      height: rocketHeight,
                      zIndex: 10,
                    }}
                  >
                    {/* Second Right Rocket */}
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: headWidth,
                          height: headHeight,
                          background: "#ff0000",
                          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                        }}
                      ></div>
                      <div
                        style={{
                          width: bodyWidth,
                          height: bodyHeight,
                          background:
                            "linear-gradient(to right, #d1d5db, #e5e7eb, #d1d5db)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-around",
                          color: "#000",
                          fontWeight: "bold",
                          fontSize: `${fontSize}px`,
                        }}
                      >
                        <span>C</span>
                        <span>S</span>
                      </div>
                      <div
                        style={{
                          width: finWidth,
                          height: finHeight,
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            width: finHeight,
                            height: finHeight,
                            background: "#ff0000",
                            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                          }}
                        ></div>
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            width: finHeight,
                            height: finHeight,
                            background: "#ff0000",
                            clipPath: "polygon(0 0, 0 100%, 100% 100%)",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: flameWidth,
                        height: flameHeight,
                        background:
                          "linear-gradient(to top, #fef08a, #fde047, #facc15, #fb923c)",
                        clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                        animation: "flicker 0.3s infinite",
                      }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </>
        );
      })()}

      <style jsx>{`
        @keyframes flicker {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes rocketLaunch {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(-200vh);
          }
        }

        @keyframes rocketLaunchDelayed {
          0% {
            transform: translateY(calc(100% + 150px));
          } /* 少しY方向でずらす */
          100% {
            transform: translateY(calc(-200vh + 150px));
          } /* 最終位置も同じ分だけずらす */
        }

        .animate-rocket {
          animation: rocketLaunch 1s linear forwards;
        }

        .animate-rocket-delayed {
          animation: rocketLaunchDelayed 1s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default LotteryApp;
