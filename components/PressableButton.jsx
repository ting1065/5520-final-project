import { Pressable, StyleSheet } from "react-native";
import React from "react";

export default function PressableButton({
  children,
  onPress,
  defaultStyle,
  pressedStyle,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => {
        return [styles.styleByDefault, defaultStyle, pressed && pressedStyle];
      }}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  styleByDefault: { backgroundColor: 'transparent' },
});
