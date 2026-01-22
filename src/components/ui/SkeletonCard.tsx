import React from "react";
import { StyleSheet, View } from "react-native";

const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={styles.image} />
    <View style={styles.line} />
    <View style={styles.lineShort} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    marginBottom: 12,
  },
  line: {
    height: 16,
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    marginBottom: 8,
    width: "80%",
  },
  lineShort: {
    height: 16,
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    width: "40%",
  },
});

export default SkeletonCard;
