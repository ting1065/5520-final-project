import { View, Text, Image } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { Marker } from "react-native-maps";

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
      <Text>{player.name}</Text>
      <Image
        style={{ width: 50, height: 50 }}
        source={{ uri: player.avatar }}
      />
      {auth.currentUser.uid === player.id && <Text> me! </Text>}
    </Marker>
  );
}
