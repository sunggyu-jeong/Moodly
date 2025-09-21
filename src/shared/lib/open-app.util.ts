import { Linking, Platform } from 'react-native';

export const openAppStore = () => {
  const storeUrl = Platform.select({
    ios: `itms-apps://itunes.apple.com/app/apple-store/id6746043240`,
    android: ``,
  });

  if (!storeUrl) return;

  Linking.canOpenURL(storeUrl).then(support => {
    if (support) {
      Linking.openURL(storeUrl);
    }
  });
};
