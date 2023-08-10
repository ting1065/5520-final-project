import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import PressableButton from "../components/PressableButton";
import { getPuzzleFromDB, deletePuzzleFromDB } from "../Firebase/firebase-helper";
import { auth } from "../Firebase/firebase-setup";
import PuzzleEditor from "../components/PuzzleEditor";

export default function Design() {
  const [puzzleDoc, setPuzzleDoc] = useState(null);
  const [refreshHandler, setRefreshHandler] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchPuzzle = async () => {
      if (active) {
        const puzzle = await getPuzzleFromDB(auth.currentUser.uid);
        setPuzzleDoc(puzzle);
      }
    };

    fetchPuzzle();

    return () => {
      active = false;
    };
  }, [refreshHandler]);

  async function deletePuzzle(id) {
    await deletePuzzleFromDB(id);
    setRefreshHandler(!refreshHandler);
  }

  function editConfirmHandler() {
    setModalVisible(false);
    setRefreshHandler(!refreshHandler);
  };

  function editCancelHandler() {
    setModalVisible(false);
  };

  return (
    <>
      <View>
        <PuzzleEditor puzzleDoc={puzzleDoc} modalVisible={modalVisible} confirmHandler={editConfirmHandler} cancelHandler={editCancelHandler}/>
        <Text>=====</Text>
        <PressableButton
          onPress={async () =>
            {setModalVisible(true);}
          }
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
          <Image style={{width:200, height:200}} source={{uri: puzzleDoc.coverImageUri}} />
          <Text>quiz 1:{puzzleDoc.puzzle[0]}</Text>
          <Text>quiz 2:{puzzleDoc.puzzle[1]}</Text>
          <Text>quiz 3:{puzzleDoc.puzzle[2]}</Text>
          <Text>quiz 4:{puzzleDoc.puzzle[3]}</Text>
          <Text>quiz 5:{puzzleDoc.puzzle[4]}</Text>
          <Text>design win: {puzzleDoc.win}</Text>
          <Text>design lose: {puzzleDoc.lose}</Text>
          <Text>=====</Text>
          <PressableButton onPress={async () => await deletePuzzle(puzzleDoc.id)}>
            <Text>delete</Text>
          </PressableButton>
          <Text>=====</Text>
        </>
      ) : (
        <Text>no puzzle</Text>
      )}
    </>
  );
}
