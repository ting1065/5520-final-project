import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import PressableButton from "../components/PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { updateUserNameInDB } from "../Firebase/firebase-helper";
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function UserNameEditor({
  currentName,
  confirmHandler,
  cancelHandler,
}) {
  const [text, setText] = useState(currentName);

  return (
    <View>
      
      <View style={styles.checkcrossContainer}>
        <View>
          <TextInput
            autoCapitalize="none"
            value={text}
            onChangeText={(text) => {
              setText(text);
            }}
            style={styles.textInput}
          />
        </View>
        
        <View style={styles.checkcrossButtons}>
          <PressableButton
            defaultStyle={styles.checkDefaultStyle}
            pressedStyle={styles.pressedStyle}
            onPress={async () => {
              await updateUserNameInDB(auth.currentUser.uid, text);
              confirmHandler();
            }}
          >
            <FontAwesome name="check-square" size={30} color="green" />
          </PressableButton>

          <PressableButton 
            defaultStyle={styles.crossDefaultStyle}
            pressedStyle={styles.pressedStyle}
            onPress={cancelHandler}>
            <Entypo name="squared-cross" size={31} color="darkred" />
          </PressableButton>
        </View>
          
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkcrossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    fontSize: 20,
    width: 200,
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 5,
    paddingLeft: 5,
    height: 35,
  },
  checkcrossButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    // width: 200,
    justifyContent: 'flex-end',

  },
  checkDefaultStyle: {
    marginRight: 10,

  },
  pressedStyle: {
    opacity: 0.5,
  }

})