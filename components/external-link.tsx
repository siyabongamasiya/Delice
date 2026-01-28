import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import React from "react";
import {
  Linking,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
} from "react-native";

type Props = Omit<PressableProps, "onPress"> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  const onPress = async (event: GestureResponderEvent) => {
    if (process.env.EXPO_OS !== "web") {
      event.preventDefault();
      await openBrowserAsync(href, {
        presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
      });
      return;
    }

    await Linking.openURL(href);
  };

  return <Pressable accessibilityRole="link" {...rest} onPress={onPress} />;
}
