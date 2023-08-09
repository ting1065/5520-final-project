import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import PressableButton from '../components/PressableButton'
import PlayerList from '../components/PlayerList'
import { auth, db } from '../Firebase/firebase-setup'
import { collection, onSnapshot, query } from "firebase/firestore";

export default function Find({ navigation }) {

  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [refreshHandler, setRefreshHandler] = useState(false);

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

  function clickHandler() {
    return;
  }
  
  return (
    <View>
      <PressableButton onPress={() => refresh()}>
        <Text>refresh</Text>
      </PressableButton>
      <Text>======</Text>
      <Text>======</Text>
      <Text>======</Text>
      <PlayerList players={players} clickHandler={clickHandler} />
    </View>
  )
}