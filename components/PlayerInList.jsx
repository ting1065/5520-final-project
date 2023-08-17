import { Text, Image, StyleSheet, View } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { colors } from '../Colors';

export default function PlayerInList({ clickHandler, player }) {
  return (
    <PressableButton 
      defaultStyle={styles.playerDefaultStyle}
      pressedStyle={styles.playerPressedStyle}
      onPress={async () => await clickHandler(player)}
    >
      <View style={styles.playerContainer}>
        <Image
        style={styles.image}
        source={{ uri: player.avatar }}
      />
      
        {auth.currentUser.uid === player.id ? <Text style={styles.selfName}>{player.name}</Text>: <Text style={styles.playerName}>{player.name}</Text>}
      </View>
      
    </PressableButton>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 70, 
    height: 70,
    resizeMode: 'cover',
    marginRight: 10,
  
  },
  playerContainer: {
    width: '80%',
    height: 90,
    borderRadius: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
    backgroundColor: colors.shadowColor,
  },
  playerName: {
    color: colors.whiteWords,
    fontSize: 20,
  },
  selfName: {
    color: colors.goldWords,
    fontSize: 20,
  },
  playerDefaultStyle: {
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

})