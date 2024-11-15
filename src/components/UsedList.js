import React from 'react';
import { Card } from '@mantine/core';

const UsedList = ({ items }) => {
  return (
    <div
      className="used-items"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px', // 使用 gap 属性设置 Card 间距
        justifyContent: 'center',
      }}
    >
      {items.map((item, index) => (
        <Card
          key={index}
          style={{
            backgroundColor: '#fed660',
            width: '150px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '5px', // 为旧浏览器提供支持
            borderRadius: '5px', // 设置圆角
          }}
          shadow="sm"
          p="lg"
          radius="md"
          withBorder
        >
          <div style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Noto Sans JP' }}>
            {item}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UsedList;
