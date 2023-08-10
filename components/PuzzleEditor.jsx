import { View, Text, Modal, TextInput, Alert, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../Firebase/firebase-setup";
import { addPuzzleToDB, updatePuzzleInDB } from "../Firebase/firebase-helper";
import PressableButton from "./PressableButton";

export default function PuzzleEditor({
  puzzleDoc,
  modalVisible,
  confirmHandler,
  cancelHandler,
}) {
  const [resetHandler, setResetHandler] = useState(false);

  const quizPattern = /^[A-Z0-9]+$/;

  const puzzleDocId = puzzleDoc?.id;

  const [quiz1, setQuiz1] = useState(puzzleDoc ? puzzleDoc.puzzle[0] : "");
  const [quiz2, setQuiz2] = useState(puzzleDoc ? puzzleDoc.puzzle[1] : "");
  const [quiz3, setQuiz3] = useState(puzzleDoc ? puzzleDoc.puzzle[2] : "");
  const [quiz4, setQuiz4] = useState(puzzleDoc ? puzzleDoc.puzzle[3] : "");
  const [quiz5, setQuiz5] = useState(puzzleDoc ? puzzleDoc.puzzle[4] : "");

  useEffect(() => {
    setQuiz1(puzzleDoc ? puzzleDoc.puzzle[0] : "");
    setQuiz2(puzzleDoc ? puzzleDoc.puzzle[1] : "");
    setQuiz3(puzzleDoc ? puzzleDoc.puzzle[2] : "");
    setQuiz4(puzzleDoc ? puzzleDoc.puzzle[3] : "");
    setQuiz5(puzzleDoc ? puzzleDoc.puzzle[4] : "");
  }, [resetHandler, puzzleDoc]);

  function cancel() {
    cancelHandler();
    setResetHandler(!resetHandler);
  }

  async function pushNewPuzzle() {
    if (
      !(
        quiz1.length === 5 &&
        quiz2.length === 10 &&
        quiz3.length === 15 &&
        quiz4.length === 20 &&
        quiz5.length === 30
      )
    ) {
      Alert.alert("invalid quiz length, please follow the instruction");
      return;
    }

    if (
      !(
        quizPattern.test(quiz1) &&
        quizPattern.test(quiz2) &&
        quizPattern.test(quiz3) &&
        quizPattern.test(quiz4) &&
        quizPattern.test(quiz5)
      )
    ) {
      Alert.alert("only A-Z and 0-9 are allowed");
      return;
    }

    try {
      if (puzzleDocId) {
        await updatePuzzleInDB(puzzleDocId, [
          quiz1,
          quiz2,
          quiz3,
          quiz4,
          quiz5,
        ]);
      } else {
        await addPuzzleToDB(
          [quiz1, quiz2, quiz3, quiz4, quiz5],
          auth.currentUser.uid
        );
      }

      confirmHandler();
      setResetHandler(!resetHandler);
    } catch (e) {
      console.log("error happened when pushing new puzzle: ", e);
      cancel();
    }
  }

  return (
    <Modal visible={modalVisible} animationType="slide">
      <View style={styles.container}>
        <Text>quiz 1:</Text>
        <TextInput
          autoCapitalize="characters"
          value={quiz1}
          onChangeText={(text) => {
            setQuiz1(text);
          }}
        />
        <Text>quiz 2:</Text>
        <TextInput
          autoCapitalize="characters"
          value={quiz2}
          onChangeText={(text) => {
            setQuiz2(text);
          }}
        />
        <Text>quiz 3:</Text>
        <TextInput
          autoCapitalize="characters"
          value={quiz3}
          onChangeText={(text) => {
            setQuiz3(text);
          }}
        />
        <Text>quiz 4:</Text>
        <TextInput
          autoCapitalize="characters"
          value={quiz4}
          onChangeText={(text) => {
            setQuiz4(text);
          }}
        />
        <Text>quiz 5:</Text>
        <TextInput
          autoCapitalize="characters"
          value={quiz5}
          onChangeText={(text) => {
            setQuiz5(text);
          }}
        />
        <Text>=====</Text>
        <PressableButton onPress={async () => await pushNewPuzzle()}>
          <Text>confirm</Text>
        </PressableButton>
        <Text>=====</Text>
        <Text>=====</Text>
        <Text>=====</Text>
        <PressableButton onPress={() => cancel()}>
          <Text>cancel</Text>
        </PressableButton>
        <Text>=====</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
