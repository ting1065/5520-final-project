import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

export default function PlayerTagInActivity({ player, isInFlatList }) {
  return (
    <View style={isInFlatList ? styles.containerInFlatList : styles.container}>
      <View style={styles.nameWrapper}>
        <Text style={styles.name}>{player.name.length > 9 ? `${player.name.slice(0, 9)}...` : player.name}</Text>
      </View>

      <View style={styles.avatarWrapper}>
        <Image style={styles.avatar} source={{ uri: player.avatar }} />
      </View>

      <View style={styles.rankWrapper}>
        <Text style={styles.rank}>{player.rank}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "20%",
  },
  containerInFlatList: {
    justifyContent: "space-between",
    alignItems: "center",
    width: 50,
    marginRight: 5,
  },
  nameWrapper: {
    flex: 2,
    width: "100%",
    justifyContent: "center",
  },
  name: {
    fontSize: 6,
    textAlign: "center",
  },
  avatarWrapper: {
    flex: 6,
    width: "100%",
  },
  avatar: {
    height: "100%",
    resizeMode: "contain",
  },
  rankWrapper: {
    flex: 2,
    justifyContent: "center",
    width: "100%",
  },
  rank: {
    fontSize: 6,
    textAlign: "center",
  },
});
