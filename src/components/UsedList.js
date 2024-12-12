import {React} from 'react';
import { Card } from '@mantine/core';
// import CONSTANT from '../CONSTANT';
const UsedList = ({ items, metaDatas}) => {
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
      {items.map((item, index) => {
        return(
          <Card
            key={index}
            style={{
              background: 'linear-gradient(135deg, #316C88, #D62CDE)', // 渐变颜色，从金黄色到橙色
              width: '100px', // 设置为圆形时的宽度
              height: '100px', // 设置为圆形时的高度
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '5px', // 为旧浏览器提供支持
              borderRadius: '50%', // 设置为圆形
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 添加轻微阴影
            }}
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
          >
          <div
            style={{
              textAlign: 'center',
              fontSize: '1rem',
              fontWeight: 'bold',
              fontFamily: 'Noto Sans JP',
              color: '#e6b422', // 字体以增强对比度
            }}
          >
            <span>{metaDatas[item[1]][2]}</span>
            <br/>
            <span>{metaDatas[item[1]][1]}</span>
          </div>
        </Card>
        );
      })}
    </div>
  );
};

export default UsedList;
