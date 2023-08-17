import { View, Text, Modal, Image, StyleSheet } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { colors } from '../Colors';
import Card from "../components/Card";

export default function PlayerClicked({
  clickedPlayer,
  modalVisible,
  challengeHandler,
  closeHandler,
}) {
  return (
    <Modal visible={modalVisible} animationType="slide">
      <View style={styles.container}>
        {clickedPlayer && (
          <>
            <Text style={[styles.combatWords, styles.personalInfo]}>{clickedPlayer.name}'s Combat Record</Text>
            <View style={styles.cardContainer}>
              <Card
                width={300}
                height={100}
                backgroundColor={colors.loginButton}
          
              >
                {/* <Text style={[styles.combatWords, styles.personalInfo]}>{clickedPlayer.name}'s Combat Record</Text> */}
                <Text style={[styles.inputTitle, styles.winLoseStyle]}>Win: {clickedPlayer.win}</Text>
                <Text style={[styles.inputTitle, styles.winLoseStyle]}>Lose: {clickedPlayer.lose}</Text>
              </Card>
            </View>
            <Text style={[styles.combatWords, styles.personalInfo]}>{clickedPlayer.name}'s Puzzle</Text>
            <View style={styles.cardContainer}>
              
              <Card
              width={300}
              height={320}
              backgroundColor={colors.loginButton}
            
              >
                {/* <Text style={[styles.combatWords, styles.personalInfo]}>{clickedPlayer.name}'s Puzzle</Text> */}
                <Image
                  style={styles.image}
                  source={{ uri: clickedPlayer.puzzleCover }}
                />
                <Text style={[styles.inputTitle, styles.winLoseStyle]}>Puzzle win: {clickedPlayer.puzzleWin}</Text>
                <Text style={[styles.inputTitle, styles.winLoseStyle]}>Puzzle lose: {clickedPlayer.puzzleLose}</Text>
              </Card>
            </View>
            
            
            {clickedPlayer.puzzleExists ? (
              <>
                
                {auth.currentUser.uid !== clickedPlayer.id && (
                  <>
                    <PressableButton
                      onPress={() => challengeHandler(clickedPlayer)}
                    >
                      <Text>challenge button</Text>
                    </PressableButton>

                  </>
                )}
              </>
            ) : (
              <Text>this player has not designed puzzle yet</Text>
            )}
          </>
        )}
        
        <PressableButton onPress={() => closeHandler()}>
          <Text>close button</Text>
        </PressableButton>
        
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
  personalInfo: {
    fontSize: 25,
    alignSelf: 'center',
  },
  combatWords: {
    color: colors.shadowColor,
  }, 
  winLoseStyle: {
    alignSelf: 'center',
  },
  inputTitle: {
    fontSize: 20,
    color: colors.redButton,
    marginVertical: 5,
  },
  cardContainer: {
    marginVertical: 25,
  },
  image: {
    marginVertical: 10,

    width: 200,
    height: 200,
    alignSelf: 'center',
  }
});
