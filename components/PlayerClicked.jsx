import { View, Text, Modal, Image, StyleSheet } from 'react-native'
import React from 'react'
import PressableButton from './PressableButton'
import { auth } from '../Firebase/firebase-setup'

export default function PlayerClicked({ clickedPlayer, modalVisible, challengeHandler, closeHandler }) {
  return (
    <Modal visible={modalVisible} animationType='slide'>
      <View style={styles.container}>
        {clickedPlayer &&
        <>
          <Text>{clickedPlayer.name}</Text>
          <Text>win: {clickedPlayer.win}</Text>
          <Text>lose: {clickedPlayer.lose}</Text>
          <Text>===========</Text>
          <Text>{clickedPlayer.name}'s puzzle</Text>
          { clickedPlayer.puzzleExists ?
            <>
              <Image style={{width:200, height:200}} source={{uri: clickedPlayer.puzzleCover}} />
              <Text>puzzle win: {clickedPlayer.puzzleWin}</Text>
              <Text>puzzle lose: {clickedPlayer.puzzleLose}</Text>
              {(auth.currentUser.uid !== clickedPlayer.id) && 
                <>
                <Text>===========</Text>
                <PressableButton onPress={()=>challengeHandler(clickedPlayer)}>
                  <Text>challenge button</Text>
                </PressableButton>
                <Text>===========</Text>
                </>
              }
            </> :
            <Text>this player has not designed puzzle yet</Text>
          }
        </>
        }
        <Text>===========</Text>
        <PressableButton onPress={()=>closeHandler()}>
          <Text>close button</Text>
        </PressableButton>
        <Text>===========</Text>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});