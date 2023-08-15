import { View, Text, Pressable, Alert } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "./PressableButton";
import PlayerMarker from "./PlayerMarker";
import { updateUserLocationInDB } from "../Firebase/firebase-helper";

export default function Map({
  hasPermission,
  initialRegion,
  players,
  playerClickHandler,
}) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!selectedLocation) {
      return;
    };

    Alert.alert("Base Change", "Change your base to this spot?", [
      {
        text: "Cancel",
        onPress: () => {
          setSelectedLocation(null);
        }
      },
      {
        text: "Confirm",
        onPress: async () => {
          const locationToBeUpdated = selectedLocation;
          setSelectedLocation(null);
          await updateUserLocationInDB(auth.currentUser.uid, locationToBeUpdated);
        },
      },
    ]);
  }, [selectedLocation]);

  function moveToBaseHandler() {
    const currentUser = players.find((player) => player.id === auth.currentUser.uid);
    if (!currentUser.location) {
      Alert.alert("No base", "You don't have a base yet. Click on the map to set your base.");
      return;
    }
    mapRef.current.animateToRegion({
      latitude: currentUser.location.latitude,
      longitude: currentUser.location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  return (
    <>
      {hasPermission ? (
        <>
          <Text>=====</Text>
          <PressableButton onPress={moveToBaseHandler}>
            <Text>go to my base</Text>
          </PressableButton>
          <Text>=====</Text>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={initialRegion}
            provider="google"
            showsUserLocation={true}
            showsMyLocationButton={true}
            onPress={(e) => {
              setSelectedLocation({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
          >
            {selectedLocation && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
              />
            )}
            {players
              .filter((player) => player.location)
              .map((playerWithLocation) => (
                <PlayerMarker
                  key={playerWithLocation.id}
                  player={playerWithLocation}
                  clickHandler={playerClickHandler}
                />
              ))}
          </MapView>
        </>
      ) : (
        <Text>You need to give access to location</Text>
      )}
    </>
  );
}
