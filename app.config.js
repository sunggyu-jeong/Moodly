import 'dotenv/config';

export default {
  expo: {
    name: "무들리",
    slug: "MoodlyFrontend",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    orientation: "landscape",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0,
      "url": "https://u.expo.dev/7a306411-86c9-4e39-8036-de136b0f42a8"
    },
    runtimeVersion: {
      "policy": "appVersion"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.moodlyfrontend",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [process.env.IOS_REVERSED_CLIENT_ID],
          },
        ],
      },
    },
    android: {
      adaptiveIcon: null,
      splash: {
        backgroundColor: "#5168DB"
      },
      package: "com.moodlyfrontend",
      googleServicesFile: "./google-services.json",
      versionCode: 6
    },
    plugins: [
      "@react-native-google-signin/google-signin",
      ["expo-build-properties", {
        android: {
          kotlinVersion: "2.1.20"
        },
        ios: {
          useFrameworks: "static",
        }
      }]
    ],
    extra: {
      eas: {
        projectId: "7a306411-86c9-4e39-8036-de136b0f42a8"
      }
    }
  },
};