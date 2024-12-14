import { Card, Text, Divider } from '@mantine/core';

const NotificationCard = ({ message, currentQuestion}) => {
  if (!message) return null;
  const bg = currentQuestion ?  "#88E570" : "#FDE047";
  return (
    <Card
      shadow="md"
      radius="lg"
      style={{
        backgroundColor: `${bg}`, // 背景色を黄色系に
        color: '#744210', // テキストの色をブラウン系に
        marginBottom: '32px',
        padding: '20px',
        borderRadius: '15px'
      }}
    >
    {message.title &&
        <Text
            align="center"
            weight={700}
            style={{
            fontSize: '20px',
            }}
        >
        ★ {message.title} ★
        </Text>
    }
      <Divider
        size="sm"
        style={{
          margin: '10px 0',
          borderTopColor: '#D97706', // Dividerの色をテーマに合わせる
        }}
      />
      {message.topic &&
        <Text
            align="center"
            weight={500}
            style={{
            fontSize: '18px',
            }}
        >
        Topic: {message.topic}
        </Text>
      }
      {message.answer &&
        <Text
            align="center"
            weight={500}
            style={{
            fontSize: '18px',
            }}
        >
        {message.answer}
        </Text>
      }
     
    </Card>
  );
};

export default NotificationCard
