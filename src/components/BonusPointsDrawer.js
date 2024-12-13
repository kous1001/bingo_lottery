import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BonusPointsDrawer = ({ isOpen, toggleDrawer, bonusPoints, setBonusPoints }) => {
  const [bonusRound, setBonusRound] = useState('');
  const [bonusItems, setBonusItems] = useState('');
  const [selectedBonusIndex, setSelectedBonusIndex] = useState(null);

  const handleAddBonusPoint = () => {
    // Validation check
    if (!bonusRound || !bonusItems.trim()) {
        toast.error('抽選回数と対象項目を正しく入力してください！');
        return;
    }

    const newBonusPoint = {
      round: parseInt(bonusRound, 10),
      items: bonusItems.split('\n').map((item) => {
        item.trim();
        const temp = item.split(' ');
        return temp[0] + temp[1];
      }),
    };

    if (selectedBonusIndex !== null) {
      // 編集モード
      const updatedBonusPoints = [...bonusPoints];
      updatedBonusPoints[selectedBonusIndex] = newBonusPoint;
      setBonusPoints(updatedBonusPoints);
    } else {
      // 新規追加
      setBonusPoints([...bonusPoints, newBonusPoint]);
    }
    
    setBonusRound('');
    setBonusItems('');
    setSelectedBonusIndex(null);
  };

  const handleEditBonusPoint = (index) => {
    const bonusPoint = bonusPoints[index];
    setBonusRound(bonusPoint.round);
    setBonusItems(bonusPoint.items.join(', '));
    setSelectedBonusIndex(index);
  };

  const handleDeleteBonusPoint = (index) => {
    setBonusPoints(bonusPoints.filter((_, i) => i !== index));
  };

  return (
    <div className={`fixed top-0 right-0 h-full bg-white shadow-md transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 p-4`}>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h2 className="text-xl font-bold mb-4">ボーナスポイント管理</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">抽選回数</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={bonusRound}
          min={1}
          onChange={(e) => setBonusRound(e.target.value)}
          placeholder="例: 5"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">対象項目 (改行区切り)</label>
        {/* <input
          type="text"
          className="w-full p-2 border rounded"
          value={bonusItems}
          onChange={(e) => setBonusItems(e.target.value)}
          placeholder="名前ごと一行で入力してください"
        /> */}
          <textarea
            className="w-full p-2 border rounded mb-4"
            placeholder="苗字 名前 部署名のフォーマットで一行ずつ入力してください"
            style={{ height: '200px' }}  // 设置高度为 200px
            value={bonusItems}
            onChange={(e) => setBonusItems(e.target.value)}
          />
      </div>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
        onClick={handleAddBonusPoint}
      >
        {selectedBonusIndex !== null ? '保存' : '追加'}
      </button>
      <button
        className="bg-gray-500 text-white py-2 px-4 ml-2 rounded hover:bg-gray-600 transition"
        onClick={toggleDrawer}
      >
        閉じる
      </button>
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">登録済みボーナスポイント</h3>
        {bonusPoints.map((bonus, index) => (
          <div
            key={index}
            className="flex item-center  bg-gray-100 p-2 rounded mb-2"
          >
            <span>
              <strong>{bonus.round}回目:</strong> {bonus.items.join(', ')}
            </span>
            <div>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded mr-3 ml-3"
                onClick={() => handleEditBonusPoint(index)}
              >
                編集
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDeleteBonusPoint(index)}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusPointsDrawer;
