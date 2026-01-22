import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Spinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#D4AF37" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});

export default Spinner;
