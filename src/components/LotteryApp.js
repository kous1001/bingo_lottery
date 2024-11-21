import React, { useState, useEffect } from 'react';
import ResultDisplay from './ResultDisplay';
import UsedList from './UsedList';
import InputDrawer from './InputDrawer';
import '../App.css';
import confetti from 'canvas-confetti';

const LotteryApp = () => {
  const [items, setItems] = useState([]);
  const [selectedChars, setSelectedChars] = useState([]);
  const [usedItems, setUsedItems] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWaiting, setShowWaiting] = useState(true);

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

    const randomItem = items[Math.floor(Math.random() * items.length)];
    const charArray = randomItem.split(''); // 分解所选项目为字符
    const slots = Array(charArray.length).fill(null); // 初始化空槽位
    setSelectedChars(slots);
    const audioStart = new Audio('/assets/sounds/ドラムロール.mp3');
    audioStart.play().catch((err) => console.error('音频播放失败:', err));

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
              audio.play().catch((err) => console.error('音频播放失败:', err));
            }, 500);
          }
        }, 700 * (index + 1)); // 每个字符停止的延迟时间
      }else{     
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
        audio.play().catch((err) => console.error('音频播放失败:', err));
        }
      }
    });

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <canvas id="christmasCanvas"></canvas>
        <h1 className="text-4xl font-bold mb-20">🎉NAME BINGO🎉</h1>
        {showWaiting && ( // 初始显示「抽選待ち」
          <div className="text-white text-4xl font-bold border rounded shadow-lg bg-gray-700 p-6 mb-6">
            抽選待ち
          </div>
        )}
        <div className="w-full justify-center items-center ">
          <ResultDisplay chars={selectedChars} isDrawing={isDrawing} />
        </div>
        {/* <ResultDisplay item={selectedItem} isDrawing={isDrawing} /> */}
        <div className="flex justify-center items-center space-x-4 mt-20">
            <button
                className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 active:bg-green-700 transition mb-4"
                onClick={handleDraw}
                disabled={isDrawing || items.length === 0}
            >
                {items.length > 0 ? 'スタート' : '終わり'}
            </button>
            <button
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition  mb-4"
                onClick={() => setIsDrawerOpen(true)}
            >
                抽選項目追加
            </button>
            {!isFullscreen && ( // 仅当不是全屏时显示全屏按钮
                <button
                className="bg-purple-500 text-white py-2 px-6 rounded hover:bg-purple-600 transition mb-4"
                onClick={handleFullscreen}
                >
                フルスクリーン表示
                </button>
            )}
        </div>
        <p className='text-3xl font-bold text-fuchsia-700'>これまで出てきたお名前</p>
        <UsedList items={usedItems}/>
        <InputDrawer isOpen={isDrawerOpen} onAddItems={handleAddItems} toggleDrawer={() => setIsDrawerOpen(false)} />
    </div>
  );
};

export default LotteryApp;
