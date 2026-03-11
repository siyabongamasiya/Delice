// Expo automatically inlines EXPO_PUBLIC_* envs; no dotenv needed in RN

/** @type {import('@expo/config').ExpoConfig} */
const easProjectId =
  typeof process.env.EAS_PROJECT_ID === "string" &&
  process.env.EAS_PROJECT_ID.trim().length > 0
    ? process.env.EAS_PROJECT_ID.trim()
    : "5e226ae4-eda8-416b-821b-4a8bc859939c";

const androidPackage =
  typeof process.env.EXPO_PUBLIC_ANDROID_PACKAGE === "string" &&
  process.env.EXPO_PUBLIC_ANDROID_PACKAGE.trim().length > 0
    ? process.env.EXPO_PUBLIC_ANDROID_PACKAGE.trim()
    : "com.siyabonga_khanyile.delice";

module.exports = {
  name: "delice",
  slug: "delice",
  scheme: "delice",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "dark",
  icon: "./assets/images/delice-logo.png",
  splash: {
    image: "./assets/images/delice-logo.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  ios: { supportsTablet: true },
  android: {
    package: androidPackage,
    adaptiveIcon: {
      foregroundImage: "./assets/images/delice-logo.png",
      backgroundColor: "#000000",
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: false,
        category: ["BROWSABLE", "DEFAULT"],
        data: [
          {
            scheme: "delice",
            host: "auth",
            pathPrefix: "/callback",
          },
          {
            scheme: "delice",
            host: "paystack",
            pathPrefix: "/callback",
          },
        ],
      },
    ],
  },
  web: { bundler: "metro" },
  extra: {
    // Optional access via Constants.expoConfig?.extra if needed
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: { projectId: easProjectId },
  },
};
