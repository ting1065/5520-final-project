import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import PressableButton from '../components/PressableButton'
import { auth } from "../Firebase/firebase-setup";
import { updateUserNameInDB } from '../Firebase/firebase-helper';

export default function UserNameEditor({ currentName, confirmHandler, cancelHandler}) {

  const [text, setText] = useState(currentName);
  
  return (
    <View>
      <TextInput autoCapitalize="none" value={text} onChangeText={(text)=>{setText(text)}}/>
      <PressableButton onPress={async ()=>{
        await updateUserNameInDB(auth.currentUser.uid, text);
        confirmHandler();
      }}>
        <Text>V</Text>
      </PressableButton>
      <PressableButton onPress={cancelHandler}>
        <Text>X</Text>
      </PressableButton>
    </View>
  )
}