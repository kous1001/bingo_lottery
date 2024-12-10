import React, { useState, useEffect } from 'react';
import ResultDisplay from './ResultDisplay';
import UsedList from './UsedList';
import InputDrawer from './InputDrawer';
import '../App.css';
import confetti from 'canvas-confetti';
import NotificationCard from './NotificationCard';

const LotteryApp = () => {
  const [items, setItems] = useState([]);
  const [selectedChars, setSelectedChars] = useState([]);
  const [usedItems, setUsedItems] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWaiting, setShowWaiting] = useState(true);
  const [bonusPoints, setBonusPoints] = useState([]);
  const [drawCount, setDrawCount] = useState(0); // 抽選回数を追跡
  const [notificationMessage, setNotificationMessage] = useState(null); // お知らせメッセージ

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
    const filteredItems = newItems.filter(item => (!items.includes(item) && !usedItems.includes(item)));

    // 必要な場合のみ状態を更新
    if (filteredItems.length > 0) {
      setItems([...items, ...filteredItems]); // 現在のitemsに新しいアイテムを追加
    }

    setIsDrawerOpen(false); // ドロワーを閉じる
  };

  
  const handleDraw = () => {
    if (isDrawing || items.length === 0) return;
    setShowWaiting(false); // 点击「スタート」后隐藏「抽選待ち」
    setIsDrawing(true);
    
    // ボーナスポイントチェック
    const previousBonus = bonusPoints.find((bp) => bp.round === drawCount);
    const bonus = bonusPoints.find((bp) => bp.round === drawCount + 1);
    const upcomingBonus = bonusPoints.find((bp) => bp.round === drawCount + 2);
  
    const drawItems = bonus ? bonus.items : items;
    const randomItem = drawItems[Math.floor(Math.random() * drawItems.length)];
  
    const charArray = randomItem.split(''); // 分解所选项目为字符
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
        let currentChar = ''; // 当前字符
        const interval = setInterval(() => {
          const possibleChars = items
            .map((item) => item[index] || '') // 获取所有项目中当前位置的字符
            .filter((char) => char); // 移除空字符
    
          // 随机选择一个字符
          currentChar = possibleChars[Math.floor(Math.random() * possibleChars.length)];
    
          // 设置旋转中的字符
          setSelectedChars((prev) => {
            const newChars = [...prev];
            newChars[index] = currentChar;
            return newChars;
          });
        }, 20); // 每50ms更新一次字符
    
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
              setUsedItems((prev) => [...prev, randomItem]); // 添加到已使用列表
              setIsDrawing(false);
    
              // 触发礼炮效果
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              audioStart.pause();
              audioStart.currentTime = 0;
              const audio = new Audio('/assets/sounds/レベルアップ.mp3');
              audio
          .play()
          .then(() => {
            // 「レベルアップ」音声再生後に通知を設定
            if (upcomingBonus) {
              if(upcomingBonus.round === 5){
                setNotificationMessage(
                  {title:"次はボーナスポイントの抽選を行います", topic: "一番テニス🎾がうまい役員はは誰でしょうか？"}
                );
              }else if(upcomingBonus.round === 15){
                setNotificationMessage(
                  {title:"次はボーナスポイントの抽選を行います", topic: "一番お酒🍺のことを愛している事業部長は誰でしょうか？"}
                );
              }else if(upcomingBonus.round === 20){
                setNotificationMessage(
                  {title:"次はボーナスポイントの抽選を行います", topic: " 一番バイク🏍が好きな事業部長は誰でしょうか？"}
                );
              }else{
                setNotificationMessage(
                  {title:"次はボーナスポイントの抽選を行います", topic: ""}
                );
              }
            }

            if(bonus){
              if(bonus.round === 5){
                setNotificationMessage(
                  {title:"", topic: "一番テニスがうまい役員はは誰でしょうか？", answer:"👇🎾こちらの方らしいです🎾👇"}
                );
              }else if(bonus.round === 15){
                setNotificationMessage(
                  {title:"", topic: "一番お酒のことを愛している事業部長は誰でしょうか？", answer:"👇🍺こちらの方らしいです🍺👇"}
                );
              }else if(bonus.round === 20){
                setNotificationMessage(
                  {title:"", topic: " 一番バイクが好きな事業部長は誰でしょうか？", answer:"👇🏍こちらの方らしいです🏍👇"}
                );
              }
            }
          })
          .catch((err) => console.error('音声再生エラー:', err));         
            }, 500);
          }
        }, 700 * (index + 1)); // 每个字符停止的延迟时间
      } else {     
        setSelectedChars((prev) => {
          const newChars = [...prev];
          newChars[index] = charArray[index];
          return newChars;
        });

        if (index === charArray.length - 1) {
          setItems((prev) => prev.filter((item) => item !== randomItem)); // 从项目中移除已选项
          setUsedItems((prev) => [...prev, randomItem]); // 添加到已使用列表
          setIsDrawing(false);

          // 触发礼炮效果
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          const audio = new Audio('/assets/sounds/レベルアップ.mp3');
          audio.play().catch((err) => console.error('音声再生エラー:', err));                
        }
      }
    });
    setDrawCount((prev) => prev + 1); // 抽選回数を増加

    // const randomItem = items[Math.floor(Math.random() * items.length)];
    // const charArray = randomItem.slice(0, 5).split(''); // 将抽签项分解为最多5个字符
    // setSelectedChars(Array(charArray.length).fill('?')); // 显示占位符字符
    // let iterations = 0;
    // const duration = 1000; // 抽签持续时间 3 秒
    // let intervalTime = 20; // 初始间隔时间

    // const interval = setInterval(() => {
    //      // 每个字符位置随机选择一个字符进行翻页动画
    //     const randomChars = charArray.map(() => {
    //       const randomItem = items[Math.floor(Math.random() * items.length)];
    //       return randomItem.charAt(Math.floor(Math.random() * randomItem.length)) || '';
    //     });
    //     setSelectedChars(randomChars);
    //     iterations += intervalTime;

    //     // 逐渐增加间隔时间来实现减速效果
    //     if (iterations >= duration) {
    //       clearInterval(interval);
    //       setSelectedChars(charArray); // 最终显示完整字符数组
    //       setItems((prev) => prev.filter((item) => item !== randomItem));
    //       setUsedItems((prev) => [...prev, randomItem]);
    //       setIsDrawing(false);
  
    //       // 触发礼炮彩带效果
    //       confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    //       // const audio = new Audio('/assets/sounds/ラッパのファンファーレ.mp3');
    //       // audio.play().catch((err) => console.error('音频播放失败:', err));
    //     }

    //     // 增加时间间隔，使翻页动画逐渐减速
    //     if (iterations >= duration / 2) {
    //         intervalTime += 30; // 增加时间间隔使得翻页逐渐减速
    //     }
    // }, intervalTime);
  };

  return (
    <div className="min-h-screen flex">
      {/* Define rocket size variables */}
      {(() => {
        const rocketScale = 3; // Base scale factor - adjust this to change overall size
        const baseWidth = 60;  // Base width
        const baseHeight = 120; // Base height
        const rocketWidth = baseWidth * rocketScale;
        const rocketHeight = baseHeight * rocketScale;
        const headWidth = (baseWidth/2) * rocketScale;
        const headHeight = (baseHeight/3) * rocketScale;
        const bodyWidth = headWidth;
        const bodyHeight = (2*baseHeight/3) * rocketScale;
        const finWidth = rocketWidth;
        const finHeight = (baseHeight/6) * rocketScale;
        const flameWidth = headWidth * 2/3;
        const flameHeight = headHeight;
        const fontSize = 12 * rocketScale;

        return (
          <>
            {/* Left Side - Two Rockets */}
            {bonusPoints.some(bonusPoint => bonusPoint.round === drawCount) && (
              <>
                <div className="fixed left-0 w-1/6 h-screen">
                  <div className="absolute left-4 bottom-0 animate-rocket" style={{
                    width: rocketWidth,
                    height: rocketHeight,
                    zIndex: 10
                  }}>
                    {/* First Left Rocket */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: headWidth,
                        height: headHeight,
                        background: '#ff0000',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                      }}></div>
                      <div style={{
                        width: bodyWidth,
                        height: bodyHeight,
                        background: 'linear-gradient(to right, #d1d5db, #e5e7eb, #d1d5db)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: `${fontSize}px`
                      }}>
                        <span>A</span>
                        <span>D</span>
                        <span>V</span>
                      </div>
                      <div style={{
                        width: finWidth,
                        height: finHeight,
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          bottom: 0,
                          width: finHeight,
                          height: finHeight,
                          background: '#ff0000',
                          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                        }}></div>
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          bottom: 0,
                          width: finHeight,
                          height: finHeight,
                          background: '#ff0000',
                          clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
                        }}></div>
                      </div>
                    </div>
                    <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2" style={{
                      width: flameWidth,
                      height: flameHeight,
                      background: 'linear-gradient(to top, #fef08a, #fde047, #facc15, #fb923c)',
                      clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                      animation: 'flicker 0.3s infinite'
                    }}></div>
                  </div>

                  <div className="absolute left-48 bottom-0 animate-rocket-delayed" style={{
                    width: rocketWidth,
                    height: rocketHeight,
                    zIndex: 10
                  }}>
                    {/* Second Left Rocket - Same structure */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: headWidth,
                        height: headHeight,
                        background: '#ff0000',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                      }}></div>
                      <div style={{
                        width: bodyWidth,
                        height: bodyHeight,
                        background: 'linear-gradient(to right, #d1d5db, #e5e7eb, #d1d5db)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: `${fontSize}px`
                      }}>
                        <span>F</span>
                        <span>T</span>
                      </div>
                      <div style={{
                        width: finWidth,
                        height: finHeight,
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          bottom: 0,
                          width: finHeight,
                          height: finHeight,
                          background: '#ff0000',
                          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                        }}></div>
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          bottom: 0,
                          width: finHeight,
                          height: finHeight,
                          background: '#ff0000',
                          clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
                        }}></div>
                      </div>
                    </div>
                    <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2" style={{
                      width: flameWidth,
                      height: flameHeight,
                      background: 'linear-gradient(to top, #fef08a, #fde047, #facc15, #fb923c)',
                      clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                      animation: 'flicker 0.3s infinite'
                    }}></div>
                  </div>
                </div>
              </>
            )}

              {/* Center Content */}
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                  <h1 className="text-4xl font-bold mb-5">🎉NAME BINGO🎉</h1>
                  <h2 className='mb-5'>ROUND: {drawCount}</h2>
                  {notificationMessage && (
                      <NotificationCard message={notificationMessage} />
                  )}
                  {showWaiting && (
                      <div className="text-white text-4xl font-bold border rounded shadow-lg bg-gray-700 p-6 mb-6">
                          抽選待ち
                      </div>
                  )}
                  {!showWaiting &&
                      <>
                          <div className="w-full justify-center" style={{height: `${90 * 2}px`}}>
                              <ResultDisplay chars={selectedChars} isDrawing={isDrawing} />
                          </div>
                      </>
                  }
                  <div className="flex justify-center items-center space-x-4 mt-10">
                      <button
                          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 active:bg-green-700 transition mb-4"
                          onClick={handleDraw}
                          disabled={isDrawing || items.length === 0}
                      >
                          {items.length > 0 ? 'スタート' : '終わり'}
                      </button>
                      <button
                          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition mb-4"
                          onClick={() => setIsDrawerOpen(true)}
                      >
                          抽選項目追加
                      </button>
                      {!isFullscreen && (
                          <button
                              className="bg-purple-500 text-white py-2 px-6 rounded hover:bg-purple-600 transition mb-4"
                              onClick={handleFullscreen}
                          >
                              フルスクリーン表示
                          </button>
                      )}
                  </div>
                  <p className='text-3xl font-bold text-fuchsia-700 mt-3'>これまで出てきたお名前</p>
                  <UsedList items={usedItems}/>
                  <InputDrawer isOpen={isDrawerOpen} onAddItems={handleAddItems} bonusPoints={bonusPoints} setBonusPoints={setBonusPoints} toggleDrawer={() => setIsDrawerOpen(false)} />
              </div>

            {/* Right Side - Two Rockets */}
            {bonusPoints.some(bonusPoint => bonusPoint.round === drawCount) && (
              <>
                <div className="fixed right-0 w-1/6 h-screen">
                  <div className="absolute right-4 bottom-0 animate-rocket" style={{
                    width: rocketWidth,
                    height: rocketHeight,
                    zIndex: 10
                  }}>
                    {/* First Right Rocket */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: headWidth,
                        height: headHeight,
                        background: '#ff0000',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                      }}></div>
                      <div style={{
                        width: bodyWidth,
                        height: bodyHeight,
                        background: 'linear-gradient(to right, #d1d5db, #e5e7eb, #d1d5db)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: `${fontSize}px`
                      }}>
                        <span>A</span>
                        <span>D</span>
                        <span>M</span>
                      </div>
                      <div style={{
                        width: finWidth,
                        height: finHeight,
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          bottom: 0,
                          width: finHeight,
                          height: finHeight,
                          background: '#ff0000',
                          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                        }}></div>
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          bottom: 0,
                          width: finHeight,
                          height: finHeight,
                          background: '#ff0000',
                          clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
                        }}></div>
                      </div>
                    </div>
                    <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2" style={{
                      width: flameWidth,
                      height: flameHeight,
                      background: 'linear-gradient(to top, #fef08a, #fde047, #facc15, #fb923c)',
                      clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                      animation: 'flicker 0.3s infinite'
                    }}></div>
                  </div>

                  <div className="absolute right-48 bottom-0 animate-rocket-delayed" style={{
                    width: rocketWidth,
                    height: rocketHeight,
                    zIndex: 10
                  }}>
                    {/* Second Right Rocket */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: headWidth,
                        height: headHeight,
                        background: '#ff0000',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                      }}></div>
                      <div style={{
                        width: bodyWidth,
                        height: bodyHeight,
                        background: 'linear-gradient(to right, #d1d5db, #e5e7eb, #d1d5db)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: `${fontSize}px`
                      }}>
                        <span>C</span>
                        <span>S</span>
                      </div>
                      <div style={{
                        width: finWidth,
                        height: finHeight,
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          bottom: 0,
                          width: finHeight,
                          height: finHeight,
                          background: '#ff0000',
                          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                        }}></div>
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          bottom: 0,
                          width: finHeight,
                          height: finHeight,
                          background: '#ff0000',
                          clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
                        }}></div>
                      </div>
                    </div>
                    <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2" style={{
                      width: flameWidth,
                      height: flameHeight,
                      background: 'linear-gradient(to top, #fef08a, #fde047, #facc15, #fb923c)',
                      clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                      animation: 'flicker 0.3s infinite'
                    }}></div>
                  </div>
                </div>
              </>
            )}
          </>
        );
      })()}

        <style jsx>{`
            @keyframes flicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            .animate-rocket {
                animation: rocketLaunch 1.5s linear forwards;
            }
            .animate-rocket-delayed {
                animation: rocketLaunch 1.5s linear forwards;
                animation-delay: 0.5s;
            }
            @keyframes rocketLaunch {
                0% { transform: translateY(100%); }
                100% { transform: translateY(-200vh); }
            }
        `}</style>
    </div>
  );
};

export default LotteryApp;
