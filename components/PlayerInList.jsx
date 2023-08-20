import { Text, Image, StyleSheet, View } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { colors } from "../styles/colors";

export default function PlayerInList({ clickHandler, player }) {
  return (
    <PressableButton
      defaultStyle={styles.playerDefaultStyle}
      pressedStyle={styles.playerPressedStyle}
      onPress={async () => await clickHandler(player)}
    >
      <View style={styles.playerContainer}>
        <View style={styles.leftWrapper}>
          <View style={styles.nameWrapper}>
            <Text
              style={
                auth.currentUser.uid === player.id
                  ? styles.selfName
                  : styles.playerName
              }
            >
              {player.name.length > 9 ? `${player.name.slice(0, 9)}...` : player.name}
            </Text>
          </View>

          <View style={styles.imageWrapper}>
            <Image style={styles.image} source={{ uri: player.avatar }} />
          </View>
        </View>

        <View style={styles.rightWrapper}>
          <View style={styles.rightTextWrapper}>
            <Text
              style={
                auth.currentUser.uid === player.id
                  ? styles.selfStat
                  : styles.playerStat
              }
            >
              Rank: {player.rank}
            </Text>
            <Text
              style={
                auth.currentUser.uid === player.id
                  ? styles.selfStat
                  : styles.playerStat
              }
            >
              Score: {player.score}
            </Text>
          </View>
        </View>
      </View>
    </PressableButton>
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    width: "100%",
    height: 90,
    borderRadius: 60,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center",
    // margin: 10,
    backgroundColor: colors.shadowColor,
  },
  leftWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  nameWrapper: {
    height: "27%",
    width: "100%",
  },
  imageWrapper: {
    height: "68%",
    width: "100%",
  },
  image: {
    height: "100%",
    resizeMode: "contain",
  },
  rightWrapper: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  rightTextWrapper: {
    height: "100%",
    width: "60%",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  playerName: {
    color: colors.whiteWords,
    fontSize: 16,
    textAlign: "center",
  },
  selfName: {
    color: colors.goldWords,
    fontSize: 16,
    textAlign: "center",
  },
  playerStat: {
    color: colors.whiteWords,
    fontSize: 20,
    textAlign: "center",
  },
  selfStat: {
    color: colors.goldWords,
    fontSize: 20,
    textAlign: "center",
  },
  playerDefaultStyle: {
    width: "90%",
    height: 90,
    borderRadius: 60,
    backgroundColor: "white",
    margin: 10,
    alignSelf: "center",
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
  playerPressedStyle: {
    opacity: 0.5,
  },
});
