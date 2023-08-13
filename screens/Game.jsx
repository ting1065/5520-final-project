import { View, Text } from "react-native";
import React from "react";
import PressableButton from "../components/PressableButton";
import { auth } from "../Firebase/firebase-setup";
import {
  incrementUserWinInDB,
  incrementUserLoseInDB,
  incrementPuzzleWinInDB,
  incrementPuzzleLoseInDB,
} from "../Firebase/firebase-helper";

export default function Game({ route, navigation }) {
  const clickedPlayer = route.params.clickedPlayer;
  console.log("clickedPlayer", clickedPlayer);

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


  return (
    <View>
      <Text>challenging {clickedPlayer.name}'s puzzle</Text>
      <Text>quiz1: {clickedPlayer.puzzle[0]}</Text>
      <Text>quiz2: {clickedPlayer.puzzle[1]}</Text>
      <Text>quiz3: {clickedPlayer.puzzle[2]}</Text>
      <Text>quiz4: {clickedPlayer.puzzle[3]}</Text>
      <Text>quiz5: {clickedPlayer.puzzle[4]}</Text>
      <Text>=========</Text>
      <Text>still building this feature.</Text>
      <Text>coming soon!</Text>
      <Text>=========</Text>
      <Text>=========</Text>
        <PressableButton onPress={winHandler}>
          <Text>test win</Text>
        </PressableButton>
      <Text>=========</Text>
      <Text>=========</Text>
        <PressableButton onPress={loseHandler}>
          <Text>test lose</Text>
        </PressableButton>
      <Text>=========</Text>
      <Text>=========</Text>
        <PressableButton onPress={quitHandler}>
          <Text>quit</Text>
        </PressableButton>
      <Text>=========</Text>
    </View>
  );
}
