import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../styles/colors";

const GradientBackground = ({ children }) => {
  return (
    <LinearGradient
      colors={[colors.gradient1, colors.gradient2, colors.gradient3]}
      style={[StyleSheet.absoluteFill, styles.container]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;
