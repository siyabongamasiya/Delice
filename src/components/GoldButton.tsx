import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface GoldButtonProps extends TouchableOpacityProps {
  title: string;
}

const GoldButton: React.FC<GoldButtonProps> = ({ title, style, ...props }) => (
  <TouchableOpacity style={[styles.button, style]} {...props}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#D4AF37",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GoldButton;
