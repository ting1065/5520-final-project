import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "./PressableButton";
import PlayerMarker from "./PlayerMarker";
import { updateUserLocationInDB } from "../Firebase/firebase-helper";
import { colors } from '../Colors';

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
    }

    Alert.alert("Base Change", "Change your base to this spot?", [
      {
        text: "Cancel",
        onPress: () => {
          setSelectedLocation(null);
        },
      },
      {
        text: "Confirm",
        onPress: async () => {
          const locationToBeUpdated = selectedLocation;
          setSelectedLocation(null);
          await updateUserLocationInDB(
            auth.currentUser.uid,
            locationToBeUpdated
          );
        },
      },
    ]);
  }, [selectedLocation]);

  function moveToBaseHandler() {
    const currentUser = players.find(
      (player) => player.id === auth.currentUser.uid
    );
    if (!currentUser.location) {
      Alert.alert(
        "No base",
        "You don't have a base yet. Click on the map to set your base."
      );
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
          
          <PressableButton 
             defaultStyle={styles.mode1DefaultStyle}
             pressedStyle={styles.mode1PressedStyle}
            onPress={moveToBaseHandler}
          >
            <Text style={styles.modeText}>My Base</Text>
          </PressableButton>
          
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: '100%',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',

  },
  mode1DefaultStyle: {
    width: 140,
    height: 50,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    backgroundColor: colors.shadowColor,
    // Add platform-specific shadow
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
  mode1PressedStyle: {
    opacity: 0.5,
  },
  modeText: {
    fontSize: 15,
    color: colors.whiteWords

  }
})
