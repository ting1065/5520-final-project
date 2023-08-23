import { View, Text, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import GradientBackground from "./GradientBackground";

export default function QuizDisplayer({ quiz, modalVisible, endHandler }) {
  // add extra content for display
  const listToDisplay = [
    "ARE",
    "YOU",
    "READY?",
    "GO!",
    "->",
    ...quiz.split(""),
    "<-",
    "END",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentContent, setCurrentContent] = useState("");

  // show the characters one by one
  useEffect(() => {
    if (currentIndex < listToDisplay.length) {
      setTimeout(() => {
        setCurrentContent(listToDisplay[currentIndex]);
      }, 400);
      setTimeout(() => {
        setCurrentContent(" ");
        setCurrentIndex(currentIndex + 1);
      }, 800);
    } else {
      setTimeout(() => {
        endHandler();
      }, 300);
    }
  }, [currentIndex]);

  return (
    <Modal visible={modalVisible} animationType="slide">
      <GradientBackground>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Remember all the letters/numbers after "-{">"}"</Text>
          <Text style={{ fontSize: 40, fontWeight: "bold" }}>
            {currentContent}
          </Text>
        </View>
      </GradientBackground>
    </Modal>
  );
}
