import React, { useState, useEffect } from 'react';
import BonusPointsDrawer from "./BonusPointsDrawer"

const InputDrawer = ({ onAddItems, bonusPoints, setBonusPoints, isOpen, toggleDrawer, setMetaDatas ,metaDatas}) => {
  const [inputValue, setInputValue] = useState('');
  // reloadFlg の初期値は false
  const [reloadFlg, setReloadFlg] = useState(false);
  const [isBonusDrawerOpen, setIsBonusDrawerOpen] = useState(false);


  const handleAddItems = () => {

    const metaDatas = [];
    const fullnames = [];

    // 将输入按换行符分割，并移除空项
    const items = inputValue.split('\n')
                            .map(item => item.trim())
                            .filter(item => item);
    items.forEach(item => {
      const [familyName, givenName, dept, furigana] = item.split(' ');

      // Add items using addItem method
      const isEqual = metaDatas.some(metaArray => 
        metaArray[0] === familyName &&
        metaArray[1] === givenName &&
        metaArray[2] === dept);
      
      if(!isEqual) metaDatas.push([familyName, givenName, dept, furigana]);
      const fullname = (familyName + givenName).replace(/\s/g, '');
      fullnames.push(fullname);
    });
    onAddItems(fullnames);
    setMetaDatas(metaDatas);
    console.log(metaDatas);
    setInputValue('');
  };

  // useEffect で `beforeunload` イベントを設定
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!reloadFlg) {
        event.preventDefault();
        event.returnValue = ""; // 一部ブラウザのために必要
      }
  };

  // イベントリスナーを追加
  window.addEventListener('beforeunload', handleBeforeUnload);

  // クリーンアップ用にイベントリスナーを削除
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };

  }, [reloadFlg]); // `reloadFlg` が変更されるたびに `useEffect` を再実行

  // ボタンクリックで `reloadFlg` のトグル
  const toggleReloadFlg = () => {
    setReloadFlg((prev) => !prev);
  };

  return (
    <div className={`fixed top-0 right-0 h-full bg-white shadow-md transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 p-4`}>
      <h2 className="text-xl font-bold mb-4">項目追加</h2>
      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="苗字 名前 部署名のフォーマットで一行ずつ入力してください"
        style={{ height: '200px' }}  // 设置高度为 200px
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        onClick={handleAddItems}
      >
        追加
      </button>
      <button
        className="bg-gray-500 text-white py-2 px-4 ml-2 mt-2 rounded hover:bg-gray-600 transition"
        onClick={toggleDrawer}
      >
        閉じる
      </button>
      <button
        className="focus:outline-none text-white bg-yellow-400 ml-2 mt-2  hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
        onClick={toggleReloadFlg}>
        {reloadFlg ? 'Lock Reload' : 'Unlock Reload'}
      </button>
      <br/>
      <button
        className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
        onClick={() => setIsBonusDrawerOpen(true)}
      >
        ボーナスポイント管理
      </button>
      <BonusPointsDrawer
        metaDatas={metaDatas}
        isOpen={isBonusDrawerOpen}
        toggleDrawer={() => setIsBonusDrawerOpen(false)}
        bonusPoints={bonusPoints}
        setBonusPoints={setBonusPoints}
      />
    </div>
    
  );
};

export default InputDrawer;
