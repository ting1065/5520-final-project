import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../Firebase/firebase-setup";

const PlayersContext = createContext();

export default function PlayersProvider({ children }) {
  const [players, setPlayers] = useState([]);

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

  return (
    <PlayersContext.Provider value={{ players }}>
      {children}
    </PlayersContext.Provider>
  );
}

export const usePlayers = () => useContext(PlayersContext);
