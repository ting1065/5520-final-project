import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import PressableButton from "../components/PressableButton";
import { deletePuzzleFromDB } from "../Firebase/firebase-helper";
import { auth, db } from "../Firebase/firebase-setup";
import PuzzleEditor from "../components/PuzzleEditor";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import GradientBackground from "../components/GradientBackground";
import { colors } from '../Colors';
import Card from "../components/Card";
import { AntDesign } from '@expo/vector-icons';

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
        
        
        
      </View>

      <View style={styles.container}>
        <Text style={styles.personalInfo}>My Puzzle</Text>
        <Card
          width={340}
          height={480}
          backgroundColor={colors.loginButton}
        
        >
        {puzzleDoc ? (
        <>
          <Image
            style={styles.image}
            source={{ uri: puzzleDoc.coverImageUri }}
          />
          <Text style={styles.inputTitle} >Quiz 1:  {puzzleDoc.puzzle[0]}</Text>
          <Text style={styles.inputTitle} >Quiz 2:  {puzzleDoc.puzzle[1]}</Text>
          <Text style={styles.inputTitle} >Quiz 3:  {puzzleDoc.puzzle[2]}</Text>
          <Text style={styles.inputTitle} >Quiz 4:  {puzzleDoc.puzzle[3]}</Text>
          <Text style={styles.inputTitle} >Quiz 5:  {puzzleDoc.puzzle[4]}</Text>
          <View style={styles.winLoseStyle}>
            <Text style={styles.design}>Design win: {puzzleDoc.win}</Text>
            <Text style={styles.design}>Design lose: {puzzleDoc.lose}</Text>
          </View>
          <View style={styles.buttons}>
            <PressableButton
              defaultStyle={styles.editNameDefaultStyle}
              pressedStyle={styles.editNamePressedStyle}
              onPress={() => {
                setModalVisible(true);
            }}
            > 
              <View style={styles.editNameButton}>
                <AntDesign name="edit" size={24} color={colors.shadowColor} />
                <Text style={styles.inputDisplay}>Add/Update</Text>
              </View>
              
            </PressableButton>
            <PressableButton
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={async () => await deletePuzzle(puzzleDoc.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </PressableButton>
          </View>
            

        </>
      ) : (
        <>
          <Text style={styles.inputTitle}>no puzzle</Text>
          <View style={styles.buttons}>
              <PressableButton
                defaultStyle={styles.editNameDefaultStyle}
                pressedStyle={styles.editNamePressedStyle}
                onPress={() => {
                  setModalVisible(true);
              }}
              > 
                <View style={styles.editNameButton}>
                  <AntDesign name="edit" size={24} color={colors.shadowColor} />
                  <Text style={styles.inputDisplay}>Add/update</Text>
                </View>
              </PressableButton>
            </View>
          </>
      )}

        </Card>
      </View>
      
      

      
    </GradientBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  personalInfo: {
    fontSize: 25,
    alignSelf: 'center',
    marginBottom: 25,
  },
  winLoseStyle: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  inputTitle: {
    fontSize: 20,
    color: colors.redButton,
    marginVertical: 5,
    marginLeft: 70,
  },

  image: {
    marginVertical: 10,
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  defaultStyle: {
    width: 150,
    height: 45,
    marginLeft: 5,

    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: colors.redButton,
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
  pressedStyle: {
    backgroundColor: colors.pressedRedButton,
    opacity: 0.5,
  },
  loginButtonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: 'center',

  },
  design: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 10,
    color: colors.whiteWords,
  },
  buttonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: 'center',

  },
  editNameButton: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  editNameDefaultStyle: {
    width: 150,
    height: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginRight: 5,

  },
  editNamePressedStyle: {
    opacity: 0.5,
  },
  inputDisplay: {
    fontSize: 20,
    marginLeft: 5,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
