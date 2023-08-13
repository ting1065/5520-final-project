import { View, Text, Modal } from "react-native";
import React, { useState, useEffect } from "react";

export default function QuizDisplayer({ quiz, modalVisible, endHandler }) {
  const listToDisplay = [
    ".",
    "..",
    "...",
    "ARE",
    "YOU",
    "READY",
    "?",
    ".",
    "..",
    "...",
    "3",
    "2",
    "1",
    "GO!",
    "->",
    ...quiz.split(""),
    "END"
  ];
  console.log(listToDisplay);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentContent, setCurrentContent] = useState("");

  useEffect(() => {
    if (currentIndex < listToDisplay.length) {
      setTimeout(() => {
        setCurrentContent(listToDisplay[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 300);
    } else {
      setTimeout(() => {endHandler();}, 300);
    }
  }, [currentIndex]);

  return (
    <Modal visible={modalVisible} animationType="slide">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Remember all the letters/numbers after "-{">"}"</Text>
        <Text style={{ fontSize: 40, fontWeight: "bold" }}>
          {currentContent}
        </Text>
      </View>
    </Modal>
  );
}
