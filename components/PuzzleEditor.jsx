import { View, Text, Modal, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../Firebase/firebase-setup";
import { addPuzzleToDB, updatePuzzleInDB } from "../Firebase/firebase-helper";
import PressableButton from "./PressableButton";
import GradientBackground from "./GradientBackground";
import { colors } from "../styles/colors";

export default function PuzzleEditor({
  puzzleDoc,
  modalVisible,
  confirmHandler,
  cancelHandler,
}) {
  const [resetHandler, setResetHandler] = useState(false);

  const quizPattern = /^[A-Z0-9]+$/;
  const quizLengths = [5, 6, 7, 8, 9, 10];
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
        quiz1.length === quizLengths[0] &&
        quiz2.length === quizLengths[1] &&
        quiz3.length === quizLengths[2] &&
        quiz4.length === quizLengths[3] &&
        quiz5.length === quizLengths[4]
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
      <GradientBackground>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100: 0} // Adjust the offset as needed
    
  
        >
          <ScrollView style={styles.quizContainer}>
            <Text style={styles.inputTitle}>Quiz 1:</Text>
            <Text style={styles.length}>
              {"("}length of {quizLengths[0]}
              {")"}
            </Text>
            <TextInput
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="characters"
              value={quiz1}
              onChangeText={(text) => {
                setQuiz1(text.toUpperCase());
              }}
              style={styles.titleInput}
            />
            
            <Text style={styles.inputTitle}>Quiz 2:</Text>
            <Text style={styles.length}>
              {"("}length of {quizLengths[1]}
              {")"}
            </Text>
            <TextInput
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="characters"
              value={quiz2}
              onChangeText={(text) => {
                setQuiz2(text.toUpperCase());
              }}
              style={styles.titleInput}
            />
            <Text style={styles.inputTitle}>Quiz 3:</Text>
            <Text style={styles.length}>
              {"("}length of {quizLengths[2]}
              {")"}
            </Text>
            <TextInput
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="characters"
              value={quiz3}
              onChangeText={(text) => {
                setQuiz3(text.toUpperCase());
              }}
              style={styles.titleInput}
            />
            <Text style={styles.inputTitle}>Quiz 4:</Text>
            <Text style={styles.length}>
              {"("}length of {quizLengths[3]}
              {")"}
            </Text>
            <TextInput
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="characters"
              value={quiz4}
              onChangeText={(text) => {
                setQuiz4(text.toUpperCase());
              }}
              style={styles.titleInput}
            />
            <Text style={styles.inputTitle}>Quiz 5:</Text>
            <Text style={styles.length}>
              {"("}length of {quizLengths[4]}
              {")"}
            </Text>
            <TextInput
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="characters"
              value={quiz5}
              onChangeText={(text) => {
                setQuiz5(text.toUpperCase());
              }}
              style={styles.titleInput}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.buttons}>
            <PressableButton 
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={async () => await pushNewPuzzle()}
            >
              <Text style={styles.loginButtonText}>Confirm</Text>
            </PressableButton>

            <PressableButton 
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={() => cancel()}
            >
              <Text style={styles.loginButtonText}>Cancel</Text>
            </PressableButton>
        </View>
      </GradientBackground>
      
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,

  },
  inputTitle: {
    fontSize: 20,
    color: colors.greyWords,
    marginVertical: 10,
    alignSelf: 'center',
  },
  titleInput: {
    fontSize: 15,
    width: '80%',
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5,
    height: 35,
    marginVertical: 10,
    paddingLeft: 5,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: "center",
  },
  defaultStyle: {
    width: 120,
    height: 45,
    marginHorizontal: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colors.redButton,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  pressedStyle: {
    backgroundColor: colors.pressedRedButton,
    opacity: 0.5,
  },
  buttons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  quizContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
  },
  length: {
    alignSelf: 'center',
  }

});
