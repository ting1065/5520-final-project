import { Pressable, StyleSheet } from "react-native";
import React from "react";

export default function PressableButton({
  children,
  pressableFunction,
  defaultStyle,
  pressedStyle,
}) {
  return (
    <Pressable
      onPress={pressableFunction}
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
