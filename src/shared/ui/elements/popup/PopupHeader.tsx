import { gray } from '@/shared/styles/colors';
import { Body2 } from '@/shared/ui/typography/Body2';
import { H2 } from '@/shared/ui/typography/H2';
import { StyleSheet, View } from 'react-native';

interface PopupHeaderProps {
  title: string;
  message: string;
}

const PopupHeader = ({ title, message }: PopupHeaderProps) => {
  return (
    <View style={styles.container}>
      <H2
        weight="semibold"
        style={styles.popupTitle}
      >
        {title}
      </H2>
      <Body2
        weight="regular"
        style={styles.popupContent}
      >
        {message}
      </Body2>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  popupContent: {
    color: gray[400],
    marginTop: 9,
    textAlign: 'center',
  },
  popupTitle: {
    color: gray[600],
  },
});

export default PopupHeader;
