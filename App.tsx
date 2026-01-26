import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import supabase from "./src/api/supabase";
import { Colors } from "./src/constants/colors";
import linking from "./src/navigation/linking";
import RootNavigator from "./src/navigation/RootNavigator";
import { logout, setToken, setUser } from "./src/store/slices/authSlice";
import { store } from "./src/store/store";

export default function App() {
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      console.log("BOOT SESSION", session);
      if (session?.access_token && session?.refresh_token) {
        store.dispatch(
          setToken({
            token: session.access_token,
            refreshToken: session.refresh_token,
          }),
        );
        store.dispatch(setUser({ email: session.user?.email || "" }));
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT", event, "HAS_SESSION", !!session);
      if (
        (event === "SIGNED_IN" ||
          event === "INITIAL_SESSION" ||
          event === "TOKEN_REFRESHED") &&
        session?.access_token &&
        session?.refresh_token
      ) {
        store.dispatch(
          setToken({
            token: session.access_token,
            refreshToken: session.refresh_token,
          }),
        );
        store.dispatch(setUser({ email: session.user?.email || "" }));
      }

      if (event === "SIGNED_OUT") {
        store.dispatch(logout());
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const darkTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      primary: Colors.primary,
      background: Colors.background,
      card: Colors.card,
      text: Colors.text,
      border: Colors.border,
      notification: Colors.primary,
    },
  };
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer linking={linking} theme={darkTheme}>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
