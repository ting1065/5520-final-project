import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import PressableButton from "../components/PressableButton";
import { deletePuzzleFromDB } from "../Firebase/firebase-helper";
import { auth, db } from "../Firebase/firebase-setup";
import PuzzleEditor from "../components/PuzzleEditor";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import GradientBackground from "../components/GradientBackground";

export default function Design() {
  const [puzzleDoc, setPuzzleDoc] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "puzzles"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const docFromDB = querySnapshot.docs[0];
        setPuzzleDoc({ ...docFromDB.data(), id: docFromDB.id });
      } else {
        setPuzzleDoc(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function deletePuzzle(id) {
    await deletePuzzleFromDB(id);
  }

  function editConfirmHandler() {
    setModalVisible(false);
  }

  function editCancelHandler() {
    setModalVisible(false);
  }

  return (
    <GradientBackground>
      <View>
        <PuzzleEditor
          puzzleDoc={puzzleDoc}
          modalVisible={modalVisible}
          confirmHandler={editConfirmHandler}
          cancelHandler={editCancelHandler}
        />
        <Text>=====</Text>
        <PressableButton
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text>add/update</Text>
        </PressableButton>
        <Text>=====</Text>
      </View>

      <Text>=====</Text>
      <Text>Below is your puzzle</Text>
      <Text>=====</Text>

      {puzzleDoc ? (
        <>
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: puzzleDoc.coverImageUri }}
          />
          <Text>quiz 1:{puzzleDoc.puzzle[0]}</Text>
          <Text>quiz 2:{puzzleDoc.puzzle[1]}</Text>
          <Text>quiz 3:{puzzleDoc.puzzle[2]}</Text>
          <Text>quiz 4:{puzzleDoc.puzzle[3]}</Text>
          <Text>quiz 5:{puzzleDoc.puzzle[4]}</Text>
          <Text>design win: {puzzleDoc.win}</Text>
          <Text>design lose: {puzzleDoc.lose}</Text>
          <Text>=====</Text>
          <PressableButton
            onPress={async () => await deletePuzzle(puzzleDoc.id)}
          >
            <Text>delete</Text>
          </PressableButton>
          <Text>=====</Text>
        </>
      ) : (
        <Text>no puzzle</Text>
      )}
    </GradientBackground>
  );
}
