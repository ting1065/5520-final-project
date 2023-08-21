import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
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
import GradientBackground from "../components/GradientBackground";
import { colors } from "../styles/colors";
import Card from "../components/Card";
import { FontAwesome5 } from '@expo/vector-icons';

export default function Game({ route, navigation }) {
  const clickedPlayer = route.params.clickedPlayer;
  const isMapMode = route.params.isMapMode;
  const clickedPuzzle = clickedPlayer.puzzle;

  const [gameRound, setGameRound] = useState(1);
  const [answer, setAnswer] = useState("");
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [gameStatus, setGameStatus] = useState("playing");
  const [modalVisible, setModalVisible] = useState(false);

  async function winHandler() {
    await incrementUserWinInDB(auth.currentUser.uid);
    await incrementPuzzleLoseInDB(
      clickedPlayer.puzzleId,
      clickedPlayer.id,
      auth.currentUser.uid
    );
  }

  async function loseHandler() {
    await incrementUserLoseInDB(auth.currentUser.uid);
    await incrementPuzzleWinInDB(clickedPlayer.puzzleId, clickedPlayer.id);
  }

  async function quitHandler() {
    await loseHandler();
    navigation.navigate("Home", { isMapMode });
  }

  async function confirmHandler() {
    if (answer.length !== clickedPuzzle[gameRound - 1].length) {
      Alert.alert(
        "invalid length",
        `${clickedPuzzle[gameRound - 1].length} is needed`
      );
      return;
    }

    if (answer !== clickedPuzzle[gameRound - 1]) {
      await loseHandler();
      setAnswer("");
      setGameStatus("lose");
    } else if (gameRound === 5) {
      await winHandler();
      setAnswer("");
      setGameStatus("win");
    } else {
      setAnswer("");
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
    <GradientBackground>
      <View style={styles.container}>
        {modalVisible && (
          <QuizDisplayer
            quiz={clickedPuzzle[gameRound - 1]}
            modalVisible={modalVisible}
            endHandler={displayEndHandler}
          />
        )}
        {gameStatus === "playing" ? (
          <>
            {/* <Text style={styles.challengeTitle}>Challenging {clickedPlayer.name}'s puzzle</Text> */}
          
            <Text style={styles.challengeTitle}>Round: {gameRound}</Text>
            {isDisplayed ? (
              <>
                <TextInput
                  autoCapitalize="characters"
                  value={answer}
                  onChangeText={setAnswer}
                  style={styles.input}
                />

                <PressableButton 
                  defaultStyle={styles.defaultStyle}
                  pressedStyle={styles.pressedStyle}
                  
                  onPress={confirmHandler}>
                  <Text style={styles.loginButtonText}>Confirm</Text>
                </PressableButton>
                <PressableButton 
                  defaultStyle={styles.defaultStyle}
                  pressedStyle={styles.pressedStyle}
                  onPress={clearHandler}>
                  <Text style={styles.loginButtonText}>Clear</Text>
                </PressableButton>

              </>
            ) : (
              <>
                <Card width={300} height={70} backgroundColor={colors.whiteWords}>

                  <Text>
                    Click button "Display" if you are ready to watch the string. Try your best to memorize it.
                  </Text>

                  
                </Card>
                

                <PressableButton 
                  defaultStyle={styles.defaultStyle}
                  pressedStyle={styles.pressedStyle}
                  onPress={displayHandler}>
                  <Text style={styles.loginButtonText}>Display</Text>
                </PressableButton>

              </>
            )}

            <PressableButton 
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              
              onPress={quitHandler}>
              <Text style={styles.loginButtonText}>Quit</Text>
            </PressableButton>

          </>
        ) : (
          <>
            <Text style={styles.challengeTitle}>You {gameStatus}!</Text>
            {gameStatus ==='lose' ? 
              <FontAwesome5 name="sad-cry" size={90} color="darkred" /> 
              : <FontAwesome5 name="smile-beam" size={90} color="green" />}


            <PressableButton
              defaultStyle={[styles.defaultStyle, {width: 200}]}
              pressedStyle={styles.pressedStyle}
              onPress={() => navigation.navigate("Home", { isMapMode })}
            >
              <Text style={styles.loginButtonText}>Back to home page</Text>
            </PressableButton>

          </>
        )}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: "center",
  },
  defaultStyle: {
    width: 120,
    height: 45,
    marginTop: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colors.redButton,
    // Add platform-specific shadow
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
  challengeTitle: {
    fontSize: 25,
    alignSelf: "center",
    marginBottom: 10,
    
  },
  input: {
    fontSize: 20,
    width: '80%',
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5,
    paddingLeft: 5,
    height: 35,
  },

});