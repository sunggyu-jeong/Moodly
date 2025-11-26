import 'dotenv/config';

const APP_ENV = process.env.APP_ENV ?? 'develop'; // develop | staging | production
const isProd = APP_ENV === 'production';
const isStg = APP_ENV === 'staging';

const suffix = isProd ? '' : isStg ? ' 베타' : ' 개발';

const icon = isProd ? './assets/icon.png' : './assets/icon-dev.png';

const iosBundleId = isProd ? 'com.moodlyfrontend' : isStg ? 'com.moodlybeta' : 'com.moodlydev';
const androidPackage = iosBundleId;
const scheme = isProd ? 'moodly' : isStg ? 'moodlybeta' : 'moodlydev';

const iosGoogleServiceFile = isProd
  ? './GoogleService-Info.prod.plist'
  : isStg
    ? './GoogleService-Info.stg.plist'
    : './GoogleService-Info.dev.plist';

const androidGoogleServiceFile = isProd
  ? './google-services.prod.json'
  : isStg
    ? './google-services.stg.json'
    : './google-services.dev.json';

const PROJECT_ID = process.env.EAS_PROJECT_ID ?? 'a1dd67f4-01b2-4cc1-9c06-076721195e0b';

export default {
  name: `무들리${suffix}`,
  slug: 'moodly',
  version: '1.0.2',
  owner: 'sunggyu_jeong',
  scheme,
  userInterfaceStyle: 'light',
  orientation: 'portrait',
  icon,

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },

  updates: {
    url: `https://u.expo.dev/${PROJECT_ID}`,
    fallbackToCacheTimeout: 0,
    checkAutomatically: 'ON_LOAD',
  },

  runtimeVersion: '1.0.2',
  assetBundlePatterns: ['**/*'],

  ios: {
    buildNumber: '14',
    bundleIdentifier: iosBundleId,
    googleServicesFile: iosGoogleServiceFile,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      CFBundleDevelopmentRegion: 'ko',
      CFBundleLocalizations: ['ko'],
    },
  },

  android: {
    package: androidPackage,
    googleServicesFile: androidGoogleServiceFile,
    versionCode: 7,
    adaptiveIcon: {
      foregroundImage: icon,
      backgroundColor: '#ffffff',
    },
    intentFilters: [{ action: 'VIEW', category: ['BROWSABLE', 'DEFAULT'], data: [{ scheme }] }],
  },

  plugins: [
    '@react-native-google-signin/google-signin',
    [
      'expo-build-properties',
      {
        android: { kotlinVersion: '2.1.20' },
        ios: { useFrameworks: 'static' },
      },
    ],
  ],

  extra: {
    APP_ENV,

    eas: { projectId: PROJECT_ID },
  },
};
