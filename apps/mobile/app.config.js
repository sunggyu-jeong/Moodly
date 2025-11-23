const APP_ENV = process.env.APP_ENV ?? 'develop'; // develop | staging | production
const isProd = APP_ENV === 'production';
const isStg = APP_ENV === 'staging';

const suffix = isProd ? '' : isStg ? ' 베타' : ' 개발';

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
    buildNumber: '13',
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

    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    HOT_UPDATER_SUPABASE_BUCKET_NAME: process.env.HOT_UPDATER_SUPABASE_BUCKET_NAME,
    SUPABASE_URL: process.env.SUPABASE_URL,
    TEAM_ID: process.env.TEAM_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    KEY_ID: process.env.KEY_ID,
    KAKAO_OPEN_CHAT_LINK: process.env.KAKAO_OPEN_CHAT_LINK,
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
    PRIVACY_POLICY_LINK: process.env.PRIVACY_POLICY_LINK,
    TERMS_OF_SERVICE_LINK: process.env.TERMS_OF_SERVICE_LINK,
    AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY,
    ENCRYPTION_SECRET_KEY: process.env.ENCRYPTION_SECRET_KEY,

    eas: { projectId: PROJECT_ID },
  },
};
