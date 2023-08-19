import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import PlayerList from "../components/PlayerList";
import { db, auth } from "../Firebase/firebase-setup";
import { collection, onSnapshot, query } from "firebase/firestore";
import PlayerClicked from "../components/PlayerClicked";
import { getPuzzleFromDB } from "../Firebase/firebase-helper";
import Map from "../components/Map";
import PressableButton from "../components/PressableButton";
import * as Location from "expo-location";
import GradientBackground from "../components/GradientBackground";
import { colors } from '../styles/colors';
import { FontAwesome } from '@expo/vector-icons';

export default function Find({ navigation, route }) {
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
        const playersWithRank = addRankToPlayers(players);
        setPlayers(playersWithRank);
      } else {
        setPlayers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (route.params?.isMapMode) {
      setIsMapMode(true);
    }
  }, []);

  function addRankToPlayers(players) {
    const sortedPlayers = players.sort((a, b) => {
      return b.score - a.score;
    });

    if (sortedPlayers.length === 1) {
      sortedPlayers[0].rank = 1;
      return sortedPlayers;
    }

    //add rank field to each player object
    let rank = 1;
    let currentUserIndex = 0;
    sortedPlayers[0].rank = rank;
    for (let i = 1; i < sortedPlayers.length; i++) {
      if (sortedPlayers[i].id === auth.currentUser.uid) {
        currentUserIndex = i;
      }

      if (sortedPlayers[i].score === sortedPlayers[i - 1].score) {
        sortedPlayers[i].rank = rank;
      } else {
        sortedPlayers[i].rank = i + 1;
        rank = i + 1;
      }
    }

    //insert the current user's player object at the beginning of the array
    const currentUser = sortedPlayers[currentUserIndex];
    sortedPlayers.splice(currentUserIndex, 1);
    sortedPlayers.unshift(currentUser);

    return sortedPlayers;

  }

  async function clickHandler(player) {
    setModalVisible(true);
    const puzzleData = await getPuzzleFromDB(player.id);

    puzzleExists = puzzleData ? true : false;

    setClickedPlayer({
      ...player,
      puzzle: puzzleData?.puzzle,
      puzzleId: puzzleData?.id,
      puzzleWin: puzzleData?.win,
      puzzleLose: puzzleData?.lose,
      puzzleCover: puzzleData?.coverImageUri,
      puzzleWinners: puzzleData?.winners,
      puzzleExists: puzzleExists,
    });
  }

  function challengeHandler(clickedPlayer) {
    //using navigation.replace leads to app crash
    //due to a bug in react-navigation
    //i.e. using replace on modal leads to app crash
    navigation.navigate("Game", { clickedPlayer, isMapMode });
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
      const currentLocation = await Location.getLastKnownPositionAsync();
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
    <GradientBackground>
      <View style={styles.container}>
        <PlayerClicked
          clickedPlayer={clickedPlayer}
          modalVisible={modalVisible}
          challengeHandler={challengeHandler}
          closeHandler={closeHandler}
        />
        <View style={styles.modeContainer}>
          <PressableButton
            defaultStyle={styles.mode1DefaultStyle}
            pressedStyle={styles.mode1PressedStyle}

            onPress={() => {
              setIsMapMode(true);
              locateUserHandler();
            }}
          > 
            <FontAwesome name="map-pin" size={24} color="black" />
            <Text style={styles.modeText}>Map Mode</Text>
          </PressableButton>
          <PressableButton
            defaultStyle={styles.mode1DefaultStyle}
            pressedStyle={styles.mode1PressedStyle}
            onPress={() => {
              setIsMapMode(false);
            }}
          >
            <FontAwesome name="list-alt" size={24} color="black" />
            <Text style={styles.modeText}>List Mode</Text>
          </PressableButton>
        </View>
          

        

        {isMapMode ? (
          <>
            <Map
              hasPermission={hasPermission}
              initialRegion={initialRegion}
              players={players}
              playerClickHandler={clickHandler}
            />
          </>
        ) : (
          <>
            <PlayerList players={players} clickHandler={clickHandler} />

          </>
        )}
      </View>
    </GradientBackground>
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
    width: 120,
    height: 60,
    margin: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: colors.whiteWords,
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
    fontSize: 20,
  },
})