import { Card, Text, Divider } from '@mantine/core';

const NotificationCard = ({ message }) => {
  if (!message) return null;

  return (
    <Card
      shadow="md"
      radius="lg"
      style={{
        backgroundColor: '#FDE047', // 背景色を黄色系に
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
