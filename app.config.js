import 'dotenv/config';

export default {
  expo: {
    name: "MoodlyFrontend",
    slug: "MoodlyFrontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png", 
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.moodlyfrontend",
      googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [process.env.IOS_REVERSED_CLIENT_ID],
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.moodlyfrontend",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    plugins: [
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      "@react-native-google-signin/google-signin",
      ["@amplitude/analytics-react-native/expo-plugin", { apiKey: process.env.AMPLITUDE_API_KEY }],
      ["expo-build-properties", {
        android: {
          kotlinVersion: "1.8.10" 
        }
      }]
    ],
  },
};