import { Body2, gray } from "@shared";
import { StyleSheet } from "react-native";


export interface DiaryCardContentProps {
  content: string;
}

const EmotionDiaryCardContent = ({ content }: DiaryCardContentProps) => {
  return (
    <Body2
      weight="regular"
      style={styles.textStyle}
    >
      {content}
    </Body2>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: gray[600],
  },
});

export default EmotionDiaryCardContent;
