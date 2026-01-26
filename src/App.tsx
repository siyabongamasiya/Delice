import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import supabase from "./api/supabase";
import RootNavigator from "./navigation/RootNavigator";
import { logout, setToken, setUser } from "./store/slices/authSlice";
import { store } from "./store/store";

export default function App() {
  useEffect(() => {
    // Restore session on app start and keep Redux in sync with Supabase Auth
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
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
      // On web OAuth redirect, Supabase commonly emits INITIAL_SESSION after reload.
      if (
        (event === "SIGNED_IN" ||
          event === "INITIAL_SESSION" ||
          event === "TOKEN_REFRESHED") &&
        session?.access_token &&
        session?.refresh_token
      ) {
        console.log("AUTH SESSION EMAIL", session.user?.email);
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

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
