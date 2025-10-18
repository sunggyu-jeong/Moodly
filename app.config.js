// app.config.ts
import 'dotenv/config';

const APP_ENV = process.env.APP_ENV ?? 'develop'; // develop | staging | production
const isProd  = APP_ENV === 'production';
const isStg   = APP_ENV === 'staging';

const suffix = isProd ? '' : isStg ? ' 베타' : ' 개발';

const iosBundleId     = isProd ? 'com.moodlyfrontend' : isStg ? 'com.moodlybeta' : 'com.moodlydev';
const androidPackage  = iosBundleId; 

const scheme = isProd ? 'moodly' : isStg ? 'moodlybeta' : 'moodlydev';

const iosGoogleServiceFile =
  isProd ? './GoogleService-Info.prod.plist'
  : isStg ? './GoogleService-Info.stg.plist'
          : './GoogleService-Info.dev.plist';

const androidGoogleServiceFile =
  isProd ? './google-services.prod.json'
  : isStg ? './google-services.stg.json'
          : './google-services.dev.json';

const IOS_REVERSED_CLIENT_ID =
  isProd ? process.env.IOS_REVERSED_CLIENT_ID_PROD
  : isStg ? process.env.IOS_REVERSED_CLIENT_ID_STG
          : process.env.IOS_REVERSED_CLIENT_ID_DEV;

export default {
  name: `무들리${suffix}`,
  slug: 'MoodlyFrontend',
  version: '1.0.2',
  scheme,
  userInterfaceStyle: 'light',
  orientation: 'landscape',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    url: 'https://u.expo.dev/7a306411-86c9-4e39-8036-de136b0f42a8',
    fallbackToCacheTimeout: 0,
    checkAutomatically: 'ON_LOAD',
  },
  runtimeVersion: { policy: 'appVersion' },
  assetBundlePatterns: ['**/*'],

  ios: {
    buildNumber: '7',
    bundleIdentifier: iosBundleId,
    googleServicesFile: iosGoogleServiceFile,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      CFBundleDevelopmentRegion: 'ko',
      CFBundleLocalizations: ['ko'],
      CFBundleURLTypes: [
        IOS_REVERSED_CLIENT_ID ? { CFBundleURLSchemes: [IOS_REVERSED_CLIENT_ID] } : {},
        { CFBundleURLSchemes: [scheme] },
      ].filter(Boolean) ,
    },
  },

  android: {
    package: androidPackage,
    googleServicesFile: androidGoogleServiceFile,
    versionCode: 7,
    intentFilters: [
      {
        action: 'VIEW',
        category: ['BROWSABLE', 'DEFAULT'],
        data: [{ scheme }],
      },
    ],
  },

  plugins: [
    '@react-native-google-signin/google-signin',
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '2.1.20',
        },
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
  ],

  extra: {
    APP_ENV,
    eas: { projectId: '7a306411-86c9-4e39-8036-de136b0f42a8' }
  },
};