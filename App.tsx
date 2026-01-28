import * as ExpoCrypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

// Supabase PKCE needs WebCrypto (crypto.subtle) for SHA-256.
// Expo Go may not provide it, so we provide a minimal compatible shim.
const g: any = globalThis as any;
g.crypto = g.crypto || {};

// Do NOT override getRandomValues here; react-native-get-random-values patches it.
// Only polyfill crypto.subtle.digest for PKCE (SHA-256).
g.crypto.subtle = g.crypto.subtle || {};

if (!g.crypto.subtle.digest) {
  g.crypto.subtle.digest = async (
    algorithm: any,
    data: ArrayBuffer | ArrayBufferView,
  ): Promise<ArrayBuffer> => {
    const name =
      typeof algorithm === "string" ? algorithm : (algorithm?.name as string);
    if (name !== "SHA-256") {
      throw new Error(`Unsupported digest algorithm: ${name}`);
    }

    const bytes =
      data instanceof ArrayBuffer
        ? new Uint8Array(data)
        : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

    // expo-crypto typing differs across versions (some return ArrayBuffer, others Uint8Array).
    const hash: any = await (ExpoCrypto as any).digest(
      (ExpoCrypto as any).CryptoDigestAlgorithm.SHA256,
      bytes as any,
    );

    if (hash instanceof ArrayBuffer) {
      return hash;
    }

    // Assume Uint8Array-like
    const hashBytes = hash as Uint8Array;
    return hashBytes.buffer.slice(
      hashBytes.byteOffset,
      hashBytes.byteOffset + hashBytes.byteLength,
    ) as ArrayBuffer;
  };
}

WebBrowser.maybeCompleteAuthSession();

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { useEffect } from "react";
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
