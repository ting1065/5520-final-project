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
        <PressableButton 
            defaultStyle={[styles.defaultStyle, {backgroundColor: colors.shadowColor}, {alignSelf: 'flex-end'}, {marginRight: 20}, {width: 70}]}
            pressedStyle={styles.pressedStyle}
            onPress={() => closeHandler()}
          >
            <Text style={styles.loginButtonText}>Close</Text>
          </PressableButton>
        {clickedPlayer && (
          <>
            <Text style={[styles.combatWords, styles.personalInfo]}>{clickedPlayer.name}</Text>
            <View style={styles.cardContainer}>
              <Card
                width={300}
                height={100}
                backgroundColor={colors.loginButton}
          
              >
                {/* <Text style={[styles.combatWords, styles.personalInfo]}>{clickedPlayer.name}'s Combat Record</Text> */}
                <View style={styles.upperBoardTextContainer}>
                <Text style={[styles.inputTitle, styles.winLoseStyle]}>Rank: {clickedPlayer.rank}</Text>
                <Text style={[styles.inputTitle, styles.winLoseStyle]}>Score: {clickedPlayer.score}</Text>
                </View>
                <View style={styles.upperBoardTextContainer}>
                <Text style={[styles.inputTitle, styles.winLoseStyle]}>Win: {clickedPlayer.win}</Text>
                <Text style={[styles.inputTitle, styles.winLoseStyle]}>Lose: {clickedPlayer.lose}</Text>
                </View>
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
                      defaultStyle={styles.defaultStyle}
                      pressedStyle={styles.pressedStyle}
                      onPress={() => challengeHandler(clickedPlayer)}
                    >
                      <Text style={styles.loginButtonText}>Challenge it!</Text>
                    </PressableButton>

                  </>
                )}
              </>
            ) : (
              <Text >this player has not designed puzzle yet</Text>
            )}
          </>
        )}
        
        
        
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
  upperBoardTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  },
  defaultStyle: {
    width: 150,
    height: 45,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
  loginButtonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: 'center',

  },
});
