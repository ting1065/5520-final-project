import { View, Text, Image, StyleSheet, Platform } from "react-native";
import React from "react";
import { auth } from "../Firebase/firebase-setup";
import { Marker } from "react-native-maps";
import { colors } from "../styles/colors";

export default function PlayerMarker({ clickHandler, player }) {
  return (
    <Marker
      coordinate={{
        latitude: player.location.latitude,
        longitude: player.location.longitude,
      }}
      stopPropagation={true}
      onPress={async () => await clickHandler(player)}
    >
      <View style={styles.playerContainer}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Image style={styles.image} source={{ uri: player.avatar }} />
        <Text style={styles.playerName}>Rank: {player.rank}</Text>
        {auth.currentUser.uid === player.id && (
          <Text style={styles.selfName}> Me! </Text>
        )}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  playerContainer: {
    width: 90,
    height: 90,
    borderRadius: 20,

    // flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
    backgroundColor: colors.shadowColor,
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
  playerName: {
    color: colors.whiteWords,
    fontSize: 15,
  },
  selfName: {
    color: colors.goldWords,
    fontSize: 15,
  },
});
