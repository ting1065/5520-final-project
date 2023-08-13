import { View, Text, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import PressableButton from "../components/PressableButton";
import { auth } from "../Firebase/firebase-setup";
import {
  incrementUserWinInDB,
  incrementUserLoseInDB,
  incrementPuzzleWinInDB,
  incrementPuzzleLoseInDB,
} from "../Firebase/firebase-helper";
import QuizDisplayer from "../components/QuizDisplayer";

export default function Game({ route, navigation }) {
  const clickedPlayer = route.params.clickedPlayer;
  const clickedPuzzle = clickedPlayer.puzzle;

  const [gameRound, setGameRound] = useState(1);
  const [answer, setAnswer] = useState("");
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [gameStatus, setGameStatus] = useState("playing");
  const [modalVisible, setModalVisible] = useState(false);

  async function winHandler() {
    await incrementUserWinInDB(auth.currentUser.uid);
    await incrementPuzzleLoseInDB(clickedPlayer.puzzleId);
  }

  async function loseHandler() {
    await incrementUserLoseInDB(auth.currentUser.uid);
    await incrementPuzzleWinInDB(clickedPlayer.puzzleId);
  }

  async function quitHandler() {
    await loseHandler();
    navigation.replace("Home");
  }

  async function confirmHandler() {
    if (answer.length !== clickedPuzzle[gameRound - 1].length) {
      Alert.alert(
        "invalid length",
        `${clickedPuzzle[gameRound - 1].length} is needed`
      );
    } else if (answer !== clickedPuzzle[gameRound - 1]) {
      await loseHandler();
      setGameStatus("lose");
    } else if (gameRound === 5) {
      await winHandler();
      setGameStatus("win");
    } else {
      setGameRound(gameRound + 1);
      setIsDisplayed(false);
    }
  }

  function clearHandler() {
    setAnswer("");
  }

  function displayHandler() {
    setIsDisplayed(true);
    setModalVisible(true);
  }

  function displayEndHandler() {
    setModalVisible(false);
  }

  return (
    <View>
      {modalVisible && <QuizDisplayer
        quiz={clickedPuzzle[gameRound - 1]}
        modalVisible={modalVisible}
        endHandler={displayEndHandler}
      />}
      {gameStatus === "playing" ? (
        <>
          <Text>challenging {clickedPlayer.name}'s puzzle</Text>
          <Text>Round: {gameRound}</Text>
          {isDisplayed ? (
            <>
              <TextInput
                autoCapitalize="characters"
                value={answer}
                onChangeText={setAnswer}
              />
              <Text>=========</Text>
              <PressableButton onPress={confirmHandler}>
                <Text>confirm</Text>
              </PressableButton>
              <Text>=========</Text>
              <Text>=========</Text>
              <PressableButton onPress={clearHandler}>
                <Text>clear</Text>
              </PressableButton>
              <Text>=========</Text>
            </>
          ) : (
            <>
              <Text>
                click the button if you are ready to watch the string to
                memorize
              </Text>
              <Text>=========</Text>
              <PressableButton onPress={displayHandler}>
                <Text>display</Text>
              </PressableButton>
              <Text>=========</Text>
            </>
          )}
          <Text>=========</Text>
          <PressableButton onPress={quitHandler}>
            <Text>quit</Text>
          </PressableButton>
          <Text>=========</Text>
        </>
      ) : (
        <>
          <Text>you {gameStatus}!</Text>
          <Text>=========</Text>
          <PressableButton onPress={() => navigation.replace("Home")}>
            <Text>back to home page</Text>
          </PressableButton>
          <Text>=========</Text>
        </>
      )}
    </View>
  );
}
