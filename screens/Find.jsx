import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import PlayerList from "../components/PlayerList";
import { db } from "../Firebase/firebase-setup";
import { collection, onSnapshot, query } from "firebase/firestore";
import PlayerClicked from "../components/PlayerClicked";
import { getPuzzleFromDB } from "../Firebase/firebase-helper";
import Map from "../components/Map";
import PressableButton from "../components/PressableButton";
import * as Location from "expo-location";

export default function Find({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [clickedPlayer, setClickedPlayer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMapMode, setIsMapMode] = useState(false);
  const [permissionInfo, requestPermission] =
    Location.useForegroundPermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "users"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const players = querySnapshot.docs.map((player) => player.data());
        setPlayers(players);
      } else {
        setPlayers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  async function clickHandler(player) {
    const puzzleData = await getPuzzleFromDB(player.id);

    puzzleExists = puzzleData ? true : false;

    setClickedPlayer({
      ...player,
      puzzle: puzzleData?.puzzle,
      puzzleId: puzzleData?.id,
      puzzleWin: puzzleData?.win,
      puzzleLose: puzzleData?.lose,
      puzzleCover: puzzleData?.coverImageUri,
      puzzleExists: puzzleExists,
    });
    setModalVisible(true);
  }

  function challengeHandler(clickedPlayer) {
    //using navigation.replace leads to app crash
    //due to a bug in react-navigation
    //i.e. using replace on modal leads to app crash
    navigation.navigate("Game", { clickedPlayer });
    closeHandler();
  }

  function closeHandler() {
    setModalVisible(false);
    setClickedPlayer(null);
  }

  async function verifyPermission() {
    if (permissionInfo.granted === true) {
      return true;
    } else {
      const response = await requestPermission();
      return response.granted;
    }
  }

  const locateUserHandler = async () => {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        setHasPermission(false);
        Alert.alert("You need to give access to location");
        return;
      }
      setHasPermission(true);
      const currentLocation = await Location.getCurrentPositionAsync();
      setInitialRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (err) {
      console.log("error happened while getting current location", err);
    }
  };

  return (
    <View style={{flex: 1}} >
      <PlayerClicked
        clickedPlayer={clickedPlayer}
        modalVisible={modalVisible}
        challengeHandler={challengeHandler}
        closeHandler={closeHandler}
      />
      <Text>======</Text>
      <PressableButton
        onPress={() => {
          locateUserHandler();
          setIsMapMode(true);
        }}
      >
        <Text>map mode</Text>
      </PressableButton>
      <Text>======</Text>
      <Text>======</Text>
      <PressableButton
        onPress={() => {
          setIsMapMode(false);
        }}
      >
        <Text>list mode</Text>
      </PressableButton>
      <Text>======</Text>

      {
        isMapMode ?
        <>
          <Map hasPermission={hasPermission} initialRegion={initialRegion} />
        </>
        :
        <>
          <Text>player list -- clickable</Text>
          <Text>======</Text>
          <PlayerList players={players} clickHandler={clickHandler} />
          <Text>======</Text>
        </>
      }
    </View>
  );
}
