import React, { useState, useEffect } from 'react';
import ResultDisplay from './ResultDisplay';
import UsedList from './UsedList';
import InputDrawer from './InputDrawer';
import '../App.css';
import confetti from 'canvas-confetti';

const LotteryApp = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [usedItems, setUsedItems] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true); // 设置为全屏状态
    }
  };

  const handleAddItems = (newItems) => {
    setItems([...items, ...newItems]);
    setIsDrawerOpen(false);
  };

  const handleDraw = () => {
    if (isDrawing || items.length === 0) return;
    setIsDrawing(true);
    let iterations = 0;
    const duration = 2000; // 抽签持续时间 3 秒
    let intervalTime = 20; // 初始间隔时间

    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * items.length);
        setSelectedItem(items[randomIndex]);
        iterations += intervalTime;

        // 逐渐增加间隔时间来实现减速效果
        if (iterations >= duration) {
            clearInterval(interval);
            const finalItem = items[Math.floor(Math.random() * items.length)];
            setSelectedItem(finalItem);
            setItems((prev) => prev.filter((item) => item !== finalItem));
            setUsedItems((prev) => [...prev, finalItem]);
            setIsDrawing(false);

            // 礼炮彩带效果
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            const audio = new Audio('/assets/sounds/ラッパのファンファーレ.mp3');
            audio.play().catch((err) => console.error('音频播放失败:', err));
        }

        // 增加时间间隔，使翻页动画逐渐减速
        if (iterations >= duration / 2) {
            intervalTime += 20; // 增加时间间隔使得翻页逐渐减速
        }
    }, intervalTime);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <canvas id="christmasCanvas"></canvas>
        <h1 className="text-4xl font-bold mb-4">名前BINGO</h1>
        <ResultDisplay item={selectedItem} isDrawing={isDrawing} />
        <div className="flex justify-center items-center space-x-4 mt-4">
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
        <p className='text-3xl font-bold text-fuchsia-700'>これまで出てきた名前</p>
        <UsedList items={usedItems} />
        <InputDrawer isOpen={isDrawerOpen} onAddItems={handleAddItems} toggleDrawer={() => setIsDrawerOpen(false)} />
    </div>
  );
};

export default LotteryApp;
