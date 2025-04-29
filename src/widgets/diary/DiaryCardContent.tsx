import { Text } from 'react-native';

export interface DiaryCardContentProps {
  content: string;
}

const DiaryCardContent = ({ content }: DiaryCardContentProps) => {
  return (
    <Text className="font-pretendard font-medium tracking-[-0.5px] text-black/70 leading-6">
      {content}
    </Text>
  );
};

export default DiaryCardContent;
