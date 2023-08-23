import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { auth } from "../Firebase/firebase-setup";
import { colors } from "../styles/colors";

export default function PlayerTagInActivity({ player, isInFlatList }) {
  return (
    <View
      style={[
        isInFlatList ? styles.containerInFlatList : styles.container,
        auth.currentUser.uid === player.id
          ? styles.currentPlayerContainer
          : styles.otherPlayerContainer,
      ]}
    >
      <View style={styles.nameWrapper}>
        <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">
          {player.name}
        </Text>
      </View>
      <View style={styles.imageWrapper}>
        <Image style={styles.image} source={{ uri: player.avatar }} />
      </View>
      <View style={styles.rankWrapper}>
        <Text
          style={[styles.playerName, styles.rank]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {player.rank}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "20%",
    borderRadius: 10,
    marginLeft: 5,
  },
  containerInFlatList: {
    justifyContent: "space-between",
    alignItems: "center",
    width: 60,
    marginRight: 5,
    borderRadius: 10,
  },
  currentPlayerContainer: {
    backgroundColor: colors.selfMarker,
  },
  otherPlayerContainer: {
    backgroundColor: colors.otherMarker,
  },
  nameWrapper: {
    width: "100%",
    height: "20%",
    paddingHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    height: "60%",
  },
  rankWrapper: {
    width: "100%",
    height: "20%",
    paddingHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  playerName: {
    textAlign: "center",
    color: colors.whiteWords,
    fontSize: 8,
  },
  rank: {
    fontWeight: "bold",
  },
  image: {
    height: "100%",
    resizeMode: "contain",
  },
});
