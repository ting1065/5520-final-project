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
      <View style={auth.currentUser.uid===player.id ? styles.currentPlayerMarkerContainer : styles.otherPlayerMarkerContainer}>
        <View style={styles.nameWrapper}>
          <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">
            {player.name}
          </Text>
        </View>
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={{ uri: player.avatar }} />
        </View>
        <View style={styles.rankWrapper}>
          <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">Rank: {player.rank}</Text>
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "100%",
    resizeMode: "contain",
  },
  currentPlayerMarkerContainer: {
    width: 90,
    height: 90,
    borderRadius: 20,

    // flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
    backgroundColor: colors.selfMarker,
    ...Platform.select({
      ios: {
        shadowColor: colors.selfMarker,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  otherPlayerMarkerContainer: {
    width: 90,
    height: 90,
    borderRadius: 20,

    // flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
    backgroundColor: colors.otherMarker,
    ...Platform.select({
      ios: {
        shadowColor: colors.otherMarker,
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
    textAlign: "center",
    color: colors.whiteWords,
    fontSize: 15,
  },
  selfName: {
    textAlign: "center",
    color: colors.goldWords,
    fontSize: 15,
  },
  nameWrapper: {
    width: "100%",
    height: "20%",
    paddingHorizontal: "10%",
  },
  imageWrapper: {
    width: "100%",
    height: "60%",
  },
  rankWrapper: {
    width: "100%",
    height: "20%",
    paddingHorizontal: "10%",
  },
});
