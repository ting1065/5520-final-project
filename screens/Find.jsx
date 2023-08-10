import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import PressableButton from "../components/PressableButton";
import PlayerList from "../components/PlayerList";
import { auth, db } from "../Firebase/firebase-setup";
import { collection, onSnapshot, query } from "firebase/firestore";
import PlayerClicked from "../components/PlayerClicked";
import { getPuzzleFromDB } from "../Firebase/firebase-helper";

export default function Find({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [clickedPlayer, setClickedPlayer] = useState(null);
  const [refreshHandler, setRefreshHandler] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
  }, [refreshHandler]);

  function refresh() {
    setRefreshHandler(!refreshHandler);
  }

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

  return (
    <View>
      <PlayerClicked
        clickedPlayer={clickedPlayer}
        modalVisible={modalVisible}
        challengeHandler={challengeHandler}
        closeHandler={closeHandler}
      />
      <Text>======</Text>
      <PressableButton onPress={() => refresh()}>
        <Text>refresh button</Text>
      </PressableButton>
      <Text>======</Text>
      <Text>player list -- clickable</Text>
      <PlayerList players={players} clickHandler={clickHandler} />
    </View>
  );
}
