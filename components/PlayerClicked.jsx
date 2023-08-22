import { View, Text, Modal, Image, StyleSheet } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { colors } from "../styles/colors";
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
        <View style={ styles.closeContainer}>
          <PressableButton
            defaultStyle={[
              styles.defaultStyle,
              { backgroundColor: colors.shadowColor },
              { alignSelf: "flex-end" },
              { marginRight: 20 },
              { width: 70 },
            ]}
            pressedStyle={styles.pressedStyle}
            onPress={() => closeHandler()}
          >
            <Text style={styles.loginButtonText}>Close</Text>
          </PressableButton>
        </View>
        
        {clickedPlayer && (
          <>
            <View style={styles.titleContainer}>
              <Text style={[styles.combatWords, styles.personalInfo, {marginBottom: 5}]}>
              {clickedPlayer.name}
              </Text>
            
              <Card
                width={300}
                height={100}
                backgroundColor={colors.loginButton}
              >
                <View style={styles.upperBoardTextContainer}>
                  <Text style={[styles.inputTitle, styles.winLoseStyle]}>
                    Rank: {clickedPlayer.rank}
                  </Text>
                  <Text style={[styles.inputTitle, styles.winLoseStyle]}>
                    Score: {clickedPlayer.score}
                  </Text>
                </View>
                <View style={styles.upperBoardTextContainer}>
                  <Text style={[styles.inputTitle, styles.winLoseStyle]}>
                    Win: {clickedPlayer.win}
                  </Text>
                  <Text style={[styles.inputTitle, styles.winLoseStyle]}>
                    Lose: {clickedPlayer.lose}
                  </Text>
                </View>
              </Card>
            </View >

            <View style={[styles.titleContainer, {flex: 1}]}>
              <Text style={[styles.combatWords, styles.personalInfo]}>
              {clickedPlayer.name}'s Puzzle
              </Text>
            </View>
            

            {clickedPlayer.puzzleExists ? (
              <>
                <View style={[styles.cardContainer, {flex: 6} ]}>
                  <Card
                    width={300}
                    height={300}
                    backgroundColor={colors.loginButton}
                  >
                    <Image
                      style={styles.image}
                      source={{ uri: clickedPlayer.puzzleCover }}
                    />
                    <Text style={[styles.inputTitle, styles.winLoseStyle]}>
                      Puzzle Win: {clickedPlayer.puzzleWin}
                    </Text>
                    <Text style={[styles.inputTitle, styles.winLoseStyle]}>
                      Puzzle Lose: {clickedPlayer.puzzleLose}
                    </Text>
                  </Card>
                </View>
                {auth.currentUser.uid !== clickedPlayer.id &&
                  (clickedPlayer.puzzleWinners.includes(
                    auth.currentUser.uid
                  ) ? (
                    <Text style={[styles.inputTitle, styles.winLoseStyle, {flex: 1} ]}>
                      You have already solved this puzzle!
                    </Text>
                  ) : (
                    <View style={styles.challengeButtonContainer}>
                      <PressableButton
                        defaultStyle={styles.defaultStyle}
                        pressedStyle={styles.pressedStyle}
                        onPress={() => challengeHandler(clickedPlayer)}
                      >
                        <Text style={styles.loginButtonText}>
                          Challenge it!
                        </Text>
                      </PressableButton>
                    </View>
                  ))}
              </>
            ) : (
              <View style={[styles.cardContainer ]}>
                <Card
                  width={300}
                  height={300}
                  backgroundColor={colors.loginButton}
                >
                  <Text style={[styles.inputTitle, styles.winLoseStyle]}>
                    No designed puzzle yet!
                  </Text>
                </Card>
              </View>
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
    marginTop: 40,
  },
  closeContainer: {
    flex: 2,
    alignSelf: "flex-end"
  },
  upperBoardTextContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  personalInfo: {
    fontSize: 25,
    alignSelf: "center",
  },
  combatWords: {
    color: colors.shadowColor,
  },
  winLoseStyle: {
    alignSelf: "center",
  },
  inputTitle: {
    fontSize: 20,
    color: colors.redButton,
    marginVertical: 5,
  },
  cardContainer: {
    marginVertical: 5,
    flex: 7,
  },
  image: {
    marginVertical: 5,
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  defaultStyle: {
    width: 150,
    height: 45,
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
  loginButtonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: "center",
  },
  challengeButtonContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 2,

  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
});
