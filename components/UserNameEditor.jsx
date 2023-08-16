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
        <TextInput
          autoCapitalize="none"
          value={text}
          onChangeText={(text) => {
            setText(text);
          }}
        />
      
        <PressableButton
          onPress={async () => {
            await updateUserNameInDB(auth.currentUser.uid, text);
            confirmHandler();
          }}
        >
          <FontAwesome name="check-square" size={24} color="black" />
        </PressableButton>

        <PressableButton onPress={cancelHandler}>
          <Entypo name="squared-cross" size={26} color="black" />
        </PressableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkcrossContainer: {
    flexDirection: 'row',
  }

})