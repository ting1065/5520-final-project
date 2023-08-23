import { FlatList, StyleSheet } from "react-native";
import React from "react";
import PlayerTagInActivity from "./PlayerTagInActivity";

export default function ParticipantList({ participants }) {
  return (
    <FlatList
      data={participants}
      renderItem={({ item }) => (
        <PlayerTagInActivity player={item} isInFlatList={true} />
      )}
      horizontal={true}
      contentContainerStyle={styles.participantList}
    />
  );
}

const styles = StyleSheet.create({
  participantList: {
    height: "100%",
  },
});
