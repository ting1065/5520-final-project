import { Pressable } from "react-native";
import React from "react";

export default function PressableButton({
  children,
  defaultStyle,
  onPressStyle,
  onPress,
}) {
  return (
    <Pressable
      style={({ pressed }) => (pressed ? onPressStyle : defaultStyle)}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}