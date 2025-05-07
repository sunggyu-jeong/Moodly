import { gray } from '../../../shared/styles/colors';
import { Body2 } from '../../../shared/ui/typography/Body2';

export interface DiaryCardContentProps {
  content: string;
}

const DiaryCardContent = ({ content }: DiaryCardContentProps) => {
  return (
    <Body2
      weight="regular"
      style={{ color: gray[600] }}
    >
      {content}
    </Body2>
  );
};

export default DiaryCardContent;
