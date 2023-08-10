import { Text, Image } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";
import { auth } from "../Firebase/firebase-setup";

export default function PlayerInList({ clickHandler, player }) {
  return (
    <PressableButton onPress={async () => await clickHandler(player)}>
      <Image
        style={{ width: 50, height: 50 }}
        source={{ uri: player.avatar }}
      />
      {auth.currentUser.uid === player.id && <Text> me! </Text>}
      <Text>{player.name}</Text>
    </PressableButton>
  );
}
