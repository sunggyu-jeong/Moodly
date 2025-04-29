import dayjs from 'dayjs';
import { Text, View } from 'react-native';
import { IMAGES } from '../../assets/images';
import { ICON_DATA } from '../../constant/Icons';
import { getScaleSize } from '../../hooks';
import { EmotionDiaryDTO } from '../../scheme';
import Avatar from '../atoms/Avatar';

const DiaryCardHeader = ({ iconId, recordDate }: EmotionDiaryDTO) => {
  const emotionSource = ICON_DATA.find((item) => item.id === iconId);

  return (
    <View className="flex-row mb-[18px] items-center">
      <Avatar source={emotionSource?.icon || IMAGES.smile} />
      <View className="flex flex-col">
        <Text
          className="font-semibold tracking-[-0.5px] text-black/50 mb-2"
          style={{ fontSize: getScaleSize(14) }}
        >
          {dayjs(recordDate).format('MM월 DD일')}
        </Text>
        <Text
          className="font-semibold tracking-[-0.5px]"
          style={{ fontSize: getScaleSize(16) }}
        >
          {emotionSource?.text}
        </Text>
      </View>
    </View>
  );
};

export default DiaryCardHeader;
