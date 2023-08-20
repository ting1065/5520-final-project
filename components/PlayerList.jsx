import { FlatList, StyleSheet } from "react-native";
import React from "react";
import PlayerInList from "./PlayerInList";

export default function PlayerList({ players, clickHandler }) {
  return (
    <FlatList
      data={players}
      renderItem={({ item }) => (
        <PlayerInList clickHandler={clickHandler} player={item} />
      )}
    />
  );
}