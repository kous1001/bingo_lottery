import {React} from 'react';
import { Card } from '@mantine/core';
// import CONSTANT from '../CONSTANT';
const UsedList = ({ items }) => {

  // const [background, setBackground] = useState(
  //   'linear-gradient(135deg, #316C88, #D62CDE)'
  // ); // 默认背景

  // const backgroundMap = {
  //   ADV: 'linear-gradient(135deg, #83FE2A, #2A83FE)',
  //   FT: 'linear-gradient(135deg, #A333B9, #B9338C)',
  //   CS: 'linear-gradient(135deg, #41AA47, #41AA7B)',
  //   ADM: 'linear-gradient(135deg, #1D83C1, #5E74D2)',
  // };


  // const setBg = ((item)=> {
    // Object.entries(CONSTANT.BUISINESS_DP).forEach(([key, vaules]) => {
    //     vaules.forEach(value => {
    //         if(item === value){
    //           console.log(backgroundMap[key]);
    //           setBackground(backgroundMap[key]);
    //         }
    //     });
    //   });
  // })

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
        // 动态计算背景颜色
        // const background = (() => {
        //   let bg = 'linear-gradient(135deg, #316C88, #D62CDE)'; // 默认背景
        //   Object.entries(CONSTANT.BUISINESS_DP).forEach(([key, values]) => {
        //     if (values.includes(item)) {
        //       bg = backgroundMap[key];
        //     }
        //   });
        //   return bg;
        // })();

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
            {item}
          </div>
        </Card>
        );
      })}
    </div>
  );
};

export default UsedList;
